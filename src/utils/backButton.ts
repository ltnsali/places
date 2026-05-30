import { isNative, platform } from './platform';

export function registerBackButtonHandler(): void {
  if (!isNative() || platform() !== 'android') return;

  void import('@capacitor/app').then(({ App }) => {
    App.addListener('backButton', () => {
      if (window.history.length <= 1) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
  });
}
