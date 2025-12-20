document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const artExpander = document.getElementById('art-expander');
    const artSection = document.getElementById('art-section-trigger');
    const track = document.getElementById('carousel-track');

    // 1. RUNNER LOGIC (Fixed scaling)
    function updateRunner() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2200, 0), 1);
        overlay.style.opacity = (progress > 0.02 && progress < 0.8) ? 1 : 0;
        
        const bx = -400 + (window.innerWidth + 800) * progress;
        const by = 450 + (650 * Math.pow(progress, 2)) - (550 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        
        const fx = bx + 300 + (progress * 850);
        const fy = by - 140 + (Math.sin(progress * 15) * 100);
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${y * 1.5}deg)`;

        const fIdx = Math.floor(progress * 45) % frames.length;
        document.querySelector('.boy-frame.active')?.classList.remove('active');
        frames[fIdx].classList.add('active');
    }

    // 2. TIMQ-STYLE EXPANSION (The White Box Grows)
    function updateExpansion() {
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress 0 to 1 based on section visibility
        let progress = 1 - (rect.top / vh);
        progress = Math.min(Math.max(progress, 0), 1);

        // Final target sizes (4:5 Ratio)
        const targetH = vh * 0.9;
        const targetW = targetH * 0.8;

        // Animate width/height from 200px to target
        const currentW = 200 + (targetW - 200) * progress;
        const currentH = 200 + (targetH - 200) * progress;

        artExpander.style.width = `${currentW}px`;
        artExpander.style.height = `${currentH}px`;
        // Rise effect
        artExpander.style.transform = `translateY(${(1 - progress) * 100}px)`;
    }

    // 3. CAROUSEL
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
    
    // Initial calls
    updateRunner();
    updateExpansion();
});
