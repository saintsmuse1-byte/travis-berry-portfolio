document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.getElementById('falling-snow-container');
    const track = document.getElementById('carousel-track');
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');

    // 1. GENERATE SNOW
    if (snowContainer) {
        for (let i = 0; i < 40; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 3 + 4) + 's';
            flake.style.opacity = Math.random();
            snowContainer.appendChild(flake);
        }
    }

    // 2. CAROUSEL (6 Slides)
    let slideIdx = 0;
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + 6) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
    };

    // 3. RUNNER BOY MATH
    function updateRunner() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2000, 0), 1);
        overlay.style.opacity = (progress > 0.05 && progress < 0.9) ? 1 : 0;
        
        const bx = -200 + (window.innerWidth + 400) * progress;
        const by = 400 + (600 * Math.pow(progress, 2)) - (500 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        
        const fIdx = Math.floor(progress * 40) % frames.length;
        document.querySelector('.boy-frame.active').classList.remove('active');
        frames[fIdx].classList.add('active');
    }

    window.addEventListener('scroll', updateRunner);
});
