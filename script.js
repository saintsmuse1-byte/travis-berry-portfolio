document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.getElementById('falling-snow-container');
    const track = document.getElementById('carousel-track');
    
    // SNOW GENERATOR
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

    // CAROUSEL (6 SLIDES)
    let slideIdx = 0;
    const nextBtn = document.getElementById('next-arrow');
    const prevBtn = document.getElementById('prev-arrow');

    if (nextBtn && prevBtn) {
        nextBtn.onclick = () => {
            slideIdx = (slideIdx + 1) % 6;
            track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
        };
        prevBtn.onclick = () => {
            slideIdx = (slideIdx - 1 + 6) % 6;
            track.style.transform = `translateX(-${slideIdx * 16.6666}%)`;
        };
    }
});
