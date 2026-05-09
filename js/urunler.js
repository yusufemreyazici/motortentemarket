// ===== PRODUCTS PAGE =====
let currentCategory = 'all';
let selectedBrands  = [];
let priceMin        = null;
let priceMax        = null;
let filterNew       = false;
let filterDiscount  = false;
let sortBy          = 'newest';
let viewMode        = 'grid';
let currentPage     = 1;
const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', async () => {
    initHeader();
    initFilters();
    initSidebar();
    readURLParams();
    updateCategoryCounts();
    await Promise.all([fetchBrands(), applyFilters()]);
});

// ===== API =====
async function fetchBrands() {
    try {
        const resp = await fetch(API_BASE + '/api/brands');
        if (!resp.ok) throw new Error();
        const brands = await resp.json();
        renderBrandFilters(brands);
    } catch {
        if (typeof getBrandsLocally === 'function') renderBrandFilters(getBrandsLocally());
    }
}

async function applyFilters() {
    const search = (document.getElementById('searchInput')?.value || '').trim();

    const params = new URLSearchParams();
    if (currentCategory !== 'all') params.set('category', currentCategory);
    selectedBrands.forEach(b => params.append('brand', b));
    if (priceMin !== null) params.set('priceMin', priceMin);
    if (priceMax !== null) params.set('priceMax', priceMax);
    if (filterNew)      params.set('isNew', 'true');
    if (filterDiscount) params.set('hasDiscount', 'true');
    if (search)         params.set('search', search);
    params.set('sortBy', sortBy === 'default' ? 'newest' : sortBy);
    params.set('page', currentPage);
    params.set('pageSize', ITEMS_PER_PAGE);

    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#888;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>`;

    try {
        const resp = await fetch(`${API_BASE}/api/products?${params}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        // Populate cache for addToCart
        data.items.forEach(p => { window._productCache[p.id] = p; });

        renderProducts(data.items);
        renderPagination(data.totalCount, data.totalPages);
        updateActiveFilters();
        updatePageTitle();

        document.getElementById('resultCount').textContent = `${data.totalCount} ürün bulundu`;
        const empty = data.items.length === 0;
        document.getElementById('noResults').style.display   = empty ? 'block' : 'none';
        document.getElementById('productGrid').style.display  = empty ? 'none'  : '';
        document.getElementById('pagination').style.display   = empty ? 'none'  : '';
    } catch {
        if (typeof filterProductsLocally === 'function') {
            const data = filterProductsLocally(params);
            data.items.forEach(p => { window._productCache[p.id] = p; });
            renderProducts(data.items);
            renderPagination(data.totalCount, data.totalPages);
            updateActiveFilters();
            updatePageTitle();
            document.getElementById('resultCount').textContent = `${data.totalCount} ürün bulundu`;
            const empty = data.items.length === 0;
            document.getElementById('noResults').style.display  = empty ? 'block' : 'none';
            document.getElementById('productGrid').style.display = empty ? 'none'  : '';
            document.getElementById('pagination').style.display  = empty ? 'none'  : '';
        } else {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#888;">
                <i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom:12px;display:block;"></i>
                Ürünler yüklenirken bir hata oluştu.
            </div>`;
        }
    }
}

// ===== URL PARAMS =====
function readURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('kategori') || (window.location.hash.startsWith('#kat=') ? window.location.hash.replace('#kat=', '') : null);
    if (cat) {
        currentCategory = cat;
        const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
        if (radio) radio.checked = true;
    }
    const ara = params.get('ara');
    if (ara) {
        const si = document.getElementById('searchInput');
        if (si) si.value = ara;
        const hi = document.getElementById('headerSearch');
        if (hi) hi.value = ara;
    }
    updateNavActiveLink();
}

// ===== NAV ACTIVE LINK =====
function updateNavActiveLink() {
    document.querySelectorAll('.h2-nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isAll       = href === 'urunler.html' && currentCategory === 'all';
        const hasCategory = href.includes(`kategori=${currentCategory}`);
        link.classList.toggle('active', isAll || hasCategory);
    });
}

// ===== BRAND FILTERS =====
function renderBrandFilters(brands) {
    const container = document.getElementById('brandFilters');

    const brandCounts = {};
    if (typeof products !== 'undefined') {
        products.forEach(p => { if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });
    }

    container.innerHTML = brands.map(b => `
        <label class="sidebar-check">
            <input type="checkbox" value="${b}" class="brand-checkbox">
            <span class="check-custom"></span>
            <span class="brand-label">${b}</span>
            <span class="brand-count">${brandCounts[b] || 0}</span>
        </label>
    `).join('');

    container.addEventListener('change', () => {
        selectedBrands = [...document.querySelectorAll('.brand-checkbox:checked')].map(cb => cb.value);
        currentPage = 1;
        applyFilters();
        updateFilterBadge();
    });

    // Marka arama
    document.getElementById('brandSearch')?.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        container.querySelectorAll('.sidebar-check').forEach(label => {
            const name = label.querySelector('.brand-label').textContent.toLowerCase();
            label.style.display = name.includes(q) ? '' : 'none';
        });
    });
}

function updateFilterBadge() {
    const total = selectedBrands.length +
        (currentCategory !== 'all' ? 1 : 0) +
        (priceMin !== null || priceMax !== null ? 1 : 0) +
        (filterNew ? 1 : 0) + (filterDiscount ? 1 : 0);

    const badge = document.getElementById('filterBadge');
    const brandBadge = document.getElementById('brandSelectedBadge');

    if (badge) { badge.textContent = total || ''; badge.style.display = total > 0 ? 'inline-flex' : 'none'; }
    if (brandBadge) { brandBadge.textContent = selectedBrands.length || ''; brandBadge.style.display = selectedBrands.length > 0 ? 'inline-flex' : 'none'; }
}

function updateCategoryCounts() {
    if (typeof products === 'undefined') return;
    const counts = {};
    products.forEach(p => { counts.all = (counts.all || 0) + 1; counts[p.category] = (counts[p.category] || 0) + 1; });
    const map = {
        all: 'countAll',
        '2-tekerlekli': 'count2',
        '3-tekerlekli': 'count3',
        '4-tekerlekli': 'count4',
    };
    Object.entries(map).forEach(([cat, id]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = counts[cat] || 0;
    });
}

// ===== INIT FILTERS =====
function initFilters() {
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', () => {
            currentCategory = radio.value;
            currentPage = 1;
            applyFilters();
            updateURL();
            updateNavActiveLink();
        });
    });

    document.getElementById('applyPrice').addEventListener('click', () => {
        const min = parseInt(document.getElementById('priceMin').value);
        const max = parseInt(document.getElementById('priceMax').value);
        priceMin = isNaN(min) ? null : min;
        priceMax = isNaN(max) ? null : max;
        currentPage = 1;
        applyFilters();
    });

    document.getElementById('filterNew').addEventListener('change', (e) => {
        filterNew = e.target.checked; currentPage = 1; applyFilters();
    });

    document.getElementById('filterDiscount').addEventListener('change', (e) => {
        filterDiscount = e.target.checked; currentPage = 1; applyFilters();
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortBy = e.target.value; currentPage = 1; applyFilters();
    });

    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1; applyFilters();
    });
    document.getElementById('headerSearch')?.addEventListener('input', (e) => {
        const si = document.getElementById('searchInput');
        if (si) { si.value = e.target.value; currentPage = 1; applyFilters(); }
    });
    document.getElementById('mobileSearchInput')?.addEventListener('input', (e) => {
        const si = document.getElementById('searchInput');
        if (si) { si.value = e.target.value; currentPage = 1; applyFilters(); }
    });

    document.getElementById('viewGrid').addEventListener('click', () => setView('grid'));
    document.getElementById('viewList').addEventListener('click', () => setView('list'));
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

// ===== SIDEBAR MOBILE =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle  = document.getElementById('filterToggle');
    const close   = document.getElementById('sidebarClose');
    toggle?.addEventListener('click', () => sidebar.classList.add('active'));
    close?.addEventListener('click',  () => sidebar.classList.remove('active'));
}

// ===== RENDER =====
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (viewMode === 'list') {
        grid.className = 'pcard-list';
        grid.innerHTML = items.map(p => productRowHTML(p)).join('');
    } else {
        grid.className = 'pcard-grid';
        grid.innerHTML = items.map((p, i) => productCardHTML(p, i < 4)).join('');
    }
    // Save current URL so product detail "Geri Dön" can restore filter state
    grid.querySelectorAll('.pcard-link').forEach(a => {
        a.addEventListener('click', () => {
            sessionStorage.setItem('productListReferrer', window.location.href);
        }, { once: true });
    });
    // Apply dynamic WA links if settings already loaded
    if (window._siteSettings) applySettingsToDOM(window._siteSettings);
}

// ===== PAGINATION =====
function renderPagination(totalCount, totalPages) {
    const pagination = document.getElementById('pagination');
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }

    let html = '';
    if (currentPage > 1) html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-dots">...</span>`;
        }
    }

    if (currentPage < totalPages) html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    applyFilters();
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ===== VIEW MODE =====
function setView(mode) {
    viewMode = mode;
    document.getElementById('viewGrid').classList.toggle('active', mode === 'grid');
    document.getElementById('viewList').classList.toggle('active', mode === 'list');
    applyFilters();
}

// ===== ACTIVE FILTERS DISPLAY =====
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    let tags = [];

    if (currentCategory !== 'all') {
        const catNames = {
            '2-tekerlekli': '2 Tekerlekli',
            '3-tekerlekli': '3 Tekerlekli',
            '4-tekerlekli': '4 Tekerlekli',
        };
        tags.push(`<span class="active-filter-tag">${catNames[currentCategory] || currentCategory} <button onclick="removeFilter('category')"><i class="fas fa-times"></i></button></span>`);
    }
    selectedBrands.forEach(b => {
        tags.push(`<span class="active-filter-tag">${b} <button onclick="removeFilter('brand','${b}')"><i class="fas fa-times"></i></button></span>`);
    });
    if (priceMin !== null || priceMax !== null) {
        const lo = priceMin !== null ? formatPrice(priceMin) : '0 TL';
        const hi = priceMax !== null ? formatPrice(priceMax) : '...';
        tags.push(`<span class="active-filter-tag">${lo} - ${hi} <button onclick="removeFilter('price')"><i class="fas fa-times"></i></button></span>`);
    }
    if (filterNew)      tags.push(`<span class="active-filter-tag">Yeni Ürünler <button onclick="removeFilter('new')"><i class="fas fa-times"></i></button></span>`);
    if (filterDiscount) tags.push(`<span class="active-filter-tag">İndirimli <button onclick="removeFilter('discount')"><i class="fas fa-times"></i></button></span>`);

    container.style.display = tags.length > 0 ? 'flex' : 'none';
    container.innerHTML = tags.join('') + (tags.length > 1 ? `<button class="clear-all-btn" onclick="clearAllFilters()">Tümünü Temizle</button>` : '');
}

function removeFilter(type, value) {
    switch (type) {
        case 'category':
            currentCategory = 'all';
            document.querySelector('input[name="category"][value="all"]').checked = true;
            break;
        case 'brand':
            const cb = document.querySelector(`.brand-checkbox[value="${value}"]`);
            if (cb) cb.checked = false;
            selectedBrands = selectedBrands.filter(b => b !== value);
            break;
        case 'price':
            priceMin = null; priceMax = null;
            document.getElementById('priceMin').value = '';
            document.getElementById('priceMax').value = '';
            break;
        case 'new':
            filterNew = false; document.getElementById('filterNew').checked = false; break;
        case 'discount':
            filterDiscount = false; document.getElementById('filterDiscount').checked = false; break;
    }
    currentPage = 1;
    applyFilters();
    updateURL();
}

function clearAllFilters() {
    currentCategory = 'all';
    selectedBrands  = [];
    priceMin        = null;
    priceMax        = null;
    filterNew       = false;
    filterDiscount  = false;
    sortBy          = 'newest';
    currentPage     = 1;

    document.querySelector('input[name="category"][value="all"]').checked = true;
    document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value  = '';
    document.getElementById('priceMax').value  = '';
    document.getElementById('filterNew').checked      = false;
    document.getElementById('filterDiscount').checked = false;
    document.getElementById('searchInput').value      = '';
    document.getElementById('sortSelect').value       = 'newest';
    const bs = document.getElementById('brandSearch');
    if (bs) { bs.value = ''; document.querySelectorAll('#brandFilters .sidebar-check').forEach(l => l.style.display = ''); }

    applyFilters();
    updateURL();
    updateFilterBadge();
}

// ===== PAGE TITLE UPDATE =====
function updatePageTitle() {
    const categoryNames = {
        'all':           'Tüm Ürünler',
        '2-tekerlekli':  '2 Tekerlekli',
        '3-tekerlekli':  '3 Tekerlekli',
        '4-tekerlekli':  '4 Tekerlekli',
    };
    const title = categoryNames[currentCategory] || 'Tüm Ürünler';
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('breadcrumbCurrent').textContent = title;
    document.title = `${title} | Motor Tente Market`;
}

// ===== URL UPDATE =====
function updateURL() {
    const url = new URL(window.location);
    if (currentCategory !== 'all') {
        url.searchParams.set('kategori', currentCategory);
    } else {
        url.searchParams.delete('kategori');
    }
    window.history.replaceState({}, '', url);
}
