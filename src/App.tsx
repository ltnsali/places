import { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import type { IstanbulPlace, PlaceFilter } from './types/places';
import { placesService, PLACE_CATEGORIES } from './services/placesService';
import PlacesList from './components/PlacesList.tsx';
import PlaceFilters from './components/PlaceFilters.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import './App.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// İstanbul merkez koordinatları
const ISTANBUL_CENTER = {
  lat: 41.0082,
  lng: 28.9784
};

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
  const [filter, setFilter] = useState<PlaceFilter>({
    category: 'all',
    minRating: 4.0,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  // İlk yükleme - popüler mekanları getir
  useEffect(() => {
    loadInitialPlaces();
  }, []);

  // Filter değiştiğinde mekanları filtrele
  useEffect(() => {
    if (places.length > 0) {
      const filtered = placesService.filterAndSortPlaces(places, filter);
      setFilteredPlaces(filtered);
    }
  }, [places, filter]);

  const loadInitialPlaces = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Popüler mekanları getir
      const response = await placesService.getTopRatedPlaces({
        minRating: 4.0,
        pageSize: 20
      });

      if (response.places && response.places.length > 0) {
        const enhancedPlaces = response.places.map(place => 
          placesService.enhancePlaceData(place)
        );
        setPlaces(enhancedPlaces);
      } else {
        setError('İstanbul\'da mekan bulunamadı. Lütfen API anahtarınızın doğru olduğunu kontrol edin.');
      }
    } catch (err) {
      console.error('Error loading places:', err);
      setError(err instanceof Error ? err.message : 'Mekanlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlacesByCategory = async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (category === 'all') {
        response = await placesService.getTopRatedPlaces({
          minRating: filter.minRating || 4.0,
          pageSize: 20
        });
      } else {
        response = await placesService.getPlacesByCategory(category, {
          minRating: filter.minRating || 3.5,
          pageSize: 20
        });
      }

      if (response.places && response.places.length > 0) {
        const enhancedPlaces = response.places.map(place => 
          placesService.enhancePlaceData(place)
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
    
    // Kategori değiştiyse yeni veriler getir
    if (newFilter.category !== filter.category) {
      loadPlacesByCategory(newFilter.category || 'all');
    }
  };

  const handlePlaceSelect = (place: IstanbulPlace) => {
    setSelectedPlace(place);
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
              <h1>🏙️ İstanbul'da En Çok Oy Alan Mekanlar</h1>
              <p>Google Maps verilerine göre İstanbul'daki en popüler ve yüksek puanlı mekanları keşfedin</p>
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
                <button onClick={loadInitialPlaces} className="retry-button">
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
            <Map
              defaultZoom={11}
              defaultCenter={ISTANBUL_CENTER}
              mapId="istanbul-places-map"
              gestureHandling="greedy"
              clickableIcons={false}
            >
              <PlaceMarkers
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelect}
              />
            </Map>
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
