import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { isNative } from './utils/platform'
import { registerBackButtonHandler } from './utils/backButton'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (isNative()) {
  void import('@capacitor/splash-screen').then(({ SplashScreen }) => SplashScreen.hide());
  void import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  });
}

registerBackButtonHandler();
