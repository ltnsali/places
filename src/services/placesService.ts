import type { PlacesTextSearchRequest, PlacesTextSearchResponse, IstanbulPlace, PlaceCategory, Place, Location } from '../types/places';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const PLACES_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Place fields used by the FieldMask header (single source of truth)
const PLACE_FIELDS = [
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
  'places.internationalPhoneNumber'
];

// Type buckets covering Google Places Table A POI types (geographical/admin types excluded).
// Each searchNearby call returns max 20 results ranked by popularity; types are bucketed by
// expected density so rare types (beach, monument) aren't crowded out by dense types (campground, hotel).
const NEARBY_ALL_TYPE_BUCKETS: string[][] = [
  // --- SHOPPING ---
  // Groceries & daily essentials
  ['supermarket', 'grocery_store', 'hypermarket', 'discount_supermarket', 'convenience_store',
   'asian_grocery_store', 'butcher_shop', 'farmers_market', 'food_store', 'health_food_store',
   'liquor_store', 'tea_store'],
  // Big retail
  ['store', 'shopping_mall', 'department_store', 'discount_store', 'warehouse_store',
   'wholesaler', 'general_store', 'flea_market', 'market', 'thrift_store'],
  // Specialty retail
  ['hardware_store', 'home_improvement_store', 'building_materials_store', 'furniture_store',
   'home_goods_store', 'garden_center', 'electronics_store', 'cell_phone_store', 'book_store'],
  // Apparel & lifestyle retail
  ['clothing_store', 'womens_clothing_store', 'shoe_store', 'jewelry_store', 'cosmetics_store',
   'gift_shop', 'florist', 'sporting_goods_store', 'sportswear_store', 'toy_store',
   'pet_store', 'bicycle_store', 'auto_parts_store'],

  // --- FOOD & DRINK ---
  ['restaurant', 'steak_house', 'sushi_restaurant', 'fast_food_restaurant', 'food_court',
   'meal_takeaway', 'meal_delivery', 'sandwich_shop'],
  ['cafe', 'coffee_shop', 'bakery', 'dessert_shop', 'donut_shop', 'ice_cream_shop', 'juice_shop'],
  ['bar', 'pub', 'wine_bar', 'night_club'],

  // --- LODGING (split — dense type) ---
  ['hotel', 'resort_hotel', 'extended_stay_hotel', 'motel', 'inn', 'bed_and_breakfast', 'guest_house',
   'hostel', 'lodging', 'cottage', 'private_guest_room'],
  ['campground', 'camping_cabin', 'rv_park', 'farmstay', 'mobile_home_park'],

  // --- ATTRACTIONS & CULTURE ---
  ['tourist_attraction', 'visitor_center', 'tourist_information_center', 'observation_deck',
   'historical_landmark', 'historical_place', 'cultural_landmark', 'monument', 'sculpture',
   'fountain', 'plaza', 'castle'],
  ['museum', 'art_museum', 'history_museum', 'art_gallery', 'art_studio', 'planetarium', 'aquarium',
   'cultural_center', 'community_center'],
  ['performing_arts_theater', 'opera_house', 'concert_hall', 'philharmonic_hall', 'amphitheatre',
   'auditorium', 'live_music_venue', 'movie_theater', 'comedy_club', 'dance_hall'],

  // --- NATURE & COAST (kept isolated — rare types) ---
  ['beach', 'marina', 'island', 'lake', 'river', 'mountain_peak', 'scenic_spot', 'woods',
   'nature_preserve'],
  ['park', 'city_park', 'national_park', 'state_park', 'botanical_garden', 'garden',
   'dog_park', 'picnic_ground', 'barbecue_area'],

  // --- ENTERTAINMENT & RECREATION ---
  ['amusement_park', 'amusement_center', 'water_park', 'zoo', 'wildlife_park', 'wildlife_refuge',
   'ferris_wheel', 'roller_coaster'],
  ['bowling_alley', 'video_arcade', 'karaoke', 'casino', 'internet_cafe', 'movie_rental',
   'indoor_playground', 'banquet_hall', 'event_venue', 'wedding_venue', 'convention_center'],
  ['hiking_area', 'adventure_sports_center', 'cycling_park', 'go_karting_venue', 'paintball_center',
   'miniature_golf_course', 'off_roading_area', 'skateboard_park', 'vineyard'],

  // --- SPORTS & FITNESS ---
  ['gym', 'fitness_center', 'yoga_studio', 'sports_complex', 'sports_club', 'sports_activity_location',
   'arena', 'stadium', 'athletic_field', 'playground'],
  ['golf_course', 'indoor_golf_course', 'tennis_court', 'swimming_pool', 'ice_skating_rink',
   'ski_resort', 'fishing_pier', 'fishing_pond', 'fishing_charter', 'stable'],

  // --- HEALTH & WELLNESS ---
  ['hospital', 'general_hospital', 'medical_center', 'medical_clinic', 'doctor', 'dentist',
   'dental_clinic', 'medical_lab', 'chiropractor', 'physiotherapist'],
  ['pharmacy', 'drugstore', 'spa', 'massage', 'massage_spa', 'sauna', 'wellness_center',
   'skin_care_clinic', 'tanning_studio', 'public_bath'],

  // --- PERSONAL SERVICES ---
  ['beauty_salon', 'hair_salon', 'hair_care', 'barber_shop', 'nail_salon', 'makeup_artist',
   'beautician', 'body_art_service', 'foot_care'],
  ['laundry', 'tailor', 'locksmith', 'funeral_home', 'cemetery', 'veterinary_care',
   'pet_boarding_service', 'pet_care', 'storage', 'child_care_agency'],

  // --- AUTOMOTIVE & TRANSPORT ---
  ['gas_station', 'electric_vehicle_charging_station', 'ebike_charging_station', 'car_repair',
   'car_wash', 'car_dealer', 'car_rental', 'truck_dealer', 'tire_shop', 'rest_stop', 'truck_stop'],
  ['parking', 'parking_garage', 'parking_lot', 'park_and_ride', 'toll_station'],
  ['bus_station', 'bus_stop', 'train_station', 'subway_station', 'light_rail_station', 'tram_stop',
   'transit_station', 'transit_stop', 'transit_depot', 'taxi_stand', 'bike_sharing_station',
   'ferry_terminal', 'airport', 'international_airport', 'heliport'],

  // --- FINANCE & PROFESSIONAL ---
  ['bank', 'atm', 'accounting', 'insurance_agency', 'real_estate_agency', 'lawyer', 'consultant',
   'employment_agency', 'travel_agency', 'tour_agency'],

  // --- WORSHIP, EDUCATION, GOVERNMENT ---
  ['church', 'mosque', 'hindu_temple', 'buddhist_temple', 'synagogue', 'shinto_shrine'],
  ['school', 'primary_school', 'secondary_school', 'preschool', 'university',
   'educational_institution', 'academic_department', 'research_institute', 'library'],
  ['city_hall', 'courthouse', 'embassy', 'fire_station', 'police', 'post_office',
   'government_office', 'local_government_office', 'non_profit_organization',
   'association_or_organization'],

  // --- BUSINESS & TRADES ---
  ['corporate_office', 'business_center', 'coworking_space', 'manufacturer', 'supplier',
   'farm', 'ranch', 'television_studio']
];

// Varsayılan arama yarıçapı (metre)
export const DEFAULT_SEARCH_RADIUS = 5000;

// Sonuçların tarayıcı diliyle dönmesi için BCP-47 dil kodunu çek (ör. 'tr', 'en', 'ja')
function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.split('-')[0] || 'en';
}

// Bir merkez + yarıçaptan (metre) çemberi içine alan rectangle bounds hesaplar.
// Places API Text Search yalnız rectangle restriction destekler.
function circleToRectangle(center: Location, radiusMeters: number): { low: Location; high: Location } {
  const latDelta = radiusMeters / 111_320;
  const lngDelta = radiusMeters / (111_320 * Math.cos((center.latitude * Math.PI) / 180));
  return {
    low: {
      latitude: center.latitude - latDelta,
      longitude: center.longitude - lngDelta,
    },
    high: {
      latitude: center.latitude + latDelta,
      longitude: center.longitude + lngDelta,
    },
  };
}

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
          'X-Goog-FieldMask': [...PLACE_FIELDS, 'nextPageToken'].join(',')
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

  // searchNearby pagination tokenı dönmediği için FieldMask kısa tutuluyor.
  private async makeNearbyRequest(requestBody: Record<string, unknown>): Promise<PlacesTextSearchResponse> {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('Google Maps API anahtarı .env dosyasında tanımlanmalı');
    }
    try {
      const response = await fetch(PLACES_NEARBY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': PLACE_FIELDS.join(',')
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Places Nearby request failed:', error);
      throw error;
    }
  }

  // Kullanıcı konumu etrafındaki en çok oy alan mekanları getir
  async getTopRatedPlaces(options: {
    userLocation: Location;
    radius?: number;
    category?: string;
    minRating?: number;
    pageSize?: number;
    pageToken?: string;
  }): Promise<PlacesTextSearchResponse> {
    const {
      userLocation,
      radius = DEFAULT_SEARCH_RADIUS,
      category,
      minRating,
      pageSize = 20,
      pageToken
    } = options;

    const isAll = !category || category === 'all';

    // "Tüm kategoriler" için searchNearby tabanlı geniş tarama. Text Search popüler/isim-eşleşmeli
    // sonuçlara biased olduğu için Koçtaş, BIM gibi niş ama yakındaki mağazaları kaçırıyor.
    if (isAll) {
      const baseBody = {
        locationRestriction: { circle: { center: userLocation, radius } },
        languageCode: getBrowserLanguage(),
        maxResultCount: 20,
        rankPreference: 'POPULARITY' as const
      };
      const requests: Record<string, unknown>[] = [
        { ...baseBody },
        ...NEARBY_ALL_TYPE_BUCKETS.map(types => ({ ...baseBody, includedTypes: types }))
      ];
      const results = await Promise.all(
        requests.map(body => this.makeNearbyRequest(body).catch(err => {
          console.warn('Nearby bucket failed:', err);
          return { places: [] } as PlacesTextSearchResponse;
        }))
      );
      const seen = new Set<string>();
      const merged: Place[] = [];
      for (const r of results) {
        for (const p of r.places || []) {
          if (p.id && !seen.has(p.id)) {
            seen.add(p.id);
            merged.push(p);
          }
        }
      }
      if (typeof minRating === 'number' && minRating > 0) {
        return { places: merged.filter(p => (p.rating || 0) >= minRating) };
      }
      return { places: merged };
    }

    const categoryData = PLACE_CATEGORIES.find(cat => cat.id === category);
    const textQuery = categoryData?.id ?? category!;
    const includedType = categoryData?.types[0];

    const request: PlacesTextSearchRequest = {
      textQuery,
      pageSize,
      pageToken,
      languageCode: getBrowserLanguage(),
      locationRestriction: {
        rectangle: circleToRectangle(userLocation, radius)
      },
      minRating: minRating ?? 0,
      rankPreference: 'RELEVANCE',
      includedType,
      strictTypeFiltering: true
    };

    return this.makeRequest(request);
  }

  // Belirli bir kategorideki mekanları getir
  async getPlacesByCategory(
    category: string,
    options: {
      userLocation: Location;
      radius?: number;
      minRating?: number;
      pageSize?: number;
      pageToken?: string;
      openNow?: boolean;
    }
  ): Promise<PlacesTextSearchResponse> {
    const {
      userLocation,
      radius = DEFAULT_SEARCH_RADIUS,
      minRating = 0,
      pageSize = 20,
      pageToken,
      openNow
    } = options;

    const categoryData = PLACE_CATEGORIES.find(cat => cat.id === category);
    if (!categoryData) {
      throw new Error(`Unknown category: ${category}`);
    }

    const request: PlacesTextSearchRequest = {
      textQuery: categoryData.id,
      pageSize,
      pageToken,
      languageCode: getBrowserLanguage(),
      locationRestriction: {
        rectangle: circleToRectangle(userLocation, radius)
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
  async getPopularTouristAttractions(
    userLocation: Location,
    radius: number = DEFAULT_SEARCH_RADIUS,
    pageToken?: string
  ): Promise<PlacesTextSearchResponse> {
    const request: PlacesTextSearchRequest = {
      textQuery: 'tourist_attraction',
      pageSize: 20,
      pageToken,
      languageCode: getBrowserLanguage(),
      locationRestriction: {
        rectangle: circleToRectangle(userLocation, radius)
      },
      includedType: 'tourist_attraction',
      minRating: 4.0,
      rankPreference: 'RELEVANCE'
    };

    return this.makeRequest(request);
  }

  // En çok oy alan restoranları getir
  async getTopRatedRestaurants(
    userLocation: Location,
    radius: number = DEFAULT_SEARCH_RADIUS,
    pageToken?: string
  ): Promise<PlacesTextSearchResponse> {
    const request: PlacesTextSearchRequest = {
      textQuery: 'restaurant',
      pageSize: 20,
      pageToken,
      languageCode: getBrowserLanguage(),
      locationRestriction: {
        rectangle: circleToRectangle(userLocation, radius)
      },
      includedType: 'restaurant',
      minRating: 4.2,
      rankPreference: 'RELEVANCE',
      strictTypeFiltering: false
    };

    return this.makeRequest(request);
  }

  // Mekan detaylarını hesapla (referans konuma göre mesafe)
  enhancePlaceData(place: Place, referenceLocation: Location): IstanbulPlace {
    const enhanced: IstanbulPlace = {
      ...place,
      distance: this.calculateDistance(place.location, referenceLocation),
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
      maxDistanceKm?: number;
      sortBy?: 'rating' | 'userRatingCount' | 'distance' | 'name' | 'priceLevel' | 'openNow';
      sortOrder?: 'asc' | 'desc';
    }
  ): IstanbulPlace[] {
    let filtered = [...places];

    filtered = filtered.filter(place =>
      !place.businessStatus || place.businessStatus === 'OPERATIONAL'
    );

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

    if (typeof filter.maxDistanceKm === 'number') {
      filtered = filtered.filter(place => (place.distance ?? Infinity) <= filter.maxDistanceKm!);
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