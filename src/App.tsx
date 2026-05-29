import { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, type MapMouseEvent } from '@vis.gl/react-google-maps';
import type { IstanbulPlace, PlaceFilter, Location } from './types/places';
import { placesService, PLACE_CATEGORIES, DEFAULT_SEARCH_RADIUS } from './services/placesService';
import PlacesList from './components/PlacesList.tsx';
import PlaceFilters from './components/PlaceFilters.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import MapControls from './components/MapControls.tsx';
import SearchRadiusCircle from './components/SearchRadiusCircle.tsx';
import './App.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Geolocation başarısız olursa kullanılacak fallback konum (İstanbul merkez)
const FALLBACK_LOCATION: Location = {
  latitude: 41.0082,
  longitude: 28.9784
};

// Arama yarıçapı sınırları (metre)
const MIN_SEARCH_RADIUS = 500;
const MAX_SEARCH_RADIUS = 50000;

interface PlaceMarkersProps {
  places: IstanbulPlace[];
  selectedPlace: IstanbulPlace | null;
  onPlaceSelect: (place: IstanbulPlace) => void;
}

function PlaceMarkers({ places, selectedPlace, onPlaceSelect }: PlaceMarkersProps) {
  const map = useMap();

  const handleMarkerClick = useCallback((place: IstanbulPlace) => {
    onPlaceSelect(place);
    if (map && place.location) {
      map.panTo({ lat: place.location.latitude, lng: place.location.longitude });
      map.setZoom(16);
    }
  }, [map, onPlaceSelect]);

  return (
    <>
      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={{
            lat: place.location.latitude,
            lng: place.location.longitude
          }}
          clickable={true}
          onClick={() => handleMarkerClick(place)}
        >
          <Pin
            background={selectedPlace?.id === place.id ? '#EA4335' : '#4285F4'}
            glyphColor={'#fff'}
            borderColor={'#fff'}
            scale={selectedPlace?.id === place.id ? 1.2 : 1}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}

function App() {
  const [places, setPlaces] = useState<IstanbulPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<IstanbulPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<IstanbulPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'manual'>('idle');
  const [searchRadius, setSearchRadius] = useState<number>(DEFAULT_SEARCH_RADIUS);
  const [filter, setFilter] = useState<PlaceFilter>({
    category: 'all',
    minRating: 4.0,
    minUserRatingCount: 100,
    sortBy: 'userRatingCount',
    sortOrder: 'desc'
  });

  const skipRadiusReload = useRef(true);

  // İlk yükleme - kullanıcı konumunu al
  useEffect(() => {
    requestUserLocation();
  }, []);

  // Kullanıcı konumu hazır olduğunda mekanları getir
  useEffect(() => {
    if (userLocation) {
      loadPlacesAtLocation(userLocation, filter.category || 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  // Arama yarıçapı değiştiğinde mekanları yeniden yükle (debounced)
  useEffect(() => {
    if (skipRadiusReload.current) {
      skipRadiusReload.current = false;
      return;
    }
    if (!userLocation) return;
    const timer = setTimeout(() => {
      loadPlacesAtLocation(userLocation, filter.category || 'all');
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRadius]);

  // Filter değiştiğinde mekanları filtrele
  useEffect(() => {
    if (places.length > 0) {
      const filtered = placesService.filterAndSortPlaces(places, {
        ...filter,
        maxDistanceKm: searchRadius / 1000,
      });
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces([]);
    }
  }, [places, filter, searchRadius]);

  const requestUserLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('denied');
      setError('Tarayıcınız konum servisini desteklemiyor. Varsayılan konum kullanılıyor.');
      setUserLocation(FALLBACK_LOCATION);
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationStatus('granted');
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        setLocationStatus('denied');
        setError('Konum izni alınamadı. Varsayılan konum kullanılıyor.');
        setUserLocation(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleGoToCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setLocationStatus('requesting');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationStatus('granted');
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        setLocationStatus('denied');
        setError('Konum bilgisi alınamadı. Lütfen tarayıcı konum izinlerini kontrol edin.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const handleRadiusChange = (newRadius: number) => {
    const clamped = Math.max(MIN_SEARCH_RADIUS, Math.min(MAX_SEARCH_RADIUS, newRadius));
    setSearchRadius(clamped);
  };

  const loadPlacesAtLocation = async (location: Location, category: string) => {
    if (category && category !== 'all') {
      await loadPlacesByCategory(category);
    } else {
      await loadInitialPlaces(location);
    }
  };

  const loadInitialPlaces = async (location: Location) => {
    try {
      setIsLoading(true);
      setError(null);

      // Kullanıcının konumu etrafındaki popüler mekanları getir
      const response = await placesService.getTopRatedPlaces({
        userLocation: location,
        radius: searchRadius,
        pageSize: 20
      });

      if (response.places && response.places.length > 0) {
        const enhancedPlaces = response.places.map(place => 
          placesService.enhancePlaceData(place, location)
        );
        setPlaces(enhancedPlaces);
      } else {
        setError('Konumunuz etrafında mekan bulunamadı. Lütfen API anahtarınızın doğru olduğunu kontrol edin.');
      }
    } catch (err) {
      console.error('Error loading places:', err);
      setError(err instanceof Error ? err.message : 'Mekanlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlacesByCategory = async (category: string) => {
    if (!userLocation) return;

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (category === 'all') {
        response = await placesService.getTopRatedPlaces({
          userLocation,
          radius: searchRadius,
          pageSize: 20
        });
      } else {
        response = await placesService.getPlacesByCategory(category, {
          userLocation,
          radius: searchRadius,
          pageSize: 20
        });
      }

      if (response.places && response.places.length > 0) {
        const enhancedPlaces = response.places.map(place => 
          placesService.enhancePlaceData(place, userLocation)
        );
        setPlaces(enhancedPlaces);
        setSelectedPlace(null);
      } else {
        setPlaces([]);
        setError('Bu kategoride mekan bulunamadı.');
      }
    } catch (err) {
      console.error('Error loading places by category:', err);
      setError(err instanceof Error ? err.message : 'Mekanlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilter: PlaceFilter) => {
    setFilter(newFilter);

    if (
      newFilter.category !== filter.category ||
      newFilter.minRating !== filter.minRating
    ) {
      loadPlacesByCategory(newFilter.category || 'all');
    }
  };

  const handlePlaceSelect = (place: IstanbulPlace) => {
    setSelectedPlace(place);
  };

  // Kullanıcı haritada boş bir noktaya tıklayınca arama merkezini oraya taşı
  const handleMapClick = (ev: MapMouseEvent) => {
    const latLng = ev.detail.latLng;
    if (!latLng) return;
    setUserLocation({ latitude: latLng.lat, longitude: latLng.lng });
    setLocationStatus('manual');
    setSelectedPlace(null);
    setError(null);
  };

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return (
      <div className="app-error">
        <h1>Google Maps API Anahtarı Gerekli</h1>
        <p>
          Lütfen <code>.env</code> dosyasında <code>VITE_GOOGLE_MAPS_API_KEY</code> 
          değişkenini Google Maps Platform API anahtarınızla güncelleyin.
        </p>
        <p>
          API anahtarı almak için: 
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={API_KEY} 
      onLoad={() => console.log('Maps API loaded successfully')}
    >
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-text">
              <h1>📍 Konumunuz Etrafındaki En Çok Oy Alan Mekanlar</h1>
              <p>
                {locationStatus === 'granted'
                  ? 'Bulunduğunuz konum etrafındaki popüler ve yüksek puanlı mekanları keşfedin'
                  : locationStatus === 'requesting'
                  ? 'Konumunuz alınıyor...'
                  : locationStatus === 'manual'
                  ? '📍 Haritada seçilen konum etrafında aranıyor'
                  : 'Konum izni verilmedi - varsayılan konum kullanılıyor'}
              </p>
            </div>
            <div className="header-filters">
              <PlaceFilters
                filter={filter}
                categories={PLACE_CATEGORIES}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
              />
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="app-sidebar">
            {isLoading && <LoadingSpinner />}
            
            {error && (
              <div className="error-message">
                <h3>⚠️ Hata</h3>
                <p>{error}</p>
                <button
                  onClick={() => userLocation && loadPlacesAtLocation(userLocation, filter.category || 'all')}
                  className="retry-button"
                  disabled={!userLocation}
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <PlacesList
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelect}
              />
            )}
          </div>

          <div className="app-map">
            {userLocation ? (
              <>
                <Map
                  defaultZoom={14}
                  defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  mapId="nearby-places-map"
                  gestureHandling="greedy"
                  clickableIcons={false}
                  onClick={handleMapClick}
                >
                  <AdvancedMarker
                    position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  >
                    <Pin
                      background={'#34A853'}
                      glyphColor={'#fff'}
                      borderColor={'#fff'}
                      scale={1.3}
                    />
                  </AdvancedMarker>
                  <SearchRadiusCircle center={userLocation} radius={searchRadius} />
                  <PlaceMarkers
                    places={filteredPlaces}
                    selectedPlace={selectedPlace}
                    onPlaceSelect={handlePlaceSelect}
                  />
                  <MapControls
                    userLocation={userLocation}
                    radius={searchRadius}
                    minRadius={MIN_SEARCH_RADIUS}
                    maxRadius={MAX_SEARCH_RADIUS}
                    isLocating={locationStatus === 'requesting'}
                    onRadiusChange={handleRadiusChange}
                    onGoToCurrentLocation={handleGoToCurrentLocation}
                  />
                </Map>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </main>

        <footer className="app-footer">
          <p>
            🗺️ Google Maps Platform kullanılarak geliştirilmiştir | 
            📊 Veriler Google Places API'den alınmaktadır
          </p>
        </footer>
      </div>
    </APIProvider>
  );
}

export default App;
