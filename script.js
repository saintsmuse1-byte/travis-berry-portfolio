document.addEventListener('DOMContentLoaded', () => {
    // 1. SNOW GENERATOR (For both Hero and About)
    function createSnow(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 3 + 4) + 's';
            flake.style.opacity = Math.random() * 0.7;
            flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            container.appendChild(flake);
        }
    }
    createSnow('hero-snow');
    createSnow('about-snow');

    // 2. RUNNER BOY (LIMITED TO HERO)
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const heroH = window.innerHeight;
        
        // Progress: Goes 0 to 1 ONLY during the Hero section
        let progress = y / heroH;
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Hide boy once we leave hero
        overlay.style.opacity = (progress > 0 && progress < 0.95) ? 1 : 0;
        
        // Path
        const bx = -300 + (window.innerWidth + 600) * progress;
        const by = 400 + (300 * Math.pow(progress, 2));
        boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        
        // Frames
        const fIdx = Math.floor(progress * 30) % frames.length;
        if (fIdx !== lastFrame) {
            frames[lastFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrame = fIdx;
        }
    });

    // 3. CAROUSEL
    const track = document.getElementById('carousel-track');
    let slideIdx = 0;
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + 6) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
    };
});
