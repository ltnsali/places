import { isNative } from '../utils/platform';

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

export interface GetCurrentPositionOptions {
  highAccuracy?: boolean;
  timeoutMs?: number;
  maxAgeMs?: number;
}

export class PermissionDeniedError extends Error {
  constructor(message = 'GEOLOCATION_PERMISSION_DENIED') {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}

const DEFAULTS = {
  highAccuracy: true,
  timeoutMs: 10_000,
  maxAgeMs: 60_000,
} as const;

export async function getCurrentPosition(
  options?: GetCurrentPositionOptions
): Promise<GeolocationResult> {
  const enableHighAccuracy = options?.highAccuracy ?? DEFAULTS.highAccuracy;
  const timeout = options?.timeoutMs ?? DEFAULTS.timeoutMs;
  const maximumAge = options?.maxAgeMs ?? DEFAULTS.maxAgeMs;

  if (isNative()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    const permission = await Geolocation.requestPermissions();
    if (permission.location !== 'granted') {
      throw new PermissionDeniedError();
    }
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('GEOLOCATION_UNSUPPORTED');
  }

  return new Promise<GeolocationResult>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new PermissionDeniedError());
          return;
        }
        reject(error);
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  });
}
