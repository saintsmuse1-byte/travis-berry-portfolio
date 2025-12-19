document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 
    const feather = document.getElementById('feather');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    const RUNNER_FRAMES = [
        'images/runner-boy-1.PNG', 
        'images/number one.PNG', 
        'images/runner-boy-3.PNG', 
        'images/number three.PNG'
    ];

    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.05; 
    const mouse = { x: -1000, y: -1000, radius: 180 };

    // 1. SNOW
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

    // 2. THE ANIMATION UPDATE (Called inside engine to stop glitching)
    function updateAnimations(y) {
        if (!runnerBoy || !runnerOverlay || !feather) return;

        const startTrigger = 0;      
        const finishLine = 1600; 
        
        let progress = (y - startTrigger) / (finishLine - startTrigger);
        progress = Math.min(Math.max(progress, 0), 1);

        if (progress > 0 && progress < 0.99) {
            runnerOverlay.style.opacity = 1;

            // BOY POSITION
            const bx = -350 + ((window.innerWidth + 700) * progress);
            const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
            const by = 450 + bCurve;
            runnerBoy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

            // FEATHER POSITION (SPEED BOOSTED)
            // Added 1.5x horizontal multiplier for feather to make it "outrun" him
            const fx = bx + 250 + (progress * 400); 
            const squiggle = Math.sin(progress * 12) * 60; 
            const fy = by - 80 + squiggle;
            const rotateFeather = progress * 1800;
            
            feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${rotateFeather}deg)`;
            
            const fIdx = Math.floor(progress * 40) % RUNNER_FRAMES.length;
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
        
        // Use translate3d for better performance (stops glitching)
        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-currentScroll.toFixed(2)}px, 0)`;
        }
        
        // Pass the SMOOTHED currentScroll to the animation
        updateAnimations(currentScroll);

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
    setTimeout(syncHeight, 1500);
});
