document.addEventListener('DOMContentLoaded', () => {
    const runnerOverlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    let lastIdx = 0;

    function animate() {
        const y = window.scrollY;
        const range = 1800; // Animation duration in pixels
        let progress = Math.min(Math.max(y / range, 0), 1);

        // Fade entire overlay in/out
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // Boy Movement
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const by = 450 + (600 * Math.pow(progress, 2)) - (500 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // Feather Lead Movement
        const fx = bx + 300 + (progress * 800);
        const fy = by - 120 + (Math.sin(progress * 15) * 80);
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2000}deg)`;

        // Frame Toggling
        const frameIdx = Math.floor(progress * 40) % frames.length;
        if (frameIdx !== lastIdx) {
            frames[lastIdx].classList.remove('active');
            frames[frameIdx].classList.add('active');
            lastIdx = frameIdx;
        }
    }

    window.addEventListener('scroll', animate);
    animate(); // Run once on load
});
