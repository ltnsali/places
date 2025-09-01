import type { IstanbulPlace } from '../types/places';
import { PLACE_CATEGORIES } from '../services/placesService';
import './PlacesList.css';

interface PlacesListProps {
  places: IstanbulPlace[];
  selectedPlace: IstanbulPlace | null;
  onPlaceSelect: (place: IstanbulPlace) => void;
}

function PlacesList({ places, selectedPlace, onPlaceSelect }: PlacesListProps) {
  const getCategoryIcon = (categoryId: string) => {
    const category = PLACE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '📍';
  };

  const formatRating = (rating?: number) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  const formatUserRatingCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const getPriceLevelText = (priceLevel?: string) => {
    switch (priceLevel) {
      case 'PRICE_LEVEL_FREE':
        return 'Ücretsiz';
      case 'PRICE_LEVEL_INEXPENSIVE':
        return '₺';
      case 'PRICE_LEVEL_MODERATE':
        return '₺₺';
      case 'PRICE_LEVEL_EXPENSIVE':
        return '₺₺₺';
      case 'PRICE_LEVEL_VERY_EXPENSIVE':
        return '₺₺₺₺';
      default:
        return '';
    }
  };

  const getBusinessStatusText = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return '🟢 Açık';
      case 'CLOSED_TEMPORARILY':
        return '🟡 Geçici Kapalı';
      case 'CLOSED_PERMANENTLY':
        return '🔴 Kalıcı Kapalı';
      default:
        return '';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (places.length === 0) {
    return (
      <div className="places-list-empty">
        <h3>🔍 Mekan Bulunamadı</h3>
        <p>Bu kriterlere uygun mekan bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
      </div>
    );
  }

  return (
    <div className="places-list">
      <div className="places-list-header">
        <h3>📍 Bulunan Mekanlar ({places.length})</h3>
      </div>
      
      <div className="places-list-items">
        {places.map((place) => (
          <div
            key={place.id}
            className={`place-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}
            onClick={() => onPlaceSelect(place)}
          >
            <div className="place-item-header">
              <div className="place-icon">
                {getCategoryIcon(place.category || '')}
              </div>
              <div className="place-main-info">
                <h4 className="place-name">
                  {truncateText(place.displayName?.text || place.name || 'İsimsiz Mekan', 40)}
                </h4>
                <div className="place-rating">
                  <span className="rating-stars">⭐</span>
                  <span className="rating-value">{formatRating(place.rating)}</span>
                  {place.userRatingCount && (
                    <span className="rating-count">
                      ({formatUserRatingCount(place.userRatingCount)})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="place-details">
              <div className="place-address">
                📍 {truncateText(place.formattedAddress || '', 60)}
              </div>
              
              <div className="place-meta">
                {place.distance && (
                  <span className="place-distance">
                    🚗 {formatDistance(place.distance)}
                  </span>
                )}
                
                {place.priceLevel && (
                  <span className="place-price">
                    💰 {getPriceLevelText(place.priceLevel)}
                  </span>
                )}
                
                <span className="place-status">
                  {getBusinessStatusText(place.businessStatus)}
                </span>
              </div>

              {place.editorialSummary?.text && (
                <div className="place-summary">
                  {truncateText(place.editorialSummary.text, 120)}
                </div>
              )}

              <div className="place-actions">
                {place.websiteUri && (
                  <a
                    href={place.websiteUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🌐 Website
                  </a>
                )}
                
                {place.googleMapsUri && (
                  <a
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🗺️ Google Maps
                  </a>
                )}
                
                {place.internationalPhoneNumber && (
                  <a
                    href={`tel:${place.internationalPhoneNumber}`}
                    className="place-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📞 Ara
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesList;