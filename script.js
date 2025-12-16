document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;

    // 1. GENERATE SNOWFLAKES (Reliable JS method)
    function createSnow() {
        for (let i = 0; i < 15; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 7) + 's';
            flake.style.opacity = Math.random();
            flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowContainer.appendChild(flake);
        }
    }
    createSnow();

    // 2. SOFT DOWNWARD SLOPE LOGIC
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;
        const range = 2500; 
        
        if (scrollY > 10 && scrollY <= range) {
            const progress = scrollY / range;
            
            // X: Left to Right
            const x = (window.innerWidth - 300) * progress;
            
            // Y: Gentle Linear Slope (No curve, just a soft diagonal down)
            const slopeDepth = 200; // Total vertical drop
            const y = scrollY + (progress * slopeDepth);

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            // Cycle all 4 frames
            const frameIdx = Math.floor(progress * 40) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[frameIdx];
            
            runnerContainer.style.opacity = 1;
        } else {
            runnerContainer.style.opacity = 0;
        }
    }

    // 3. ABOUT CANVAS LOGIC
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({ x: px, y: py, bx: px, by: py, d: (Math.random() * 10) + 2, isFlake: Math.random() > 0.7, sz: Math.random() * 3 + 1 });
        }
    }

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        animateRunner(currentScroll);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            p.x -= (p.x - p.bx) * 0.1; p.y -= (p.y - p.by) * 0.1;
            ctx.fillStyle = 'white';
            if (p.isFlake) { ctx.font = "20px serif"; ctx.fillText('❅', p.x, p.y); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI*2); ctx.fill(); }
        });
        requestAnimationFrame(engine);
    }

    window.addEventListener('resize', () => {
        initCanvas();
        document.body.style.height = smoothContent.offsetHeight + 'px';
    });

    initCanvas();
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 800);
    engine();
});
