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

    // Carousel Navigation
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % totalSlides;
        track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
    };

    // THE RISING EFFECT (TimQ Style)
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress: 0 at the bottom, 1 when centered
        let progress = 1 - (rect.top / (vh * 0.8));
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Expansion logic
        const targetH = vh * 0.9;
        const targetW = targetH * 0.75;
        artExpander.style.width = `${300 + (targetW - 300) * progress}px`;
        artExpander.style.height = `${400 + (targetH - 400) * progress}px`;
        
        // Rising Logic: Moves UP from the bottom
        const lift = (1 - progress) * 300;
        artExpander.style.transform = `translateY(${lift}px)`;
    }

    function updateRunner() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2200, 0), 1);
        overlay.style.opacity = (progress > 0.02 && progress < 0.85) ? 1 : 0;
        const bx = -400 + (window.innerWidth + 800) * progress;
        const by = 350 + (650 * Math.pow(progress, 2)) - (550 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        const fx = bx + 300 + (progress * 850);
        const fy = by - 140 + (Math.sin(progress * 15) * 100);
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${y * 1.5}deg)`;
        const fIdx = Math.floor(progress * 45) % frames.length;
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
