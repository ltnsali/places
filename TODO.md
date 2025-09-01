# 📋 TODO List - Proje Gelişim Yol Haritası

## 🎯 Öncelikli Özellikler

### 📍 **Harita Üzerinden Nokta Seçimi**
- [ ] Harita üzerine tıklayarak koordinat seçimi
- [ ] Seçili noktanın görsel işaretlenmesi
- [ ] Koordinat bilgisinin gösterilmesi

### 🔍 **Seçili Nokta Etrafında Mekan Arama**
- [ ] Seçili koordinatlar etrafında Places API sorgusu
- [ ] Nearby Search API entegrasyonu
- [ ] Sonuçların harita üzerinde gösterilmesi

### 📏 **Mesafe Filtreleme**
- [ ] 500m, 1km, 2km, 5km, 10km seçenekleri
- [ ] Özel mesafe girişi (slider veya input)
- [ ] Mesafe birim değişimi (m/km)
- [ ] Arama radiüsünün harita üzerinde görsel gösterimi

### Chrome Tab inda vite  + react + ts yazisindan daha anlamli bir seye degistir. 

---

## 🔄 İyileştirmeler

### 🗺️ **Harita Özellikleri**
- [ ] Harita üzerinde mesafe ölçme
- [ ] Çoklu nokta seçimi
- [ ] Seçili alan içinde arama (polygon)
- [ ] Konum geçmişi (son aranan noktalar)

### 🎛️ **Filtreleme İyileştirmeleri**
- [ ] Çoklu kategori seçimi
- [ ] Açılış saati filtresi
- [ ] Fiyat aralığı filtresi
- [ ] Accessibility özellikleri filtresi

### 🎨 **UI/UX İyileştirmeleri**
- [ ] Karanlık tema desteği
- [ ] Favoriler sistemi
- [ ] Mekan karşılaştırma özelliği
- [ ] Sosyal medya paylaşımı

### ⚡ **Performans Optimizasyonları**
- [ ] Infinite scrolling
- [ ] Veri cache'leme
- [ ] Lazy loading
- [ ] API çağrı optimizasyonu

---

## 🚀 Gelişmiş Özellikler

### 🛣️ **Rota Planlama**
- [ ] Directions API entegrasyonu
- [ ] Çoklu durak rotası
- [ ] Farklı ulaşım türleri (yürüme, araç, toplu taşıma)

### 👤 **Kullanıcı Özellikleri**
- [ ] Kullanıcı kayıt/giriş sistemi
- [ ] Kişisel mekan listeleri
- [ ] Değerlendirme/yorum yapma
- [ ] Check-in özelliği

### 📊 **Veri Analizi**
- [ ] Mekan popülerlik trendleri
- [ ] Kullanıcı davranış analizi
- [ ] Heatmap görünümü
- [ ] İstatistiksel raporlar

---

## 📝 Implementation Notları

### 🔧 **Teknik Detaylar**

#### Harita Etkileşimi
```typescript
// Harita tıklama event handler
const handleMapClick = (event: google.maps.MapMouseEvent) => {
  const lat = event.latLng?.lat();
  const lng = event.latLng?.lng();
  // Koordinatları state'e kaydet
  // Nearby search başlat
};
```

#### Mesafe Filtresi
```typescript
interface DistanceFilter {
  value: number;
  unit: 'meters' | 'kilometers';
  displayText: string;
}

const distanceOptions: DistanceFilter[] = [
  { value: 500, unit: 'meters', displayText: '500m' },
  { value: 1, unit: 'kilometers', displayText: '1km' },
  // ...
];
```

#### Nearby Search API
```typescript
const searchNearbyPlaces = async (
  location: google.maps.LatLng,
  radius: number,
  type?: string
) => {
  // Places API Nearby Search implementation
};
```

---

## 🎯 Sprint Planlaması

### Sprint 1 (Hafta 1-2)
- [x] Proje kurulumu ve temel yapı
- [x] Google Maps entegrasyonu
- [x] Temel mekan listesi
- [ ] Harita tıklama özelliği

### Sprint 2 (Hafta 3-4)
- [ ] Nearby search implementasyonu
- [ ] Mesafe filtresi UI
- [ ] Koordinat seçimi UX

### Sprint 3 (Hafta 5-6)
- [ ] Gelişmiş filtreleme
- [ ] Performance optimizasyonları
- [ ] Mobile responsive iyileştirmeler

### Sprint 4+ (Uzun vadeli)
- [ ] Kullanıcı sistemi
- [ ] Rota planlama
- [ ] Veri analizi özellikleri

---

## 🐛 Bilinen Sorunlar

- [ ] API rate limiting optimizasyonu gerekli
- [ ] Mobile safari'de harita performance sorunu
- [ ] Büyük veri setlerinde rendering yavaşlığı

---

## 💡 Geliştirme Fikirleri

- **AR Entegrasyonu**: Kamera ile gerçek dünya üzerinde mekan bilgileri
- **Ses Rehberi**: Mekanlar için sesli açıklamalar
- **Sosyal Özellikler**: Arkadaşlarla mekan paylaşımı
- **AI Önerileri**: Kullanıcı tercihlerine göre akıllı mekan önerileri
- **Offline Mod**: İnternet bağlantısı olmadan çalışma