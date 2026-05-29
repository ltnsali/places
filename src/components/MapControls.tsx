import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Location } from '../types/places';
import './MapControls.css';

interface MapControlsProps {
  userLocation: Location | null;
  radius: number;
  minRadius: number;
  maxRadius: number;
  isLocating: boolean;
  onRadiusChange: (radius: number) => void;
  onGoToCurrentLocation: () => void;
}

function getRadiusStep(radius: number): number {
  if (radius < 1000) return 250;
  if (radius < 3000) return 500;
  if (radius < 10000) return 1000;
  if (radius < 25000) return 2500;
  return 5000;
}

function formatRadius(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${Number.isInteger(km) ? km : km.toFixed(1)}km`;
  }
  return `${meters}m`;
}

function MapControls({
  userLocation,
  radius,
  minRadius,
  maxRadius,
  isLocating,
  onRadiusChange,
  onGoToCurrentLocation,
}: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation) return;
    map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
  }, [map, userLocation]);

  const handleIncrease = () => {
    const step = getRadiusStep(radius);
    const next = Math.min(maxRadius, Math.round((radius + step) / step) * step);
    if (next !== radius) onRadiusChange(next);
  };

  const handleDecrease = () => {
    const step = getRadiusStep(radius - 1);
    const next = Math.max(minRadius, Math.round((radius - step) / step) * step);
    if (next !== radius) onRadiusChange(next);
  };

  return (
    <div className="map-controls">
      <button
        type="button"
        className="map-control-button location-button"
        onClick={onGoToCurrentLocation}
        disabled={isLocating}
        title="Mevcut konumuma git ve burada ara"
      >
        <span className="location-icon">{isLocating ? '⏳' : '📍'}</span>
        <span className="location-label">
          {isLocating ? 'Konum alınıyor...' : 'Mevcut Konumum'}
        </span>
      </button>

      <div className="radius-control" role="group" aria-label="Arama yarıçapı">
        <button
          type="button"
          className="radius-button"
          onClick={handleDecrease}
          disabled={radius <= minRadius}
          title="Arama yarıçapını azalt"
          aria-label="Arama yarıçapını azalt"
        >
          −
        </button>
        <div className="radius-display">
          <span className="radius-label">Arama Çapı</span>
          <span className="radius-value">{formatRadius(radius)}</span>
        </div>
        <button
          type="button"
          className="radius-button"
          onClick={handleIncrease}
          disabled={radius >= maxRadius}
          title="Arama yarıçapını artır"
          aria-label="Arama yarıçapını artır"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default MapControls;
