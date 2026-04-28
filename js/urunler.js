// ===== PRODUCTS PAGE =====
let currentCategory = 'all';
let selectedBrands = [];
let priceMin = 0;
let priceMax = Infinity;
let filterNew = false;
let filterDiscount = false;
let sortBy = 'default';
let viewMode = 'grid';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initCart();
    initBrandFilters();
    initFilters();
    initSidebar();
    readURLParams();
    applyFilters();
});

// ===== URL PARAMS =====
function readURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('kategori') || (window.location.hash.startsWith('#kat=') ? window.location.hash.replace('#kat=', '') : null);
    if (cat) {
        currentCategory = cat;
        const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
        if (radio) radio.checked = true;
    }
}

// ===== BRAND FILTERS =====
function initBrandFilters() {
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const container = document.getElementById('brandFilters');
    container.innerHTML = brands.map(b => `
        <label class="sidebar-check">
            <input type="checkbox" value="${b}" class="brand-checkbox">
            <span class="check-custom"></span>
            <span>${b}</span>
        </label>
    `).join('');
}

// ===== INIT FILTERS =====
function initFilters() {
    // Category
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', () => {
            currentCategory = radio.value;
            currentPage = 1;
            applyFilters();
            updateURL();
        });
    });

    // Brands
    document.getElementById('brandFilters').addEventListener('change', () => {
        selectedBrands = [...document.querySelectorAll('.brand-checkbox:checked')].map(cb => cb.value);
        currentPage = 1;
        applyFilters();
    });

    // Price
    document.getElementById('applyPrice').addEventListener('click', () => {
        priceMin = parseInt(document.getElementById('priceMin').value) || 0;
        priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
        currentPage = 1;
        applyFilters();
    });

    // Quick filters
    document.getElementById('filterNew').addEventListener('change', (e) => {
        filterNew = e.target.checked;
        currentPage = 1;
        applyFilters();
    });

    document.getElementById('filterDiscount').addEventListener('change', (e) => {
        filterDiscount = e.target.checked;
        currentPage = 1;
        applyFilters();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortBy = e.target.value;
        currentPage = 1;
        applyFilters();
    });

    // Search (sidebar + header)
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        applyFilters();
    });
    document.getElementById('headerSearch')?.addEventListener('input', (e) => {
        const si = document.getElementById('searchInput');
        if (si) { si.value = e.target.value; currentPage = 1; applyFilters(); }
    });

    // View toggle
    document.getElementById('viewGrid').addEventListener('click', () => setView('grid'));
    document.getElementById('viewList').addEventListener('click', () => setView('list'));

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

// ===== SIDEBAR MOBILE =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('filterToggle');
    const close = document.getElementById('sidebarClose');

    toggle?.addEventListener('click', () => sidebar.classList.add('active'));
    close?.addEventListener('click', () => sidebar.classList.remove('active'));
}

// ===== APPLY FILTERS =====
function applyFilters() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();

    let filtered = products.filter(p => {
        if (currentCategory !== 'all' && p.category !== currentCategory) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        if (p.price < priceMin || p.price > priceMax) return false;
        if (filterNew && !p.isNew) return false;
        if (filterDiscount && !p.oldPrice) return false;
        if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
        return true;
    });

    // Sort
    switch (sortBy) {
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr')); break;
        case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr')); break;
        case 'newest': filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    renderProducts(filtered);
    renderPagination(filtered.length);
    updateActiveFilters();
    updatePageTitle();

    document.getElementById('resultCount').textContent = `${filtered.length} ürün bulundu`;
    document.getElementById('noResults').style.display = filtered.length === 0 ? 'block' : 'none';
    document.getElementById('productGrid').style.display = filtered.length === 0 ? 'none' : '';
    document.getElementById('pagination').style.display = filtered.length === 0 ? 'none' : '';
}

// ===== RENDER =====
function renderProducts(filtered) {
    const grid = document.getElementById('productGrid');
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    grid.className = viewMode === 'list' ? 'product-grid list-view' : 'product-grid prods2-page';

    if (viewMode === 'list') {
        grid.innerHTML = pageItems.map(p => `
            <div class="product-card product-card-list" onclick="window.location.href='urun-detay.html?id=${p.id}#${p.id}'">
                <div class="product-image">
                    <i class="fas fa-motorcycle"></i>
                    ${p.badge ? `<span class="product-badge ${p.isNew ? 'new' : ''}">${p.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${p.categoryLabel}</div>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-brand"><i class="fas fa-tag"></i> ${p.brand}</div>
                    <p class="product-desc-list">${p.description}</p>
                    <div class="product-features-list">
                        ${p.features.slice(0, 3).map(f => `<span class="feature-tag"><i class="fas fa-check"></i> ${f}</span>`).join('')}
                    </div>
                    <div class="product-bottom">
                        <div class="product-price">
                            ${p.oldPrice ? `<small>${formatPrice(p.oldPrice)}</small>` : ''}
                            ${formatPrice(p.price)}
                        </div>
                        <div class="product-list-actions">
                            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${p.id})">
                                <i class="fas fa-shopping-cart"></i> Sepete Ekle
                            </button>
                            <a href="urun-detay.html?id=${p.id}#${p.id}" class="btn btn-outline-dark btn-sm" onclick="event.stopPropagation();">
                                <i class="fas fa-eye"></i> Detay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        grid.innerHTML = pageItems.map(p => productCardHTML(p)).join('');
    }
}

// ===== PAGINATION =====
function renderPagination(total) {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
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
        const catLabel = products.find(p => p.category === currentCategory)?.categoryLabel || currentCategory;
        tags.push(`<span class="active-filter-tag">${catLabel} <button onclick="removeFilter('category')"><i class="fas fa-times"></i></button></span>`);
    }
    selectedBrands.forEach(b => {
        tags.push(`<span class="active-filter-tag">${b} <button onclick="removeFilter('brand','${b}')"><i class="fas fa-times"></i></button></span>`);
    });
    if (priceMin > 0 || priceMax < Infinity) {
        tags.push(`<span class="active-filter-tag">${formatPrice(priceMin)} - ${priceMax < Infinity ? formatPrice(priceMax) : '...'} <button onclick="removeFilter('price')"><i class="fas fa-times"></i></button></span>`);
    }
    if (filterNew) tags.push(`<span class="active-filter-tag">Yeni Ürünler <button onclick="removeFilter('new')"><i class="fas fa-times"></i></button></span>`);
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
            priceMin = 0; priceMax = Infinity;
            document.getElementById('priceMin').value = '';
            document.getElementById('priceMax').value = '';
            break;
        case 'new':
            filterNew = false;
            document.getElementById('filterNew').checked = false;
            break;
        case 'discount':
            filterDiscount = false;
            document.getElementById('filterDiscount').checked = false;
            break;
    }
    currentPage = 1;
    applyFilters();
    updateURL();
}

function clearAllFilters() {
    currentCategory = 'all';
    selectedBrands = [];
    priceMin = 0;
    priceMax = Infinity;
    filterNew = false;
    filterDiscount = false;
    currentPage = 1;

    document.querySelector('input[name="category"][value="all"]').checked = true;
    document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('filterNew').checked = false;
    document.getElementById('filterDiscount').checked = false;
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'default';
    sortBy = 'default';

    applyFilters();
    updateURL();
}

// ===== PAGE TITLE UPDATE =====
function updatePageTitle() {
    const categoryNames = {
        'all': 'Tüm Ürünler',
        'elektrikli-motor-kabinleri': '2 Tekerlekli — Elektrikli Kabin',
        'kasal-motor-kabinleri': '2 Tekerlekli — Kasal Kabin',
        '2-tekerli-motor-tenteleri': '2 Tekerlekli — Tente',
        '3-tekerli-motor-tenteleri': '3 Tekerlekli — Tente',
        '4-tekerli-motor-tenteleri': '4 Tekerlekli — Tente',
        '4-tekerli-motor-kabinleri': '4 Tekerlekli — Kabin',
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
