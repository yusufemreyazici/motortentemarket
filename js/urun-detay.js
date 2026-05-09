// ===== PRODUCT DETAIL PAGE =====
document.addEventListener('DOMContentLoaded', async () => {
    initHeader();
    initTabs();
    initSearch();
    await loadProduct();
});

function initSearch() {
    const doSearch = el => {
        const q = el?.value?.trim();
        if (q) window.location.href = `urunler.html?ara=${encodeURIComponent(q)}`;
    };
    ['headerSearch', 'mobileSearchInput'].forEach(id => {
        const el = document.getElementById(id);
        el?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(el); });
    });
    document.getElementById('searchToggleBtn')?.addEventListener('click', () => {
        doSearch(document.getElementById('headerSearch'));
    });
}

async function loadProduct() {
    const params  = new URLSearchParams(window.location.search);
    const id      = params.get('id') || window.location.hash.replace('#', '');

    if (!id) { showNotFound(); return; }

    try {
        const resp = await fetch(`${API_BASE}/api/products/${id}`);
        if (!resp.ok) throw new Error();
        const product = await resp.json();
        window._productCache[product.id] = product;
        renderProduct(product);
        loadRelated(product.category, product.id);
    } catch {
        if (typeof products !== 'undefined') {
            const product = products.find(p => p.id === parseInt(id));
            if (product) {
                window._productCache[product.id] = product;
                renderProduct(product);
                loadRelated(product.category, product.id);
            } else {
                showNotFound();
            }
        } else {
            showNotFound();
        }
    }
}

function showNotFound() {
    document.querySelector('.product-detail .container').innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Ürün Bulunamadı</h3>
            <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            <a href="urunler.html" class="btn btn-primary">Ürünlere Dön</a>
        </div>`;
}

function renderProduct(product) {
    const pageTitle = `${product.name} — ${product.brand} Motor Kabini | Motor Tente Market`;
    const pageDesc  = product.description ||
        `${product.name} ${product.categoryLabel}. ${product.brand} marka, ${formatPrice(product.price)} fiyatıyla Motor Tente Market'te.`;
    const pageImage = product.images?.[0]
        ? `https://motortentemarket.com/${product.images[0]}`
        : 'https://motortentemarket.com/images/products/arora-ruzgar-new/1.jpg';
    const pageUrl   = `https://motortentemarket.com/urun-detay.html?id=${product.id}`;

    document.title = pageTitle;

    // Canonical URL
    const canonical = document.getElementById('canonicalTag');
    if (canonical) canonical.href = pageUrl;

    // Dynamic meta tags
    _setMeta('description', pageDesc);
    _setOg('og:title',       pageTitle);
    _setOg('og:description', pageDesc);
    _setOg('og:url',         pageUrl);
    _setOg('og:image',       pageImage);
    _setOg('og:type',        'product');
    _setOg('og:site_name',   'Motor Tente Market');
    _setMeta('twitter:card',        'summary_large_image');
    _setMeta('twitter:title',       pageTitle);
    _setMeta('twitter:description', pageDesc);
    _setMeta('twitter:image',       pageImage);

    // JSON-LD Product schema
    const jsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        description: pageDesc,
        brand: { '@type': 'Brand', name: product.brand },
        image: product.images?.map(img => `https://motortentemarket.com/${img}`) ?? [],
        sku: `MTM-${String(product.id).padStart(4, '0')}`,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'TRY',
            price: product.price,
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Motor Tente Market' }
        }
    };
    let ldEl = document.getElementById('jsonLdProduct');
    if (!ldEl) {
        ldEl = document.createElement('script');
        ldEl.id   = 'jsonLdProduct';
        ldEl.type = 'application/ld+json';
        document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(jsonLd);

    // Breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;

    // Badge
    const badgeEl = document.getElementById('detailBadge');
    if (product.badge) { badgeEl.textContent = product.badge; badgeEl.style.display = 'inline-block'; }
    else               { badgeEl.style.display = 'none'; }

    // Info
    document.getElementById('detailCategory').textContent = product.categoryLabel || '';
    document.getElementById('detailTitle').textContent    = product.name;
    document.getElementById('detailBrand').innerHTML = `<i class="fas fa-tag"></i> Marka: <strong>${product.brand}</strong> &nbsp;|&nbsp; <i class="fas fa-barcode"></i> Ürün Kodu: <strong>MTM-${String(product.id).padStart(4, '0')}</strong>`;

    // Price
    if (product.oldPrice) {
        document.getElementById('detailOldPrice').textContent = formatPrice(product.oldPrice);
        const discount = Math.round((1 - product.price / product.oldPrice) * 100);
        document.getElementById('detailDiscount').textContent    = `%${discount} İndirim`;
        document.getElementById('detailDiscount').style.display  = 'inline-block';
    } else {
        document.getElementById('detailOldPrice').style.display = 'none';
        document.getElementById('detailDiscount').style.display = 'none';
    }
    document.getElementById('detailPrice').textContent = formatPrice(product.price);

    // Description
    if (product.description)
        document.getElementById('detailDesc').textContent = product.description;

    // Features
    document.getElementById('detailFeatures').innerHTML = (product.features || []).map(f =>
        `<div class="detail-feature-item"><i class="fas fa-check-circle"></i> ${f}</div>`
    ).join('');

    // WhatsApp link
    const waText = encodeURIComponent(`Merhaba, "${product.name}" ürününü sipariş vermek istiyorum.\nÜrün Kodu: MTM-${String(product.id).padStart(4, '0')}\nFiyat: ${formatPrice(product.price)}`);
    const waNum = (window._siteSettings?.whatsApp || '905327748927').replace(/\D/g, '');
    document.getElementById('whatsappOrder').href = `https://wa.me/${waNum}?text=${waText}`;

    // Marketplace links
    const platformsSection = document.getElementById('platformsSection');
    const trendyolLink = document.getElementById('trendyolLink');
    const hepsiburadaLink = document.getElementById('hepsiburadaLink');
    if (product.trendyolUrl) { trendyolLink.href = product.trendyolUrl; trendyolLink.style.display = ''; }
    if (product.hepsiburadaUrl) { hepsiburadaLink.href = product.hepsiburadaUrl; hepsiburadaLink.style.display = ''; }
    if (product.trendyolUrl || product.hepsiburadaUrl) platformsSection.style.display = '';

    // Tab: description
    const compatModel = product.specs?.find?.(s => s.key === 'Uyumlu Model')?.value || product.brand;
    document.getElementById('tabDescription').innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <h4 style="margin-top:24px;">Özellikler</h4>
        <ul class="desc-features">
            ${(product.features || []).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
        <h4 style="margin-top:24px;">Uyumlu Model</h4>
        <p>${compatModel}</p>
    `;

    // Tab: specs
    if (product.specs?.length) {
        document.getElementById('specsTable').innerHTML = product.specs.map(s =>
            `<tr><td>${s.key}</td><td>${s.value}</td></tr>`
        ).join('');
    }

    // Gallery images
    if (product.images && product.images.length) {
        const imgs = product.images.slice(0, 30);
        let currentIdx = 0;

        const galleryMain = document.getElementById('galleryMain');
        const placeholder = galleryMain.querySelector('.gallery-placeholder');

        const _webp = src => src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        const mainPicture = document.createElement('picture');
        const mainSource  = document.createElement('source');
        mainSource.type   = 'image/webp';
        mainSource.srcset = _webp(imgs[0]);
        const mainImg = document.createElement('img');
        mainImg.src = imgs[0];
        mainImg.alt = product.name;
        mainImg.className = 'gallery-main-img';
        mainImg.loading         = 'eager';
        mainImg.fetchPriority   = 'high';
        mainImg.width   = 800;
        mainImg.height  = 800;
        mainImg.title = 'Büyütmek için tıklayın';
        mainImg.style.cursor = 'zoom-in';
        mainPicture.appendChild(mainSource);
        mainPicture.appendChild(mainImg);
        if (placeholder) placeholder.replaceWith(mainPicture);

        // Thumbnails strip
        let thumbsEl = null;
        if (imgs.length > 1) {
            thumbsEl = document.createElement('div');
            thumbsEl.className = 'gallery-thumbs';
            thumbsEl.innerHTML = imgs.slice(0, Math.min(imgs.length, 20)).map((src, i) =>
                `<picture><source srcset="${_webp(src)}" type="image/webp"><img src="${src}" alt="${product.name}" loading="lazy" width="120" height="120" class="gallery-thumb${i === 0 ? ' active' : ''}"></picture>`
            ).join('');
            galleryMain.after(thumbsEl);

            // Prev / Next buttons
            const btnPrev = document.createElement('button');
            btnPrev.className = 'gallery-nav gallery-nav--prev';
            btnPrev.setAttribute('aria-label', 'Önceki');
            btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';

            const btnNext = document.createElement('button');
            btnNext.className = 'gallery-nav gallery-nav--next';
            btnNext.setAttribute('aria-label', 'Sonraki');
            btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';

            const counter = document.createElement('div');
            counter.className = 'gallery-counter';
            counter.textContent = `1 / ${imgs.length}`;

            galleryMain.appendChild(btnPrev);
            galleryMain.appendChild(btnNext);
            galleryMain.appendChild(counter);

            btnPrev.addEventListener('click', e => { e.stopPropagation(); navigate(currentIdx - 1); });
            btnNext.addEventListener('click', e => { e.stopPropagation(); navigate(currentIdx + 1); });
        }

        // Navigate gallery
        function navigate(idx) {
            currentIdx = (idx + imgs.length) % imgs.length;
            mainImg.src = imgs[currentIdx];
            mainSource.srcset = _webp(imgs[currentIdx]);

            const counter = galleryMain.querySelector('.gallery-counter');
            if (counter) counter.textContent = `${currentIdx + 1} / ${imgs.length}`;

            if (thumbsEl) {
                const thumbImgs = thumbsEl.querySelectorAll('.gallery-thumb');
                thumbImgs.forEach((t, i) => t.classList.toggle('active', i === currentIdx));
                thumbImgs[currentIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }

        // Thumb clicks
        thumbsEl?.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
            thumb.addEventListener('click', () => navigate(i));
        });

        // Swipe on gallery main
        let touchX = 0;
        galleryMain.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
        galleryMain.addEventListener('touchend', e => {
            const diff = touchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) navigate(currentIdx + (diff > 0 ? 1 : -1));
        });

        // Lightbox on click
        mainImg.addEventListener('click', () => openLightbox(imgs, currentIdx));
    }

    // Share button
    const btnShare = document.getElementById('btnShare');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareData = {
                title: product.name + ' | Motor Tente Market',
                text: product.name + ' — ' + formatPrice(product.price),
                url: window.location.href
            };
            if (navigator.share) {
                try { await navigator.share(shareData); } catch {}
            } else {
                await navigator.clipboard.writeText(window.location.href);
                btnShare.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { btnShare.innerHTML = '<i class="fas fa-share-nodes"></i>'; }, 2000);
            }
        });
    }

    // Back button — restore referrer filter state if came from urunler
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        const referrer = sessionStorage.getItem('productListReferrer') || 'urunler.html';
        btnBack.addEventListener('click', () => { window.location.href = referrer; });
    }
}

function openLightbox(imgs, startIdx) {
    let idx = startIdx;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <button class="lightbox-close" aria-label="Kapat"><i class="fas fa-times"></i></button>
        ${imgs.length > 1 ? `
        <button class="lightbox-nav lightbox-prev" aria-label="Önceki"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox-nav lightbox-next" aria-label="Sonraki"><i class="fas fa-chevron-right"></i></button>` : ''}
        <div class="lightbox-body">
            <img class="lightbox-img" src="${imgs[idx]}" alt="">
        </div>
        ${imgs.length > 1 ? `<div class="lightbox-counter">${idx + 1} / ${imgs.length}</div>` : ''}
    `;
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('active'));

    const lbImg = lb.querySelector('.lightbox-img');
    const lbCounter = lb.querySelector('.lightbox-counter');

    function goTo(newIdx) {
        idx = (newIdx + imgs.length) % imgs.length;
        lbImg.classList.add('lightbox-img--fade');
        setTimeout(() => {
            lbImg.src = imgs[idx];
            lbImg.classList.remove('lightbox-img--fade');
        }, 120);
        if (lbCounter) lbCounter.textContent = `${idx + 1} / ${imgs.length}`;
    }

    function close() {
        lb.classList.remove('active');
        setTimeout(() => { lb.remove(); document.body.style.overflow = ''; }, 280);
        document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowLeft')   goTo(idx - 1);
        if (e.key === 'ArrowRight')  goTo(idx + 1);
    }

    lb.querySelector('.lightbox-backdrop').addEventListener('click', close);
    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev')?.addEventListener('click', () => goTo(idx - 1));
    lb.querySelector('.lightbox-next')?.addEventListener('click', () => goTo(idx + 1));
    document.addEventListener('keydown', onKey);

    // Swipe in lightbox
    let touchX = 0;
    lbImg.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener('touchend', e => {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(idx + (diff > 0 ? 1 : -1));
    });
}

async function loadRelated(category, excludeId) {
    try {
        const resp = await fetch(`${API_BASE}/api/products?category=${category}&pageSize=5`);
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        const related = data.items.filter(p => p.id !== excludeId).slice(0, 4);
        related.forEach(p => { window._productCache[p.id] = p; });
        document.getElementById('relatedProducts').innerHTML = related.map(p => productCardHTML(p)).join('');
    } catch {
        if (typeof products !== 'undefined') {
            const related = products.filter(p => p.category === category && p.id !== excludeId).slice(0, 4);
            related.forEach(p => { window._productCache[p.id] = p; });
            document.getElementById('relatedProducts').innerHTML = related.map(p => productCardHTML(p)).join('');
        }
    }
}

// ===== META HELPERS =====
function _setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
    el.setAttribute('content', content);
}
function _setOg(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.setAttribute('content', content);
}

// ===== TABS =====
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

