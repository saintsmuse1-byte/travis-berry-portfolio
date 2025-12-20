document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const artSection = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const snowContainer = document.getElementById('falling-snow-container');
    const canvas = document.getElementById('about-canvas');
    const ctx = canvas.getContext('2d');

    let lastFrameIdx = 0;

    // 1. Snowflakes and Runner logic remain the same as previous step to maintain function
    if (snowContainer) {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            flake.appendChild(snowContainer);
        }
    }

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

    // 2. TIMQ EXPANSION (The "Rising" Card)
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress of expansion based on scroll
        let progress = 1 - (rect.top / (vh * 0.8));
        progress = Math.min(Math.max(progress, 0), 1);
        
        const targetH = vh * 0.85;
        const targetW = targetH * 0.75;

        const curW = 280 + (targetW - 280) * Math.pow(progress, 1.5);
        const curH = 380 + (targetH - 380) * Math.pow(progress, 1.5);

        artExpander.style.width = `${curW}px`;
        artExpander.style.height = `${curH}px`;
        
        // This creates the "Rising" effect from the bottom
        const lift = (1 - progress) * 250;
        artExpander.style.transform = `translateY(${lift}px)`;
    }

    // 3. Carousel Logic
    let slideIdx = 0;
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % 3;
        track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + 3) % 3;
        track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    };

    window.addEventListener('scroll', () => { updateRunner(); updateExpansion(); });
    updateRunner(); updateExpansion();
});
