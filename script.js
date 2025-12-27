document.addEventListener('DOMContentLoaded', () => {
    const artSection = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');

    let slideIdx = 0;
    const totalSlides = 6;
    let lastFrameIdx = 0;

    // 1. CAROUSEL
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % totalSlides;
        track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
    };

    // 2. STABLE EXPANSION MATH
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress is 0 when the section starts entering, 1 when it fills screen
        let progress = 1 - (rect.top / vh);
        progress = Math.min(Math.max(progress, 0), 1);
        
        const targetH = vh * 0.95;
        const targetW = targetH * 0.8;

        // Smoothly interpolate size
        const currentW = 300 + (targetW - 300) * progress;
        const currentH = 400 + (targetH - 400) * progress;

        artExpander.style.width = `${currentW}px`;
        artExpander.style.height = `${currentH}px`;
        
        // The "Rise" - Card moves from 300px down to 0px (centered)
        const lift = (1 - progress) * 300;
        artExpander.style.transform = `translateY(${lift}px)`;
    }

    // 3. RUNNER PATH
    function updateRunner() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2500, 0), 1);
        overlay.style.opacity = (progress > 0.05 && progress < 0.9) ? 1 : 0;
        
        const bx = -300 + (window.innerWidth + 600) * progress;
        const by = 400 + (600 * Math.pow(progress, 2)) - (500 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        
        const fIdx = Math.floor(progress * 40) % frames.length;
        if (fIdx !== lastFrameIdx) {
            frames[lastFrameIdx].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrameIdx = fIdx;
        }
    }

    window.addEventListener('scroll', () => {
        updateExpansion();
        updateRunner();
    });

    updateExpansion();
    updateRunner();
});
