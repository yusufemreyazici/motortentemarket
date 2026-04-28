// ===== HOMEPAGE JS =====
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedSlider();
    initSlider();
    initHeader();
    initCart();
    initScrollEffects();
    initContactForm();
    initPaymentMarquee();
});

// ===== PAYMENT MARQUEE =====
function initPaymentMarquee() {
    const track = document.getElementById('paymentTrack');
    if (!track) return;
    // Kartları kopyalayıp sonsuz döngü için ekle
    const clone = track.innerHTML;
    track.innerHTML += clone;
}

// ===== FEATURED PRODUCTS SLIDER (12 ürün, 3'er gruplu, 4 sayfa) =====
function initFeaturedSlider() {
    const track      = document.getElementById('featuredTrack');
    const dotsWrap   = document.getElementById('featuredDots');
    const btnPrev    = document.getElementById('featuredPrev');
    const btnNext    = document.getElementById('featuredNext');
    if (!track) return;

    const PER_PAGE   = 3;
    const featured   = products.filter(p => p.badge).concat(products.filter(p => !p.badge))
                               .slice(0, 12);
    const totalPages = Math.ceil(featured.length / PER_PAGE);
    let current      = 0;
    let timer;

    // Grupları oluştur
    for (let i = 0; i < totalPages; i++) {
        const group = document.createElement('div');
        group.className = 'featured-group' + (i === 0 ? ' active' : '');
        const pageProducts = featured.slice(i * PER_PAGE, i * PER_PAGE + PER_PAGE);
        group.innerHTML = `<div class="product-grid">${pageProducts.map(p => productCardHTML(p)).join('')}</div>`;
        track.appendChild(group);
    }

    // Dot'ları oluştur
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'featured-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Grup ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    }

    function goTo(index) {
        track.children[current].classList.remove('active');
        dotsWrap.children[current].classList.remove('active');
        current = (index + totalPages) % totalPages;
        track.children[current].classList.add('active');
        dotsWrap.children[current].classList.add('active');
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 3000);
    }

    btnPrev?.addEventListener('click', () => goTo(current - 1));
    btnNext?.addEventListener('click', () => goTo(current + 1));

    // Hover'da duraklat
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', resetTimer);

    resetTimer();

    // Kartları göster
    setTimeout(() => {
        track.querySelectorAll('.product-card').forEach(c => c.classList.add('visible'));
    }, 100);
}

// ===== HERO SLIDER =====
function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let interval;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
        resetInterval();
    }

    function nextSlide() { goToSlide((current + 1) % slides.length); }
    function prevSlide() { goToSlide((current - 1 + slides.length) % slides.length); }
    function resetInterval() { clearInterval(interval); interval = setInterval(nextSlide, 3000); }

    document.getElementById('heroNext')?.addEventListener('click', nextSlide);
    document.getElementById('heroPrev')?.addEventListener('click', prevSlide);
    resetInterval();
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.category-card, .why-card, .platform-card, .contact-card').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const text = `Merhaba, web sitenizden yazıyorum.\n\nAd: ${name}\nTelefon: ${phone}\n${email ? 'E-posta: ' + email + '\n' : ''}${subject ? 'Konu: ' + subject + '\n' : ''}\nMesaj: ${message}`;
        window.open(`https://wa.me/905327748927?text=${encodeURIComponent(text)}`, '_blank');
        showNotification('Mesajınız WhatsApp\'a yönlendirildi!');
        e.target.reset();
    });
}

// Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('cartOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }
});
