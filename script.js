document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;
    const mouse = { x: -1000, y: -1000, radius: 180 };

    // 1. SNOW
    if (snowContainer) {
        for (let i = 0; i < 15; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 7) + 's';
            flake.style.opacity = Math.random();
            snowContainer.appendChild(flake);
        }
    }

    // 2. THE HERO-SECTION-ONLY SLOPE
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerOverlay) return;

        // --- TWEAK THESE THREE NUMBERS TO PERFECT THE TIMING ---
        const startTrigger = 0;      // Starts immediately on scroll
        const finishLine = 500;      // LOWERED: He reaches the right side sooner (at end of Hero)
        const verticalDrop = 70;    // LOWERED: Only drops 120px total (Very shallow)
        
        const startX = -200;         // Start off-screen left
        const startY = 460;          // Starting vertical height
        // -------------------------------------------------------

        if (scrollY >= startTrigger && scrollY <= (finishLine + 100)) {
            // Calculate progress (0.0 at top of page, 1.0 at finishLine)
            let progress = (scrollY - startTrigger) / (finishLine - startTrigger);
            progress = Math.min(Math.max(progress, 0), 1);

            // Move from Left to Right
            const x = startX + ((window.innerWidth + 200 - startX) * progress);
            
            // Move from StartY to EndY (Shallow drop)
            const y = startY + (verticalDrop * progress);

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            // Animate legs
            const fIdx = Math.floor(progress * 40) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
            
            // Fade out as he reaches the end
            runnerOverlay.style.opacity = (progress > 0.98) ? 0 : 1;
        } else {
            runnerOverlay.style.opacity = 0;
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

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        
        // Smooth scroll content
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        // Animate runner based on RAW scroll for precision
        animateRunner(window.scrollY);

        // About section interaction
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 15;
                p.vy -= (dy / dist) * force * 15;
            }
            p.vx += (p.bx - p.x) * 0.05;
            p.vy += (p.by - p.y) * 0.05;
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

    window.addEventListener('resize', () => {
        initCanvas();
        document.body.style.height = smoothContent.offsetHeight + 'px';
    });

    initCanvas();
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 800);
    engine();
});
