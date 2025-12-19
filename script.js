document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 
    const feather = document.getElementById('feather');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    // UPDATED FILENAMES
    const RUNNER_FRAMES = [
        'images/runner-boy-1.PNG', 
        'images/number one.PNG', 
        'images/runner-boy-3.PNG', 
        'images/number three.PNG'
    ];

    let currentScroll = 0, targetScroll = 0;
    const SMOOTHING = 0.08;
    const mouse = { x: -1000, y: -1000, radius: 180 };

    // 1. SNOW LOGIC
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

    // 2. RUNNER & FEATHER ANIMATION
    function animateElements(scrollY) {
        if (!runnerBoy || !runnerOverlay || !feather) return;

        const startTrigger = 0;      
        const finishLine = 1200;      
        
        if (scrollY >= startTrigger && scrollY <= (finishLine + 100)) {
            let progress = (scrollY - startTrigger) / (finishLine - startTrigger);
            progress = Math.min(Math.max(progress, 0), 1);
            runnerOverlay.style.opacity = (progress > 0.98) ? 0 : 1;

            // BOY'S SCOOP PATH
            const bx = -250 + ((window.innerWidth + 500) * progress);
            const bCurve = (600 * Math.pow(progress, 2)) - (500 * progress);
            const by = 460 + bCurve;
            runnerBoy.style.transform = `translate(${bx}px, ${by}px)`;

            // FEATHER'S WAVY PATH
            // It stays 120px ahead of the boy
            const fx = bx + 120;
            // Sine wave creates the squiggle (Math.sin)
            const squiggle = Math.sin(progress * 15) * 40; 
            const fy = by - 30 + squiggle;
            // Rotation based on progress
            const rotation = progress * 1000; 
            feather.style.transform = `translate(${fx}px, ${fy}px) rotate(${rotation}deg)`;
            
            const fIdx = Math.floor(progress * 35) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
        } else {
            runnerOverlay.style.opacity = 0;
        }
    }

    // 3. ABOUT CANVAS
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

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        
        if(smoothContent) {
            smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        }
        
        animateElements(window.scrollY);

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
            const h = smoothContent.offsetHeight;
            ghostSpacer.style.height = h + 'px';
            document.body.style.height = h + 'px';
        }
    }

    window.addEventListener('resize', () => { initCanvas(); syncHeight(); });
    initCanvas();
    syncHeight();
    engine();
    setTimeout(syncHeight, 1000);
});
