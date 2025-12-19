document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 
    const feather = document.getElementById('feather');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    const RUNNER_FRAMES = [
        'images/runner-boy-1.PNG', 'images/number one.PNG', 
        'images/runner-boy-3.PNG', 'images/number three.PNG'
    ];

    // --- PRELOAD LOGIC (Kills the Flicker) ---
    const preloadedImages = [];
    RUNNER_FRAMES.forEach((src) => {
        const img = new Image();
        img.src = src;
        preloadedImages.push(img);
    });

    let currentScroll = 0, targetScroll = 0;
    let lastFrameIdx = -1;
    const SMOOTHING = 0.06; 
    const mouse = { x: -1000, y: -1000, radius: 180 };

    // SNOW
    if (snowContainer) {
        for (let i = 0; i < 20; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 7) + 's';
            flake.style.opacity = Math.random();
            snowContainer.appendChild(flake);
        }
    }

    function updateAnimations(y) {
        if (!runnerBoy || !runnerOverlay || !feather) return;

        const startTrigger = 0;      
        const finishLine = 1600; 
        let progress = (y - startTrigger) / (finishLine - startTrigger);
        progress = Math.min(Math.max(progress, 0), 1);

        // Disappear/Appear at screen edges
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // BOY POSITION
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
        const by = 450 + bCurve;
        runnerBoy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // FEATHER POSITION (Faster + Bigger)
        const fx = bx + 280 + (progress * 550); 
        const squiggle = Math.sin(progress * 14) * 75; 
        const fy = by - 100 + squiggle;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2200}deg)`;
        
        // FRAME SWAPPING (Only swaps if the frame actually changes)
        const fIdx = Math.floor(progress * 45) % RUNNER_FRAMES.length;
        if (fIdx !== lastFrameIdx) {
            runnerBoy.src = RUNNER_FRAMES[fIdx];
            lastFrameIdx = fIdx;
        }
    }

    // ABOUT CANVAS
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 90; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({ x: px, y: py, bx: px, by: py, vx: 0, vy: 0, isFlake: Math.random() > 0.7, sz: Math.random() * 3 + 1 });
        }
    }

    window.addEventListener('mousemove', e => {
        const rect = aboutCanvas.getBoundingClientRect();
        if(rect.top < window.innerHeight && rect.bottom > 0) {
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }
    });

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        const scrollPos = parseFloat(currentScroll.toFixed(2));

        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-scrollPos}px, 0)`;
        }
        
        updateAnimations(scrollPos);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x, dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 15;
                p.vy -= (dy / dist) * force * 15;
            }
            p.vx += (p.bx - p.x) * 0.05; p.vy += (p.by - p.y) * 0.05;
            p.vx *= 0.9; p.vy *= 0.9;
            p.x += p.vx; p.y += p.vy;
            ctx.fillStyle = 'white';
            if (p.isFlake) { 
                ctx.font = "24px serif"; ctx.fillText('❅', p.x, p.y); 
            } else { 
                ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill(); 
            }
        });
        requestAnimationFrame(engine);
    }

    function syncHeight() {
        if (smoothContent && ghostSpacer) {
            const h = smoothContent.getBoundingClientRect().height;
            ghostSpacer.style.height = h + 'px';
            document.body.style.height = h + 'px';
        }
    }

    window.addEventListener('resize', () => { initCanvas(); syncHeight(); });
    window.addEventListener('load', syncHeight);
    initCanvas();
    syncHeight();
    engine();
    setTimeout(syncHeight, 2000);
});
