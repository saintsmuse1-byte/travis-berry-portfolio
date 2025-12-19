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
    
    // FIX 1: Slowed down from 0.08 to 0.05 for a much more "weighted" slow feel
    const SMOOTHING = 0.05; 
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

    // ANIMATION PATHS
    function animateElements(scrollY) {
        if (!runnerBoy || !runnerOverlay || !feather) return;

        // Increase finishLine to 1600 to make the journey last longer (slower)
        const startTrigger = 0;      
        const finishLine = 1600;      
        
        if (scrollY >= startTrigger && scrollY <= (finishLine + 100)) {
            let progress = (scrollY - startTrigger) / (finishLine - startTrigger);
            progress = Math.min(Math.max(progress, 0), 1);
            
            // Fix 3: opacity transition to prevent glitching at edges
            runnerOverlay.style.opacity = (progress > 0.01 && progress < 0.98) ? 1 : 0;

            const bx = -350 + ((window.innerWidth + 700) * progress);
            const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
            const by = 450 + bCurve;
            
            runnerBoy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

            // FIX 2: Pushed feather further ahead (from 130 to 220) 
            // This puts it clearly in front of the outstretched hand
            const fx = bx + 220; 
            const squiggle = Math.sin(progress * 10) * 50; 
            const fy = by - 40 + squiggle;
            const rotateFeather = progress * 1500;
            
            feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${rotateFeather}deg)`;
            
            const fIdx = Math.floor(progress * 40) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
        } else {
            runnerOverlay.style.opacity = 0;
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

    function engine() {
        targetScroll = window.scrollY;
        // Use currentScroll for both content and animation to keep them in sync
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        
        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-currentScroll.toFixed(2)}px, 0)`;
        }
        
        // Pass currentScroll instead of window.scrollY to prevent glitching
        animateElements(currentScroll);

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
