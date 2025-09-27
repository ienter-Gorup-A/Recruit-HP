document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    const heroTextContainer = document.querySelector('.hero-text-container');
    const recruitLabel = document.querySelector('.recruit-label');
    const cards = document.querySelectorAll('.floating-card');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    let lastScrollY = 0;
    let ticking = false;

    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            mobileMenuToggle.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    mobileNavOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

function updateOnScroll() {
    const scrollY = window.scrollY;

    const startFade = 400;
    const fadeDuration = 1200;


    const scrollInFadeZone = Math.max(0, scrollY - startFade);
    
    const progress = Math.min(1, scrollInFadeZone / fadeDuration);
    const opacity = 1 - progress;

    header.style.opacity = opacity;

    if (opacity <= 0) {
        header.style.pointerEvents = 'none';
    } else {
        header.style.pointerEvents = 'auto';
    }
    

    const isMobile = window.innerWidth <= 768;
    
    if(heroTextContainer && scrollY < window.innerHeight && !isMobile) {
        const heroProgress = scrollY / (window.innerHeight * 0.8);
        const heroOpacity = Math.max(0, 1 - heroProgress);
        const heroTranslateY = scrollY * 0.6;
        heroTextContainer.style.opacity = heroOpacity;
        heroTextContainer.style.transform = `translateY(${heroTranslateY}px)`;
    }

    if(recruitLabel && scrollY < window.innerHeight && !isMobile) {
        const labelProgress = scrollY / (window.innerHeight * 0.5);
        const labelOpacity = Math.max(0, 1 - labelProgress);
        const labelTranslateY = scrollY * 0.25;
        recruitLabel.style.opacity = labelOpacity;
        recruitLabel.style.transform = `translateY(${labelTranslateY}px)`;
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 100);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            mobileMenuToggle.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    updateOnScroll();
});