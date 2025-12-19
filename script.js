document.addEventListener('DOMContentLoaded', () => {
    const runnerBoy = document.getElementById('runner-boy');
    const feather = document.getElementById('feather');
    const runnerOverlay = document.getElementById('runner-overlay');
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const aboutCanvas = document.getElementById('about-canvas');

    // 1. PRELOAD RUNNER IMAGES (Kills the Flicker)
    const framePaths = [
        'images/runner-boy-1.PNG',
        'images/number one.PNG',
        'images/runner-boy-3.PNG',
        'images/number three.PNG'
    ];

    const preloadedImages = [];
    framePaths.forEach(path => {
        const img = new Image();
        img.src = path;
        preloadedImages.push(img);
    });

    let lastIdx = -1;

    // 2. RUNNER & FEATHER ANIMATION
    function updateRunner() {
        const y = window.scrollY;
        const range = 1800; 
        let progress = Math.min(Math.max(y / range, 0), 1);

        // Appear/Disappear logic
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // SCOOP PATH FOR BOY
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
        const by = 450 + bCurve;
        runnerBoy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // FEATHER (Even Faster + Leading)
        const fx = bx + 300 + (progress * 850); // Increased multiplier for more speed
        const squiggle = Math.sin(progress * 15) * 100;
        const fy = by - 140 + squiggle;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2800}deg)`;

        // FRAME SWAP
        const fIdx = Math.floor(progress * 40) % framePaths.length;
        if (fIdx !== lastIdx) {
            runnerBoy.src = framePaths[fIdx];
            lastIdx = fIdx;
        }
    }

    // 3. AUTOMATIC ART CAROUSEL
    let currentSlide = 0;
    function autoScrollArt() {
        currentSlide = (currentSlide + 1) % slides.length;
        const offset = -(currentSlide * 100);
        if(track) track.style.transform = `translateX(${offset}%)`;
    }
    setInterval(autoScrollArt, 4000); // Scrolls every 4 seconds

    // 4. ABOUT CANVAS (Bigger Snowflakes)
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * aboutCanvas.width,
                y: Math.random() * aboutCanvas.height,
                bx: Math.random() * aboutCanvas.width,
                by: Math.random() * aboutCanvas.height,
                isFlake: Math.random() > 0.8,
                vx: 0, vy: 0
            });
        }
    }

    function renderCanvas() {
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            p.vx *= 0.9; p.vy *= 0.9;
            p.x += p.vx; p.y += p.vy;
            ctx.fillStyle = 'white';
            if (p.isFlake) {
                ctx.font = "50px serif"; // BIGGER SNOWFLAKES
                ctx.fillText('❅', p.x, p.y);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        requestAnimationFrame(renderCanvas);
    }

    // EVENT LISTENERS
    window.addEventListener('scroll', updateRunner);
    window.addEventListener('resize', initCanvas);

    initCanvas();
    renderCanvas();
    updateRunner();
});
