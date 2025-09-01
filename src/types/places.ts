// Google Places API (New) TypeScript definitions

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Viewport {
  low: Location;
  high: Location;
}

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

export interface OpeningHours {
  openNow: boolean;
  periods: OpeningPeriod[];
  weekdayDescriptions: string[];
}

export interface OpeningPeriod {
  open: DayTime;
  close?: DayTime;
}

export interface DayTime {
  day: number;
  hour: number;
  minute: number;
  date?: {
    year: number;
    month: number;
    day: number;
  };
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: AuthorAttribution[];
}

export interface AuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: DisplayName;
  originalText: DisplayName;
  authorAttribution: AuthorAttribution;
  publishTime: string;
}

export interface Place {
  id: string;
  name: string;
  displayName: DisplayName;
  types: string[];
  primaryType: string;
  primaryTypeDisplayName?: DisplayName;
  formattedAddress: string;
  shortFormattedAddress?: string;
  addressComponents: AddressComponent[];
  location: Location;
  viewport: Viewport;
  rating?: number;
  googleMapsUri: string;
  websiteUri?: string;
  regularOpeningHours?: OpeningHours;
  utcOffsetMinutes?: number;
  photos?: Photo[];
  adrFormatAddress: string;
  businessStatus: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  priceLevel?: 'PRICE_LEVEL_FREE' | 'PRICE_LEVEL_INEXPENSIVE' | 'PRICE_LEVEL_MODERATE' | 'PRICE_LEVEL_EXPENSIVE' | 'PRICE_LEVEL_VERY_EXPENSIVE';
  userRatingCount?: number;
  iconMaskBaseUri?: string;
  iconBackgroundColor?: string;
  takeout?: boolean;
  delivery?: boolean;
  dineIn?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  servesBrunch?: boolean;
  servesVegetarianFood?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  goodForChildren?: boolean;
  goodForGroups?: boolean;
  allowsDogs?: boolean;
  restroom?: boolean;
  goodForWatchingSports?: boolean;
  paymentOptions?: {
    acceptsCashOnly?: boolean;
    acceptsCreditCards?: boolean;
    acceptsDebitCards?: boolean;
    acceptsNfc?: boolean;
  };
  parkingOptions?: {
    freeParking?: boolean;
    freeParkingLot?: boolean;
    paidParking?: boolean;
    paidParkingLot?: boolean;
    freeStreetParking?: boolean;
    paidStreetParking?: boolean;
    valetParking?: boolean;
    freeGarageParking?: boolean;
    paidGarageParking?: boolean;
  };
  reviews?: Review[];
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  editorialSummary?: DisplayName;
  generativeSummary?: DisplayName;
}

export interface PlacesTextSearchResponse {
  places: Place[];
  nextPageToken?: string;
}

export interface PlacesTextSearchRequest {
  textQuery: string;
  pageSize?: number;
  pageToken?: string;
  languageCode?: string;
  regionCode?: string;
  locationBias?: {
    rectangle?: {
      low: Location;
      high: Location;
    };
    circle?: {
      center: Location;
      radius: number;
    };
  };
  locationRestriction?: {
    rectangle: {
      low: Location;
      high: Location;
    };
  };
  includedType?: string;
  openNow?: boolean;
  minRating?: number;
  maxResultCount?: number;
  priceLevels?: string[];
  strictTypeFiltering?: boolean;
  rankPreference?: 'RELEVANCE' | 'DISTANCE';
}

// Uygulama için özel tipler
export interface IstanbulPlace extends Place {
  distance?: number;
  category?: string;
}

export interface PlaceFilter {
  category?: string;
  minRating?: number;
  minUserRatingCount?: number; // Yeni: minimum oy sayısı filtresi
  priceLevel?: string;
  openNow?: boolean;
  sortBy?: 'rating' | 'userRatingCount' | 'distance' | 'name' | 'priceLevel' | 'openNow';
  sortOrder?: 'asc' | 'desc';
}

export interface PlaceCategory {
  id: string;
  name: string;
  types: string[];
  icon: string;
}