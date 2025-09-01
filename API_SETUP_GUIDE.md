# 🔑 Google Maps API Kurulum Rehberi

Bu rehber, İstanbul Places uygulaması için Google Maps API anahtarının nasıl alınacağını ve yapılandırılacağını açıklar.

## 📋 Gerekli API'ler

Uygulama aşağıdaki Google Maps Platform API'lerini kullanır:
- **Maps JavaScript API** - Harita gösterimi için
- **Places API (New)** - Mekan verilerini almak için

## 🚀 Adım Adım Kurulum

### 1. Google Cloud Console'a Giriş

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Google hesabınızla giriş yapın
3. Yeni bir proje oluşturun veya mevcut projeyi seçin

### 2. Billing Hesabı Ayarlama

⚠️ **Önemli**: Google Maps Platform ücretli bir servistir, ancak her ay $200 ücretsiz kredi sağlar.

1. Sol menüden **Billing** seçin
2. Billing hesabı oluşturun veya mevcut hesabı projeye bağlayın
3. Kredi kartı bilgilerinizi girin (aylık limitleri aştığınızda ücretlendirilirsiniz)

### 3. API'leri Etkinleştirme

1. Sol menüden **APIs & Services > Library** seçin
2. Aşağıdaki API'leri arayın ve etkinleştirin:

#### Maps JavaScript API
- Arama kutusuna "Maps JavaScript API" yazın
- API'yi seçin ve **ENABLE** butonuna tıklayın

#### Places API (New)
- Arama kutusuna "Places API (New)" yazın
- API'yi seçin ve **ENABLE** butonuna tıklayın

### 4. API Anahtarı Oluşturma

1. Sol menüden **APIs & Services > Credentials** seçin
2. **+ CREATE CREDENTIALS** butonuna tıklayın
3. **API key** seçin
4. Yeni API anahtarı oluşturulacak

### 5. API Anahtarını Güvenli Hale Getirme

⚠️ **Güvenlik Uyarısı**: API anahtarınızı kısıtlayın!

1. API anahtarının yanındaki **Edit** butonuna tıklayın
2. **Application restrictions** bölümünde:
   - **HTTP referrers (web sites)** seçin
   - Sitenizin domain'ini ekleyin (ör: `localhost:5173/*`, `yourdomain.com/*`)
3. **API restrictions** bölümünde:
   - **Restrict key** seçin
   - **Maps JavaScript API** ve **Places API (New)** seçin
4. **SAVE** butonuna tıklayın

### 6. API Anahtarını Uygulamaya Ekleme

1. Proje klasöründeki `.env` dosyasını açın
2. `YOUR_API_KEY_HERE` kısmını aldığınız API anahtarı ile değiştirin:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
```

3. Dosyayı kaydedin ve uygulamayı yeniden başlatın:

```bash
npm run dev
```

## 💰 Fiyatlandırma Bilgileri

### Ücretsiz Kredi
- Google her ay $200 ücretsiz kredi sağlar
- Bu kredi çoğu küçük-orta proje için yeterlidir

### Maps JavaScript API
- **Map loads**: $7.00 / 1,000 istek
- **Street View loads**: $14.00 / 1,000 istek

### Places API (New)
- **Basic Data**: $17.00 / 1,000 istek
- **Contact Data**: $3.00 / 1,000 istek
- **Atmosphere Data**: $5.00 / 1,000 istek

### Günlük Kullanım Tahmini
Bu uygulama için ortalama günlük kullanım:
- **Maps JavaScript API**: 100-500 yükleme
- **Places API**: 50-200 istek

**Günlük maliyet**: $1-3 (ücretsiz kredinin altında)

## 🔧 API Limitlerini Yönetme

### Günlük Limitler
1. **APIs & Services > Quotas** sayfasına gidin
2. API'ler için günlük limit belirleyin
3. Kullanım alarmları ayarlayın

### Önbellek Stratejisi
Uygulama şu optimizasyonları içerir:
- İstanbul bölgesi ile sınırlı aramalar
- Minumum rating filtreleri
- Sayfa başına maksimum 20 sonuç

## 🚨 Güvenlik En İyi Uygulamaları

### ✅ Yapın
- API anahtarını mutlaka kısıtlayın (domain ve API kısıtlamaları)
- Günlük limitler belirleyin
- Düzenli olarak kullanım raporlarını kontrol edin
- Production'da farklı API anahtarı kullanın

### ❌ Yapmayın
- API anahtarını hiçbir şekilde public kod deposuna koymayın
- Kısıtlama olmadan API anahtarı kullanmayın
- Gereksiz API çağrıları yapmayın

## 🔍 Test Etme

API anahtarını ekledikten sonra:

1. Uygulamayı başlatın: `npm run dev`
2. Tarayıcıda `http://localhost:5173` adresine gidin
3. Haritanın yüklendiğini kontrol edin
4. Filtreleri test edin
5. Browser Console'da hata olmadığını kontrol edin

## 🆘 Sorun Giderme

### Hata: "This API project is not authorized"
- API'lerin etkinleştirildiğini kontrol edin
- Billing hesabının aktif olduğunu kontrol edin

### Hata: "The provided API key is invalid"
- API anahtarının doğru kopyalandığını kontrol edin
- API anahtarı kısıtlamalarını kontrol edin

### Hata: "You have exceeded your daily request quota"
- Günlük limitinizi aştınız
- Yarın tekrar deneyin veya limit arttırın

### Harita Yüklenmiyor
- Network sekmesinde API çağrılarını kontrol edin
- Console'da JavaScript hataları olup olmadığını kontrol edin

## 📞 Destek

- [Google Maps Platform Desteği](https://cloud.google.com/support)
- [Stack Overflow - google-maps](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Topluluk](https://groups.google.com/forum/#!forum/google-maps-js-api-v3)

## 📚 Ek Kaynaklar

- [Google Maps Platform Dokümantasyonu](https://developers.google.com/maps/documentation)
- [Places API (New) Rehberi](https://developers.google.com/maps/documentation/places/web-service/overview)
- [API Anahtarı En İyi Uygulamaları](https://cloud.google.com/docs/authentication/api-keys)
- [Fiyatlandırma Hesaplayıcısı](https://developers.google.com/maps/documentation/javascript/usage-and-billing#pricing-calculator)