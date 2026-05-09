# MotorTenteMarket — Site Denetim Raporu
_Tarih: 2026-05-09_

---

## 1. TESTER GÖZÜYLE

### 🔴 Kritik

| # | Sorun | Dosya |
|---|-------|-------|
| 1 | `getFavs()` ve `_updateFavBadge()` tanımsız → `favoriler.html` açılınca tamamen çöküyor | `favoriler.html` |
| 2 | `initCart()` her sayfada `ReferenceError` fırlatıyor — sepet özelliği yok | `iletisim.html`, `siparis-ver.html` |
| 3 | `filterProductsLocally` ve `getBrandsLocally` tanımsız → API çevrimdışıyken ürün listesi boş | `urunler.js` |
| 4 | Fuse.js CDN'den yükleniyor ama hiçbir yerde kullanılmıyor — fuzzy search pratikte çalışmıyor | `urunler.html` |
| 5 | Admin kategori değerleri frontend filtresiyle uyumsuz (`3-tekerli-motor-kabinleri` ≠ `3-tekerlekli`) | `admin/product-edit.html` |

### 🟡 Orta

- `urun-detay.html` header arama kutusuna event bağlanmamış — Enter basınca hiçbir şey olmuyor
- Hero bölümündeki `01 / 03` sayfalayıcı dekoratif, carousel çalışmıyor

### 🟢 Küçük / İyi

- Lightbox klavye listener düzgün temizleniyor ✅
- Lazy loading doğru kullanılmış ✅
- API → static fallback mekanizması çalışıyor ✅

---

## 2. MÜŞTERİ GÖZÜYLE

### 🔴 Kritik

- **Favoriler sistemi tamamen çalışmıyor** — ürün kartında kalp yok, `favoriler.html` boş açılıyor
- **Sipariş sayfasında fiyat bilgisi yok** — müşteri ne kadar ödeyeceğini bilmiyor (`siparis-ver.html`)
- **Kargo ücreti belirsiz** — "sipariş sırasında bildirilir" yazıyor; rakipler sabit ücret/ücretsiz yazar

### 🟡 Orta

- Header'da favoriler linki/ikonu yok — kullanıcı sayfayı bulamaz
- `urun-detay.html` satır 211'de "**1 yıl üretici garantisi**" yazıyor, diğer tüm sayfalarda "**2 yıl garanti**" — tutarsızlık

### 🟢 İyi Olan

- WhatsApp her sayfada erişilebilir (FAB + header + iletişim) ✅
- Görselsiz 9 ürün için ikon fallback çalışıyor ✅
- Güven unsurları (50 yıl, garanti, teslimat) yeterince öne çıkarılmış ✅
- Benzer ürünler bölümü çalışıyor ✅

---

## 3. BACKEND (.NET) GÖZÜYLE

### 🔴 Kritik — Admin Paneli Tamamen İşlevsiz

Backend olmadan hiçbir admin operasyonu çalışmıyor. Login, ürün listeleme, CRUD, settings — hepsi API'a gidiyor, static fallback yok.

### Yazılması Gereken Controller'lar

| Öncelik | Controller | Endpoint'ler |
|---------|-----------|--------------|
| 1 | `AuthController` | `POST /api/auth/login` + JWT üretimi |
| 2 | `ProductsController` | `GET /api/products`, `GET /api/products/{id}`, `GET /api/brands` |
| 3 | `SettingsController` | `GET /api/settings` (public), `GET/PUT /api/admin/settings` |
| 4 | `AdminProductsController` | Full CRUD + `POST /api/admin/products/{id}/images` |

### 🟡 Mimari Sorun — 3 Ayrı Kategori Sistemi

```
products-data.js  →  "3-tekerlekli"
admin panel HTML  →  "3-tekerli-motor-kabinleri"
URL param         →  ?kategori=3-tekerlekli
```

Backend devreye girmeden önce tek standarda hizalanmalı. Öneri: `3-tekerlekli` formatı.

### 🟢 İyi Tasarlanmış

- `API_BASE` dev/prod ayrımı düzgün (port 3000 → `localhost:5275`) ✅
- JWT `Authorization: Bearer` header mekanizması hazır ✅
- `applySettingsToDOM()` → WhatsApp/sosyal medya dinamik güncelleme akışı mantıklı ✅
- Image upload için admin'de placeholder ve hazır alan var ✅

---

## PERFORMANS

| Alan | Durum | Not |
|------|-------|-----|
| Google Fonts + Font Awesome render-blocking | 🔴 | ~200-400ms gecikme, `preconnect` var ama CSS defer edilemiyor |
| JS dosyaları body sonunda ama `defer` yok | 🟡 | Minor iyileştirme |
| Görseller `loading="lazy"` | 🟢 | Doğru kullanım |
| `products-data.js` ~60KB, büyük image array'leri (`pony-x-kurulum: 141`) | 🟡 | Sadece count saklanabilir |
| Header/footer her HTML'de tekrar → ~40-50KB şişkinlik | 🟡 | Component sistemi olsa çözülür |

---

## ÖNCELİK SIRASI

### Bugün — Kırık Olanlar

- [x] `initCart()` çağrısını `iletisim.html` ve `siparis-ver.html`'den kaldır
- [x] `urun-detay.html`: "1 yıl" → "2 yıl" garanti düzelt
- [x] Admin kategori değerlerini frontend `category` değerleriyle hizala (`2/3/4-tekerlekli`)
- [x] `urun-detay.html` header arama kutusuna `id` + Enter event bağla
- _Not: `filterProductsLocally`, `getBrandsLocally`, Fuse.js zaten çalışıyordu — agent hatalı raporlamış_

### Bu Hafta — UX

- [ ] Sipariş sayfasına (`siparis-ver.html`) seçilen ürünün fiyatını göster

### Sprint — Backend (.NET)

- [ ] `AuthController` → JWT login
- [ ] `ProductsController` → ürün listeleme + detay + marka listesi
- [ ] `SettingsController` → public settings + admin settings CRUD
- [ ] `AdminProductsController` → full CRUD + image upload
