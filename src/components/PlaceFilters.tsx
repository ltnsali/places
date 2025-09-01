import type { PlaceFilter, PlaceCategory } from '../types/places';
import './PlaceFilters.css';

interface PlaceFiltersProps {
  filter: PlaceFilter;
  categories: PlaceCategory[];
  onFilterChange: (filter: PlaceFilter) => void;
  isLoading: boolean;
}

function PlaceFilters({ filter, categories, onFilterChange, isLoading }: PlaceFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filter,
      category: category === 'all' ? undefined : category
    });
  };

  const handleMinRatingChange = (minRating: number) => {
    onFilterChange({
      ...filter,
      minRating
    });
  };

  const handleMinUserRatingCountChange = (minUserRatingCount: number) => {
    onFilterChange({
      ...filter,
      minUserRatingCount: minUserRatingCount === 0 ? undefined : minUserRatingCount
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFilterChange({
      ...filter,
      sortBy: sortBy as 'rating' | 'userRatingCount' | 'distance' | 'name' | 'priceLevel' | 'openNow',
      sortOrder: sortOrder as 'asc' | 'desc'
    });
  };

  return (
    <div className="place-filters">
      <h3>🔍 Filtreler</h3>
      
      <div className="filters-container">
        <div className="filter-group category">
          <label htmlFor="category-select">Kategori:</label>
          <select
            id="category-select"
            value={filter.category || 'all'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
          >
            <option value="all">🏙️ Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group rating">
          <label htmlFor="rating-select">Puan:</label>
          <select
            id="rating-select"
            value={filter.minRating || 4.0}
            onChange={(e) => handleMinRatingChange(Number(e.target.value))}
            disabled={isLoading}
          >
            <option value={3.0}>3.0+</option>
            <option value={3.5}>3.5+</option>
            <option value={4.0}>4.0+</option>
            <option value={4.2}>4.2+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>

        <div className="filter-group votes">
          <label htmlFor="user-rating-count-input">Oy:</label>
          <input
            id="user-rating-count-input"
            type="number"
            min="0"
            max="10000"
            placeholder="100"
            value={filter.minUserRatingCount || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleMinUserRatingCountChange(value === '' ? 0 : Number(value));
            }}
            disabled={isLoading}
            className="number-input"
          />
        </div>

        <div className="filter-group sort">
          <label htmlFor="sort-select">Sıralama:</label>
          <select
            id="sort-select"
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSortChange(sortBy, sortOrder);
            }}
            disabled={isLoading}
          >
            <option value="rating-desc">🌟 En Yüksek Puan</option>
            <option value="rating-asc">📉 En Düşük Puan</option>
            <option value="userRatingCount-desc">👥 En Çok Değerlendirilen</option>
            <option value="userRatingCount-asc">👤 En Az Değerlendirilen</option>
            <option value="distance-asc">📍 En Yakın</option>
            <option value="distance-desc">🚀 En Uzak</option>
            <option value="name-asc">🔤 İsme Göre (A-Z)</option>
            <option value="name-desc">🔤 İsme Göre (Z-A)</option>
            <option value="priceLevel-asc">💰 En Ucuz</option>
            <option value="priceLevel-desc">💎 En Pahalı</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default PlaceFilters;