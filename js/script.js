document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    const heroTextContainer = document.querySelector('.hero-text-container');
    const recruitLabel = document.querySelector('.recruit-label');
    const cards = document.querySelectorAll('.floating-card');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    // --- 浮層相關變量 ---
    const popupTriggers = document.querySelectorAll('.job-popup-trigger');
    const closeButtons = document.querySelectorAll('.popup-close-btn');
    const jobDetailPopups = document.querySelectorAll('.job-detail-popup');
    const jobListings = document.querySelectorAll('.job-listing'); // 新增：獲取所有 job-listing
    // 選擇所有的在 job-listing 內的 a 標籤 (排除 .job-popup-trigger)
    const otherButtons = document.querySelectorAll('.job-listing a:not(.job-popup-trigger)'); 
    
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
        // 新增：若從 PC 變為手機，則關閉所有浮層
        if (window.innerWidth <= 768) {
            closeAllPopups();
        }
    });

    updateOnScroll();

    // --- 浮層控制邏輯 (已修改) ---

    function closeAllPopups() {
        jobDetailPopups.forEach(popup => {
            popup.classList.remove('is-open');
        });
        // 確保關閉時，移除所有 job-listing 的 active 狀態
        jobListings.forEach(listing => {
            listing.classList.remove('is-active-popup');
        });
    }

    // 點擊職位標題時的處理邏輯
    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // 僅在 PC 端 (寬度 > 768px) 執行此邏輯
            if (window.innerWidth <= 768) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetPopup = document.getElementById(targetId);
            const parentListing = this.closest('.job-listing'); // 獲取父級 .job-listing
            
            if (targetPopup.classList.contains('is-open')) {
                // 如果已經打開，則關閉 (同時移除父級 active 類)
                targetPopup.classList.remove('is-open');
                parentListing.classList.remove('is-active-popup');
            } else {
                // 否則，先關閉所有，再打開目標
                closeAllPopups(); 
                
                // 打開目標浮層，並添加父級 active 類來提升 z-index
                targetPopup.classList.add('is-open');
                parentListing.classList.add('is-active-popup');
            }
        });
    });

    // 點擊關閉按鈕時的處理邏輯
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllPopups();
        });
    });

    // 點擊其他按鈕時的處理邏輯
    otherButtons.forEach(button => {
        button.addEventListener('click', function() {
             // 僅在 PC 端 (寬度 > 768px) 執行此邏輯
            if (window.innerWidth <= 768) {
                return;
            }
            // 點擊任何其他按鈕時，關閉所有浮層
            closeAllPopups();
        });
    });
    
});