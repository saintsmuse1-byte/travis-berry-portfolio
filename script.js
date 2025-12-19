document.addEventListener('DOMContentLoaded', () => {
    const runnerOverlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const aboutCanvas = document.getElementById('about-canvas');

    let lastIdx = 0;

    function updateAnimations() {
        const y = window.scrollY;
        const start = 0;
        const end = 1800; // How long the animation lasts in scroll pixels
        
        let progress = Math.min(Math.max((y - start) / end, 0), 1);

        // Disappear at screen edges
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // BOY POSITION
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
        const by = 450 + bCurve;
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // FEATHER POSITION (Fast lead + Big wiggles)
        const fx = bx + 300 + (progress * 800); 
        const squiggle = Math.sin(progress * 15) * 100; 
        const fy = by - 140 + squiggle;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2800}deg)`;

        // FRAME TOGGLE
        const frameIdx = Math.floor(progress * 45) % frames.length;
        if (frameIdx !== lastIdx) {
            frames[lastIdx].classList.remove('active');
            frames[frameIdx].classList.add('active');
            lastIdx = frameIdx;
        }
    }

    // ABOUT CANVAS Logic
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 70; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({ x: px, y: py, bx: px, by: py, vx: 0, vy: 0, sz: Math.random() * 3 + 1 });
        }
    }

    function renderCanvas() {
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            p.vx += (p.bx - p.x) * 0.03; p.vy += (p.by - p.y) * 0.03;
            p.vx *= 0.9; p.vy *= 0.9;
            p.x += p.vx; p.y += p.vy;
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill(); 
        });
        requestAnimationFrame(renderCanvas);
    }

    // Listen to native scroll instead of the custom engine
    window.addEventListener('scroll', updateAnimations);
    window.addEventListener('resize', initCanvas);
    
    initCanvas();
    renderCanvas();
    updateAnimations(); // Initial run
});
