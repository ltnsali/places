import { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import type { Location } from '../types/places';

interface SearchRadiusCircleProps {
  center: Location;
  radius: number;
  fitOnRadiusChange?: boolean;
}

function SearchRadiusCircle({ center, radius, fitOnRadiusChange = true }: SearchRadiusCircleProps) {
  const map = useMap();
  const mapsLibrary = useMapsLibrary('maps');
  const circleRef = useRef<google.maps.Circle | null>(null);
  const previousRadiusRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !mapsLibrary) return;

    if (!circleRef.current) {
      circleRef.current = new mapsLibrary.Circle({
        map,
        strokeColor: '#4285F4',
        strokeOpacity: 0.9,
        strokeWeight: 2.5,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        clickable: false,
        zIndex: 1,
      });
    }

    circleRef.current.setCenter({ lat: center.latitude, lng: center.longitude });
    circleRef.current.setRadius(radius);

    if (fitOnRadiusChange && previousRadiusRef.current !== radius) {
      const bounds = circleRef.current.getBounds();
      if (bounds) {
        map.fitBounds(bounds, 32);
      }
    }
    previousRadiusRef.current = radius;

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [map, mapsLibrary, center.latitude, center.longitude, radius, fitOnRadiusChange]);

  return null;
}

export default SearchRadiusCircle;
