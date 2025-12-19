document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    let currentScroll = 0, targetScroll = 0;
    let lastIdx = 0;
    const SMOOTHING = 0.06;
    const mouse = { x: -1000, y: -1000, radius: 180 };

    // 1. SNOW GENERATOR
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

    // 2. ANIMATION LOGIC
    function updateAnimations(y) {
        if (!boyContainer || !runnerOverlay || !feather) return;

        const start = 0;
        const end = 1700; // Adjust scroll length here
        let progress = Math.min(Math.max((y - start) / end, 0), 1);

        // Disappear at extreme edges
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // BOY POSITION (Scoop Path)
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
        const by = 450 + bCurve;
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // FEATHER POSITION (Faster and Wavy)
        const fx = bx + 300 + (progress * 750); // Massive horizontal lead
        const squiggle = Math.sin(progress * 15) * 85; 
        const fy = by - 120 + squiggle;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2500}deg)`;

        // FRAME SWAPPING (Sprite Stacking Fix)
        const frameIdx = Math.floor(progress * 45) % frames.length;
        if (frameIdx !== lastIdx) {
            frames[lastIdx].classList.remove('active');
            frames[frameIdx].classList.add('active');
            lastIdx = frameIdx;
        }
    }

    // 3. ABOUT CANVAS PHYSICS
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

    // 4. MAIN LOOP (Smooth Content + Runner Sync)
    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        const scrollPos = parseFloat(currentScroll.toFixed(2));

        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-scrollPos}px, 0)`;
        }
        
        updateAnimations(scrollPos);

        // Canvas Rendering
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
