// ===== SHARED PRODUCT DATA =====
const products = [
    // 2 Tekerlekli — Elektrikli Kabin
    { id: 1, name: "Arora Viento Elektrikli Motor Kabini", brand: "Arora", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 14999, oldPrice: 17499, badge: "Çok Satan", isNew: false, description: "Arora Viento elektrikli motor için özel tasarlanmış, %100 su geçirmez kabin. Dayanıklı kumaş yapısı ile uzun ömürlü kullanım sağlar. Kolay montaj ve söküm özelliği.", features: ["Su Geçirmez", "UV Koruma", "Kolay Montaj", "Fermuarlı Kapı", "Havalandırma Penceresi"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.2 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Arora Viento" } },
    { id: 2, name: "Motolux Nirvana Elektrikli Motor Kabini", brand: "Motolux", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 15499, oldPrice: 18999, badge: "", isNew: true, description: "Motolux Nirvana modeli için birebir uyumlu elektrikli motor kabini. Premium kumaş ile üretilmiştir. Rüzgar ve yağmura karşı tam koruma.", features: ["Su Geçirmez", "Rüzgar Geçirmez", "Premium Kumaş", "Reflektör", "Kolay Montaj"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.5 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Motolux Nirvana" } },
    { id: 3, name: "Yuki YK Elektrikli Motor Kabini", brand: "Yuki", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 13750, oldPrice: 15999, badge: "", isNew: false, description: "Yuki YK serisi elektrikli motorlar için özel üretim kabin. Hafif ve dayanıklı yapısıyla günlük kullanıma idealdir.", features: ["Su Geçirmez", "Hafif Yapı", "Dayanıklı", "Kolay Montaj", "Elastik Kenar"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "2.8 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Yuki YK Serisi" } },
    { id: 4, name: "Kuba Optimus Elektrikli Motor Kabini", brand: "Kuba", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 14250, oldPrice: null, badge: "", isNew: true, description: "Kuba Optimus modeline özel tam uyumlu kabin. Güçlü dikiş yapısı ve premium su geçirmez kumaş.", features: ["Su Geçirmez", "Güçlü Dikiş", "UV Koruma", "Havalandırma", "Reflektör"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.0 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Kuba Optimus" } },
    { id: 5, name: "Volta VSX Elektrikli Motor Kabini", brand: "Volta", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 16499, oldPrice: 19999, badge: "Yeni Sezon", isNew: true, description: "Volta VSX için premium kabin çözümü. Çift kat su geçirmez kumaş, güçlendirilmiş iskelet yapısı.", features: ["Çift Kat Kumaş", "Su Geçirmez", "Güçlü İskelet", "Kolay Montaj", "Taşıma Çantası"], specs: { "Malzeme": "Çift Kat Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.0 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Volta VSX" } },
    { id: 6, name: "RKS Lorry Elektrikli Motor Kabini", brand: "RKS", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 13999, oldPrice: 16499, badge: "", isNew: false, description: "RKS Lorry elektrikli motor için tam koruma sağlayan kabin. Geniş iç hacim ve kolay giriş-çıkış.", features: ["Su Geçirmez", "Geniş Hacim", "Fermuarlı", "UV Koruma", "Dayanıklı"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.3 kg", "Garanti": "1 Yıl", "Uyumlu Model": "RKS Lorry" } },
    { id: 7, name: "Arora Falcon Elektrikli Motor Kabini", brand: "Arora", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 15250, oldPrice: null, badge: "", isNew: false, description: "Arora Falcon modeli için özel tasarım kabin. Aerodinamik yapısı ile rüzgar direncini minimize eder.", features: ["Aerodinamik", "Su Geçirmez", "Kolay Montaj", "Reflektör", "Havalandırma"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.1 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Arora Falcon" } },
    { id: 8, name: "Motolux Ceo Elektrikli Motor Kabini", brand: "Motolux", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 16999, oldPrice: 19499, badge: "Premium", isNew: true, description: "Motolux Ceo için premium seri kabin. En kaliteli kumaş ve aksesuar seçenekleri ile donatılmıştır.", features: ["Premium Kumaş", "Su Geçirmez", "Isı Yalıtım", "LED Aydınlatma", "Fermuarlı Kapı"], specs: { "Malzeme": "Premium Çift Kat Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.2 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Motolux Ceo" } },
    { id: 27, name: "Arora Mobilite Elektrikli Motor Kabini", brand: "Arora", category: "elektrikli-motor-kabinleri", categoryLabel: "2 Tekerlekli — Elektrikli Kabin", price: 15999, oldPrice: 18499, badge: "", isNew: false, description: "Arora Mobilite serisi için tam uyumlu kabin. Şehir içi kullanım için ideal tasarım.", features: ["Su Geçirmez", "Şehir İçi", "Kompakt", "Kolay Montaj", "Reflektör"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.4 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Arora Mobilite" } },
    // 2 Tekerlekli — Kasal Kabin
    { id: 9, name: "Arora Kargo Kasal Motor Kabini", brand: "Arora", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 12499, oldPrice: 14999, badge: "Çok Satan", isNew: false, description: "Arora kasal motor modelleri için özel üretim kasa kabini. Yük taşımacılığında üstün koruma sağlar.", features: ["Su Geçirmez", "Yük Koruma", "Güçlü Bağlantı", "UV Koruma", "Dayanıklı"], specs: { "Malzeme": "Ağır Hizmet Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.5 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Arora Kargo" } },
    { id: 10, name: "Motolux Cargo Kasal Motor Kabini", brand: "Motolux", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 11999, oldPrice: null, badge: "", isNew: false, description: "Motolux Cargo serisi için tam uyumlu kasa kabini. Güçlendirilmiş dikiş ve su geçirmez yapı.", features: ["Su Geçirmez", "Güçlü Dikiş", "Kolay Söküm", "Havalandırma", "Reflektör"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.0 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Motolux Cargo" } },
    { id: 11, name: "Yuki Kargo Kasal Motor Kabini", brand: "Yuki", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 11499, oldPrice: 13999, badge: "", isNew: true, description: "Yuki kargo motorları için özel tasarım kasa kabini. Hafif ama dayanıklı yapısı ile uzun ömürlü.", features: ["Su Geçirmez", "Hafif", "Dayanıklı", "Kolay Montaj", "UV Koruma"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "3.8 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Yuki Kargo" } },
    { id: 12, name: "Kuba Kargo Kasal Motor Kabini", brand: "Kuba", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 12999, oldPrice: null, badge: "", isNew: false, description: "Kuba kargo motor serisi için profesyonel kabin. Ticari kullanım için idealdir.", features: ["Su Geçirmez", "Ticari Kalite", "Güçlü Bağlantı", "Kolay Erişim", "Reflektör"], specs: { "Malzeme": "Ağır Hizmet Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.3 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Kuba Kargo" } },
    { id: 13, name: "RKS Kargo Kasal Motor Kabini", brand: "RKS", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 11750, oldPrice: 13499, badge: "", isNew: false, description: "RKS kargo motorları için özel üretim kasa kabini. Geniş hacimli ve su geçirmez.", features: ["Su Geçirmez", "Geniş Hacim", "Dayanıklı", "Kolay Montaj", "UV Koruma"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.1 kg", "Garanti": "1 Yıl", "Uyumlu Model": "RKS Kargo" } },
    { id: 14, name: "Mondial Kargostar Kasal Motor Kabini", brand: "Mondial", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 12250, oldPrice: null, badge: "Yeni", isNew: true, description: "Mondial Kargostar modeli için tam uyumlu kasa kabini. Profesyonel teslimatçılar için ideal.", features: ["Su Geçirmez", "Profesyonel", "Güçlü Dikiş", "Reflektör", "Havalandırma"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.2 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Mondial Kargostar" } },
    { id: 28, name: "Motolux Nirvana Plus Kasal Kabini", brand: "Motolux", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 13499, oldPrice: null, badge: "Yeni", isNew: true, description: "Motolux Nirvana Plus kasal motor modeli için özel üretim kasa kabini.", features: ["Su Geçirmez", "Güçlü Yapı", "Premium Kumaş", "Kolay Erişim", "UV Koruma"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.4 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Motolux Nirvana Plus" } },
    { id: 30, name: "Kuba Süper Kasal Motor Kabini", brand: "Kuba", category: "kasal-motor-kabinleri", categoryLabel: "2 Tekerlekli — Kasal Kabin", price: 13250, oldPrice: 15499, badge: "", isNew: false, description: "Kuba süper kargo modeli için güçlendirilmiş kasa kabini. Ağır yük taşımacılığı için ideal.", features: ["Güçlendirilmiş", "Su Geçirmez", "Ağır Yük", "Dayanıklı", "UV Koruma"], specs: { "Malzeme": "Ağır Hizmet Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "5.0 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Kuba Süper" } },
    // 2 Tekerlekli — Tente
    { id: 21, name: "2 Tekerlekli Motosiklet Tentesi - Small", brand: "Universal", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 4750, oldPrice: 5999, badge: "En Uygun", isNew: false, description: "Küçük boy motosikletler için universal tente. Scooter ve küçük motorlar için ideal boyut.", features: ["Universal", "Su Geçirmez", "Hafif", "Kolay Kullanım", "Taşıma Çantası"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "1.2 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Universal - 50-125cc" } },
    { id: 22, name: "2 Tekerlekli Motosiklet Tentesi - Medium", brand: "Universal", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 5250, oldPrice: null, badge: "", isNew: false, description: "Orta boy motosikletler için universal tente. 125-250cc motorlar için ideal boyut.", features: ["Universal", "Su Geçirmez", "UV Koruma", "Elastik Kenar", "Dayanıklı"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "1.5 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Universal - 125-250cc" } },
    { id: 23, name: "2 Tekerlekli Motosiklet Tentesi - Large", brand: "Universal", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 5999, oldPrice: 6999, badge: "", isNew: false, description: "Büyük boy motosikletler için geniş tente. Touring ve adventure motorlar için ideal.", features: ["Büyük Boy", "Su Geçirmez", "UV Koruma", "Güçlü Kumaş", "Taşıma Çantası"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "1.8 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Universal - 250cc+" } },
    { id: 24, name: "Elektrikli Scooter Brandası", brand: "Universal", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 4250, oldPrice: null, badge: "Çok Satan", isNew: false, description: "Elektrikli scooterlar için özel tasarım branda. Hafif ve kompakt yapısı ile her yere taşınabilir.", features: ["Scooter Uyumlu", "Su Geçirmez", "Hafif", "Kompakt", "Kolay Kullanım"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "0.9 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Universal - Elektrikli Scooter" } },
    { id: 25, name: "Premium Motosiklet Brandası - XL", brand: "Motor Tente Market", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 7499, oldPrice: 8999, badge: "Premium", isNew: true, description: "Premium kalite XL boy motosiklet brandası. Çift kat kumaş, güçlendirilmiş dikişler ve reflektörler.", features: ["Premium Kalite", "Çift Kat", "Su Geçirmez", "Reflektör", "Kilit Deliği"], specs: { "Malzeme": "Premium Çift Kat Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "2.2 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Universal - XL" } },
    { id: 26, name: "Kışlık Motosiklet Tentesi", brand: "Motor Tente Market", category: "2-tekerli-motor-tenteleri", categoryLabel: "2 Tekerlekli — Tente", price: 6999, oldPrice: null, badge: "Yeni Sezon", isNew: true, description: "Kış ayları için özel üretim kalın motosiklet tentesi. Kar ve buzlanmaya karşı ekstra koruma.", features: ["Kışlık", "Kalın Kumaş", "Su Geçirmez", "Kar Dayanımlı", "UV Koruma"], specs: { "Malzeme": "Kalın Polyester + İç Astar", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "2.5 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Universal" } },
    // 3 Tekerlekli — Tente
    { id: 15, name: "Akeso Yagi 3 Tekerlekli Motor Brandası", brand: "Akeso", category: "3-tekerli-motor-tenteleri", categoryLabel: "3 Tekerlekli — Tente", price: 19499, oldPrice: 22999, badge: "En Popüler", isNew: false, description: "Akeso Yagi 3 tekerlekli motor için özel tasarım branda. Tam koruma sağlayan geniş yapısı ile aracınızı her yönden korur.", features: ["Tam Koruma", "Su Geçirmez", "UV Koruma", "Elastik Kenar", "Taşıma Çantası"], specs: { "Malzeme": "Premium Çift Kat Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "5.5 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Akeso Yagi" } },
    // 4 Tekerlekli — Tente
    { id: 16, name: "Arora 4 Tekerlekli Motor Tentesi", brand: "Arora", category: "4-tekerli-motor-tenteleri", categoryLabel: "4 Tekerlekli — Tente", price: 18499, oldPrice: null, badge: "", isNew: true, description: "Arora 4 tekerlekli motor modelleri için geniş tente. Premium kumaş ve güçlü dikiş ile uzun ömürlü.", features: ["Geniş Kesim", "Su Geçirmez", "Premium Kumaş", "Kolay Örtme", "UV Koruma"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "5.0 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Arora 4 Tekerlekli" } },
    { id: 17, name: "Motolux Golfcar Tentesi", brand: "Motolux", category: "4-tekerli-motor-tenteleri", categoryLabel: "4 Tekerlekli — Tente", price: 17999, oldPrice: 20999, badge: "", isNew: false, description: "Motolux Golfcar modeli için birebir uyumlu tente. Kolay açılıp kapanma mekanizması.", features: ["Su Geçirmez", "Kolay Kullanım", "Dayanıklı", "Havalandırma", "Reflektör"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.8 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Motolux Golfcar" } },
    { id: 18, name: "Yuki 4 Tekerlekli Motor Tentesi", brand: "Yuki", category: "4-tekerli-motor-tenteleri", categoryLabel: "4 Tekerlekli — Tente", price: 16999, oldPrice: null, badge: "", isNew: false, description: "Yuki 4 tekerlekli araçlar için tam koruma tentesi. Tüm modellere uyumlu universal tasarım.", features: ["Universal Tasarım", "Su Geçirmez", "UV Koruma", "Elastik Bant", "Taşıma Çantası"], specs: { "Malzeme": "Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "4.5 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Yuki 4 Tekerlekli" } },
    { id: 19, name: "Kuba 4 Tekerlekli Elektrikli Araç Brandası", brand: "Kuba", category: "4-tekerli-motor-tenteleri", categoryLabel: "4 Tekerlekli — Tente", price: 17499, oldPrice: 19999, badge: "", isNew: true, description: "Kuba elektrikli 4 tekerlekli araçlar için özel branda. Tam kapama ile üstün koruma.", features: ["Tam Kapama", "Su Geçirmez", "Premium Kumaş", "Kolay Montaj", "UV Koruma"], specs: { "Malzeme": "Premium Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "5.2 kg", "Garanti": "1 Yıl", "Uyumlu Model": "Kuba 4 Tekerlekli" } },
    { id: 20, name: "Volta 4 Tekerlekli Motor Brandası", brand: "Volta", category: "4-tekerli-motor-tenteleri", categoryLabel: "4 Tekerlekli — Tente", price: 18999, oldPrice: null, badge: "Premium", isNew: true, description: "Volta 4 tekerlekli elektrikli araçlar için premium seri branda. En kaliteli malzeme ve işçilik.", features: ["Premium Seri", "Su Geçirmez", "Çift Kat", "UV Koruma", "LED Reflektör"], specs: { "Malzeme": "Premium Çift Kat Polyester", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "5.8 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Volta 4 Tekerlekli" } },
    { id: 29, name: "Akeso 4 Tekerlekli Tam Kabin", brand: "Akeso", category: "4-tekerli-motor-kabinleri", categoryLabel: "4 Tekerlekli — Kabin", price: 21999, oldPrice: 24999, badge: "Premium", isNew: true, description: "Akeso 4 tekerlekli araçlar için tam kapalı kabin sistemi. En üst düzey koruma.", features: ["Tam Kabin", "Su Geçirmez", "Isı Yalıtım", "Pencereli", "Premium"], specs: { "Malzeme": "Premium Çift Kat Polyester + PVC", "Su Geçirmezlik": "%100", "UV Koruma": "Var", "Ağırlık": "7.0 kg", "Garanti": "2 Yıl", "Uyumlu Model": "Akeso 4 Tekerlekli" } },
];

// ===== SHARED UTILITIES =====
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
}

function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

function generateSlug(name) {
    return name.toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ===== SHARED CART =====
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function initCart() {
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('cartClose')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeCart();
    });
    updateCartUI();
}

function openCart() {
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId, qty = 1) {
    const product = getProductById(productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) { existing.qty += qty; } else { cart.push({ id: productId, qty }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${product.name} sepete eklendi!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    if (!countEl) return;

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = totalItems;

    if (cart.length === 0) {
        itemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-basket"></i><p>Sepetiniz boş</p></div>`;
        footerEl.classList.add('cart-footer--hidden');
        return;
    }

    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
        const product = getProductById(item.id);
        if (!product) return '';
        total += product.price * item.qty;
        return `<div class="cart-item">
            <div class="cart-item-img"><i class="fas fa-motorcycle"></i></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">${item.qty}x ${formatPrice(product.price)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
        </div>`;
    }).join('');

    totalEl.textContent = formatPrice(total);
    footerEl.classList.remove('cart-footer--hidden');

    const orderText = cart.map(item => {
        const p = getProductById(item.id);
        return p ? `${item.qty}x ${p.name} (${formatPrice(p.price)})` : '';
    }).filter(Boolean).join('\n');
    const link = footerEl.querySelector('a');
    if (link) link.href = `https://wa.me/905327748927?text=${encodeURIComponent(`Merhaba, sipariş vermek istiyorum:\n\n${orderText}\n\nToplam: ${formatPrice(total)}`)}`;
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:90px;right:24px;background:#22c55e;color:#fff;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:3000;box-shadow:0 8px 24px rgba(34,197,94,0.3);display:flex;align-items:center;gap:10px;animation:slideInRight .3s ease;';
    notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notif);
    if (!document.getElementById('notifStyle')) {
        const s = document.createElement('style'); s.id = 'notifStyle';
        s.textContent = '@keyframes slideInRight{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}';
        document.head.appendChild(s);
    }
    setTimeout(() => { notif.style.transition = 'opacity .3s,transform .3s'; notif.style.opacity = '0'; notif.style.transform = 'translateX(100px)'; setTimeout(() => notif.remove(), 300); }, 2500);
}

// ===== SHARED HEADER & SCROLL =====
function initHeader() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    btn?.addEventListener('click', () => { btn.classList.toggle('active'); nav.classList.toggle('active'); });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { btn?.classList.remove('active'); nav?.classList.remove('active'); }));

    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Product card HTML generator (v2 design)
function productCardHTML(p) {
    const cat = p.category || '';
    const icon = (['elektrikli-motor-kabinleri','kasal-motor-kabinleri','2-tekerli-motor-tenteleri'].includes(cat))
        ? 'motorcycle' : cat === '3-tekerli-motor-tenteleri' ? 'car-side' : 'car';
    const isBest = p.badge === 'Çok Satan' || p.badge === 'En Popüler';
    const tagClass = isBest ? 'bestseller' : p.isNew ? 'new' : p.oldPrice ? 'sale' : '';
    const tagLabel = isBest ? 'ÇOK SATAN' : p.isNew ? 'YENİ' : p.oldPrice ? 'İNDİRİM' : '';
    const reviewCount = 50 + (p.id * 23) % 350;

    return `<div class="prod2" onclick="window.location.href='urun-detay.html?id=${p.id}'">
        <div class="prod2-img">
            <i class="fas fa-${icon}"></i>
            <div class="prod2-tags">
                ${tagClass ? `<span class="prod2-tag ${tagClass}">${tagLabel}</span>` : ''}
            </div>
            <button class="prod2-fav" onclick="event.stopPropagation()" title="Favorilere Ekle"><i class="far fa-heart"></i></button>
            <div class="prod2-quick">
                <button onclick="event.stopPropagation(); window.location.href='urun-detay.html?id=${p.id}'"><i class="fas fa-eye"></i> İncele</button>
                <button class="cart" onclick="event.stopPropagation(); addToCart(${p.id})"><i class="fas fa-shopping-bag"></i> Sepete Ekle</button>
            </div>
        </div>
        <div class="prod2-info">
            <div class="prod2-cat">${p.categoryLabel}</div>
            <h3 class="prod2-title">${p.name}</h3>
            <div class="prod2-rating">
                <span class="stars">★★★★★</span>
                <span>4.8 (${reviewCount} yorum)</span>
            </div>
            <div class="prod2-foot">
                <div class="prod2-price">
                    ${p.oldPrice ? `<small>${formatPrice(p.oldPrice)}</small>` : ''}
                    <strong>${new Intl.NumberFormat('tr-TR').format(p.price)}<span> TL</span></strong>
                </div>
                <span class="prod2-stock"><i class="fas fa-circle"></i> Stokta</span>
            </div>
        </div>
    </div>`;
}
