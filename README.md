# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# 🏙️ İstanbul'da En Çok Oy Alan Mekanlar

Bu proje, Google Places API kullanarak İstanbul'daki en çok oy alan ve yüksek puanlı mekanları listeleyen bir React web uygulamasıdır.

## ✨ Özellikler

- 📍 İstanbul'daki popüler mekanların interaktif harita gösterimi
- ⭐ Google Maps verilerine göre en yüksek puanlı mekanlar
- 🎯 Kategori bazlı filtreleme (Restoranlar, Turistik Yerler, Kafeler, vb.)
- 🔍 Puan ve değerlendirme sayısına göre sıralama
- 📱 Responsive tasarım (mobil uyumlu)
- 🗺️ Advanced Markers ile harita üzerinde mekan işaretleme
- 🔗 Direkt Google Maps ve website bağlantıları
- 📞 Telefon numarası ile direkt arama

## 🛠️ Teknolojiler

- **React 18** - TypeScript ile
- **Vite** - Hızlı geliştirme ortamı
- **Google Maps JavaScript API** - Harita gösterimi
- **Google Places API (New)** - Mekan verileri
- **@vis.gl/react-google-maps** - React Google Maps entegrasyonu
- **CSS3** - Responsive tasarım

## 🚀 Kurulum

### Gereksinimler

- Node.js (v16 veya üzeri)
- Google Cloud Platform hesabı
- Google Maps Platform API anahtarı

### API Anahtarı Alma

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. Aşağıdaki API'leri etkinleştirin:
   - Maps JavaScript API
   - Places API (New)
4. API anahtarı oluşturun ve gerekli kısıtlamaları yapın

### Projeyi Çalıştırma

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd istanbul-places
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre değişkenlerini ayarlayın:**
   ```bash
   # .env dosyasını düzenleyin
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcıda açın:**
   ```
   http://localhost:5173
   ```

## 📖 Kullanım

### Ana Özellikler

1. **Kategori Filtreleme:**
   - Tüm kategoriler veya belirli bir kategori seçin
   - Restoranlar, Turistik Yerler, Kafeler, Parklar vb.

2. **Puan Filtreleme:**
   - Minimum puan seçimi (3.0+ ile 4.5+ arası)
   - Yalnızca yüksek puanlı mekanları görüntüleme

3. **Sıralama Seçenekleri:**
   - En yüksek puan
   - En çok değerlendirilen
   - En yakın mesafe
   - İsme göre alfabetik

4. **Harita Etkileşimi:**
   - Mekan üzerine tıklayarak detayları görüntüleme
   - Harita üzerinde zoom ve pan yapabilme
   - Seçili mekanın vurgulanması

5. **Mekan Detayları:**
   - Puan ve değerlendirme sayısı
   - Adres bilgisi
   - Fiyat seviyesi (₺-₺₺₺₺)
   - İşletme durumu
   - Website ve telefon bilgileri
   - Google Maps bağlantısı

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── LoadingSpinner/  # Yükleme animasyonu
│   ├── PlaceFilters/    # Filtreleme kontrolleri
│   └── PlacesList/      # Mekan listesi
├── services/           # API servis katmanı
│   └── placesService.ts # Google Places API entegrasyonu
├── types/             # TypeScript tip tanımları
│   └── places.ts      # Mekan veri tipleri
├── App.tsx           # Ana uygulama bileşeni
├── App.css          # Ana stil dosyası
└── main.tsx        # Uygulama giriş noktası
```

## 🔧 Geliştirme

### Yeni Kategori Ekleme

`src/services/placesService.ts` dosyasındaki `PLACE_CATEGORIES` dizisine yeni kategori ekleyin:

```typescript
{
  id: 'yeni_kategori',
  name: 'Yeni Kategori',
  types: ['google_place_type'],
  icon: '🆕'
}
```

### API Sorguları Özelleştirme

Places servisi sınıfındaki metotları ihtiyaçlarınıza göre güncelleyebilirsiniz:

- `getTopRatedPlaces()` - Genel popüler mekanlar
- `getPlacesByCategory()` - Kategori bazlı mekanlar
- `getPopularTouristAttractions()` - Turistik yerler
- `getTopRatedRestaurants()` - En iyi restoranlar

## 🚀 Dağıtım

### Production Build

```bash
npm run build
```

### Vercel'e Dağıtım

1. Vercel hesabınıza projeyi import edin
2. Environment Variables kısmına API anahtarınızı ekleyin:
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API Key
3. Deploy butonuna tıklayın

### Netlify'e Dağıtım

1. `dist` klasörünü Netlify'a upload edin
2. Environment variables kısmına API anahtarınızı ekleyin
3. Site ayarlarınızı yapılandırın

## 📊 API Kullanımı ve Limitler

- **Places API (New)** kullanılmaktadır
- Günlük API çağrı limitleri Google Cloud hesabınıza bağlıdır
- [Fiyatlandırma bilgileri](https://developers.google.com/maps/billing/gmp-billing) için resmi dökümantasyonu inceleyin

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 🔗 Yararlı Bağlantılar

- [Google Maps Platform](https://developers.google.com/maps)
- [Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [React Google Maps (@vis.gl)](https://visgl.github.io/react-google-maps/)
- [Vite Documentation](https://vitejs.dev/)

## ⚠️ Önemli Notlar

- API anahtarınızı güvenli tutun ve paylaşmayın
- Production'da API anahtarınıza domain kısıtlaması ekleyin
- API kullanım limitlerini takip edin
- Bu uygulama yalnızca İstanbul bölgesi için optimize edilmiştir

## 📧 İletişim

Sorularınız için issue açabilir veya [email] ile iletişime geçebilirsiniz.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 📱 Mobil (iOS / Android)

Bu proje [Capacitor](https://capacitorjs.com/) ile native iOS ve Android uygulaması olarak da paketlenir.

### Android (Windows'ta yerel build)
```bash
npm run cap:android
```
Android Studio açılır. Bir emülatör seç ve Run.

### iOS (Mac yok? Sorun değil — CI üzerinden)
`main` dalına push ya da Actions sekmesinden manuel tetikle:
- Workflow: **iOS Build**
- Artifact: `ios-app-unsigned` (`.ipa`) ve `ios-simulator-app` (`.app`)

TestFlight'a yükleme için Apple Developer hesabı + sertifika gerekir; workflow içindeki TODO bölümüne bakın.

