import type { PlacesTextSearchRequest, PlacesTextSearchResponse, IstanbulPlace, PlaceCategory, Place } from '../types/places';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// İstanbul sınırları - güneybatı ve kuzeydoğu köşe koordinatları
const ISTANBUL_BOUNDS = {
  southwest: { latitude: 40.8024, longitude: 28.5939 },
  northeast: { latitude: 41.3355, longitude: 29.4819 }
};

// İstanbul merkez koordinatları
const ISTANBUL_CENTER = {
  latitude: 41.0082,
  longitude: 28.9784
};

// Popüler mekan kategorileri
export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: 'restaurant',
    name: 'Restoranlar',
    types: ['restaurant', 'meal_takeaway', 'meal_delivery'],
    icon: '🍽️'
  },
  {
    id: 'tourist_attraction',
    name: 'Turistik Yerler',
    types: ['tourist_attraction', 'museum', 'art_gallery'],
    icon: '🏛️'
  },
  {
    id: 'shopping_mall',
    name: 'Alışveriş Merkezleri',
    types: ['shopping_mall', 'department_store', 'store'],
    icon: '🛍️'
  },
  {
    id: 'cafe',
    name: 'Kafeler',
    types: ['cafe', 'bakery', 'coffee_shop'],
    icon: '☕'
  },
  {
    id: 'park',
    name: 'Parklar',
    types: ['park', 'amusement_park', 'zoo'],
    icon: '🌳'
  },
  {
    id: 'night_club',
    name: 'Gece Hayatı',
    types: ['night_club', 'bar', 'casino'],
    icon: '🌃'
  },
  {
    id: 'lodging',
    name: 'Oteller',
    types: ['lodging', 'hotel', 'hostel'],
    icon: '🏨'
  },
  {
    id: 'hospital',
    name: 'Sağlık',
    types: ['hospital', 'pharmacy', 'dentist'],
    icon: '🏥'
  }
];

class PlacesService {
  private async makeRequest(requestBody: PlacesTextSearchRequest): Promise<PlacesTextSearchResponse> {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('Google Maps API anahtarı .env dosyasında tanımlanmalı');
    }

    try {
      const response = await fetch(PLACES_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.location',
            'places.rating',
            'places.userRatingCount',
            'places.priceLevel',
            'places.types',
            'places.primaryType',
            'places.primaryTypeDisplayName',
            'places.businessStatus',
            'places.googleMapsUri',
            'places.websiteUri',
            'places.regularOpeningHours',
            'places.photos',
            'places.reviews',
            'places.editorialSummary',
            'places.iconMaskBaseUri',
            'places.iconBackgroundColor',
            'places.takeout',
            'places.delivery',
            'places.dineIn',
            'places.reservable',
            'places.servesBreakfast',
            'places.servesLunch',
            'places.servesDinner',
            'places.servesBeer',
            'places.servesWine',
            'places.outdoorSeating',
            'places.goodForChildren',
            'places.goodForGroups',
            'places.internationalPhoneNumber',
            'nextPageToken'
          ].join(',')
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Places API request failed:', error);
      throw error;
    }
  }

  // İstanbul'daki en çok oy alan mekanları getir
  async getTopRatedPlaces(options: {
    category?: string;
    minRating?: number;
    pageSize?: number;
    pageToken?: string;
  } = {}): Promise<PlacesTextSearchResponse> {
    const {
      category,
      minRating = 4.0,
      pageSize = 20,
      pageToken
    } = options;

    let textQuery = 'Istanbul turkey popular places';
    
    if (category) {
      const categoryData = PLACE_CATEGORIES.find(cat => cat.id === category);
      if (categoryData) {
        textQuery = `${categoryData.name} Istanbul Turkey`;
      }
    }

    const request: PlacesTextSearchRequest = {
      textQuery,
      pageSize,
      pageToken,
      languageCode: 'tr',
      regionCode: 'TR',
      locationRestriction: {
        rectangle: {
          low: ISTANBUL_BOUNDS.southwest,
          high: ISTANBUL_BOUNDS.northeast
        }
      },
      minRating,
      rankPreference: 'RELEVANCE',
      includedType: category || undefined,
      strictTypeFiltering: !!category
    };

    return this.makeRequest(request);
  }

  // Belirli bir kategorideki mekanları getir
  async getPlacesByCategory(
    category: string,
    options: {
      minRating?: number;
      pageSize?: number;
      pageToken?: string;
      openNow?: boolean;
    } = {}
  ): Promise<PlacesTextSearchResponse> {
    const {
      minRating = 3.5,
      pageSize = 20,
      pageToken,
      openNow
    } = options;

    const categoryData = PLACE_CATEGORIES.find(cat => cat.id === category);
    if (!categoryData) {
      throw new Error(`Unknown category: ${category}`);
    }

    const request: PlacesTextSearchRequest = {
      textQuery: `${categoryData.name} Istanbul Turkey high rated`,
      pageSize,
      pageToken,
      languageCode: 'tr',
      regionCode: 'TR',
      locationBias: {
        circle: {
          center: ISTANBUL_CENTER,
          radius: 25000 // 25km radius from Istanbul center
        }
      },
      includedType: categoryData.types[0],
      minRating,
      openNow,
      rankPreference: 'RELEVANCE',
      strictTypeFiltering: true
    };

    return this.makeRequest(request);
  }

  // Popüler turistik yerleri getir
  async getPopularTouristAttractions(pageToken?: string): Promise<PlacesTextSearchResponse> {
    const request: PlacesTextSearchRequest = {
      textQuery: 'Istanbul Turkey tourist attractions museums historical places',
      pageSize: 20,
      pageToken,
      languageCode: 'tr',
      regionCode: 'TR',
      locationRestriction: {
        rectangle: {
          low: ISTANBUL_BOUNDS.southwest,
          high: ISTANBUL_BOUNDS.northeast
        }
      },
      includedType: 'tourist_attraction',
      minRating: 4.0,
      rankPreference: 'RELEVANCE'
    };

    return this.makeRequest(request);
  }

  // En çok oy alan restoranları getir
  async getTopRatedRestaurants(pageToken?: string): Promise<PlacesTextSearchResponse> {
    const request: PlacesTextSearchRequest = {
      textQuery: 'Istanbul Turkey best restaurants highly rated',
      pageSize: 20,
      pageToken,
      languageCode: 'tr',
      regionCode: 'TR',
      locationBias: {
        circle: {
          center: ISTANBUL_CENTER,
          radius: 30000
        }
      },
      includedType: 'restaurant',
      minRating: 4.2,
      rankPreference: 'RELEVANCE',
      strictTypeFiltering: false
    };

    return this.makeRequest(request);
  }

  // Mekan detaylarını hesapla
  enhancePlaceData(place: Place): IstanbulPlace {
    const enhanced: IstanbulPlace = {
      ...place,
      distance: this.calculateDistance(place.location, ISTANBUL_CENTER),
      category: this.determineCategory(place.types || [])
    };

    return enhanced;
  }

  // İki koordinat arasındaki mesafeyi hesapla (Haversine formula)
  private calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Mekan tipine göre kategori belirle
  private determineCategory(types: string[]): string {
    for (const category of PLACE_CATEGORIES) {
      if (types.some(type => category.types.includes(type))) {
        return category.id;
      }
    }
    return 'other';
  }

  // Mekanları filtrele ve sırala
  filterAndSortPlaces(
    places: IstanbulPlace[],
    filter: {
      category?: string;
      minRating?: number;
      minUserRatingCount?: number;
      sortBy?: 'rating' | 'userRatingCount' | 'distance' | 'name' | 'priceLevel' | 'openNow';
      sortOrder?: 'asc' | 'desc';
    }
  ): IstanbulPlace[] {
    let filtered = [...places];

    // Filtreleme
    if (filter.category && filter.category !== 'all') {
      filtered = filtered.filter(place => place.category === filter.category);
    }

    if (filter.minRating) {
      filtered = filtered.filter(place => (place.rating || 0) >= filter.minRating!);
    }

    if (filter.minUserRatingCount) {
      filtered = filtered.filter(place => (place.userRatingCount || 0) >= filter.minUserRatingCount!);
    }

    // Sıralama
    if (filter.sortBy) {
      filtered.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (filter.sortBy) {
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'userRatingCount':
            aValue = a.userRatingCount || 0;
            bValue = b.userRatingCount || 0;
            break;
          case 'distance':
            aValue = a.distance || 0;
            bValue = b.distance || 0;
            break;
          case 'name':
            aValue = a.displayName?.text || '';
            bValue = b.displayName?.text || '';
            break;
          case 'priceLevel':
            // Price level mapping: FREE=0, INEXPENSIVE=1, MODERATE=2, EXPENSIVE=3, VERY_EXPENSIVE=4
            const priceMap: { [key: string]: number } = {
              'PRICE_LEVEL_FREE': 0,
              'PRICE_LEVEL_INEXPENSIVE': 1,
              'PRICE_LEVEL_MODERATE': 2,
              'PRICE_LEVEL_EXPENSIVE': 3,
              'PRICE_LEVEL_VERY_EXPENSIVE': 4
            };
            aValue = priceMap[a.priceLevel || ''] || 0;
            bValue = priceMap[b.priceLevel || ''] || 0;
            break;
          case 'openNow':
            aValue = a.regularOpeningHours?.openNow ? 1 : 0;
            bValue = b.regularOpeningHours?.openNow ? 1 : 0;
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filter.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue, 'tr')
            : aValue.localeCompare(bValue, 'tr');
        }

        const numA = Number(aValue);
        const numB = Number(bValue);
        
        // Değerler eşitse, rating'e göre ikincil sıralama yap
        if (numA === numB) {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // Yüksek rating önce
        }
        
        return filter.sortOrder === 'desc' ? numB - numA : numA - numB;
      });
    }

    return filtered;
  }
}

export const placesService = new PlacesService();
export default placesService;