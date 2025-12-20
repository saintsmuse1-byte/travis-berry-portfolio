document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const artSection = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const snowContainer = document.getElementById('falling-snow-container');

    let lastFrameIdx = 0;

    // Runner Logic
    function updateRunner() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2200, 0), 1);
        overlay.style.opacity = (progress > 0.02 && progress < 0.85) ? 1 : 0;
        const bx = -400 + (window.innerWidth + 800) * progress;
        const by = 450 + (650 * Math.pow(progress, 2)) - (550 * progress);
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

    // Exact TimQ Expansion Logic
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress is 0 when the section enters, 1 when centered
        let progress = 1 - (rect.top / vh);
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Target: 90% of height, 4:5 ratio
        const targetH = vh * 0.9;
        const targetW = targetH * 0.8;
        
        // Current Dimensions
        const curW = 300 + (targetW - 300) * progress;
        const curH = 400 + (targetH - 400) * progress;
        
        artExpander.style.width = `${curW}px`;
        artExpander.style.height = `${curH}px`;
        
        // Rise effect: Move UP as it expands
        const lift = (1 - progress) * 200;
        artExpander.style.transform = `translateY(${lift}px)`;
    }

    // Carousel
    let slideIdx = 0;
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % 3;
        track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + 3) % 3;
        track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    };

    window.addEventListener('scroll', () => {
        updateRunner();
        updateExpansion();
    });
    
    updateRunner();
    updateExpansion();
});
