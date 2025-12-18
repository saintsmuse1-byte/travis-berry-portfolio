document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy');
    const snowOverlay = document.getElementById('snow-overlay');
    const aboutCanvas = document.getElementById('about-canvas');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentY = 0, targetY = 0;
    const easing = 0.07;
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // 1. GENERATE SNOW
    for (let i = 0; i < 25; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake-js';
        flake.innerHTML = '❅';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        flake.style.opacity = Math.random() * 0.7 + 0.3;
        snowOverlay.appendChild(flake);
    }

    // 2. CANVAS PARTICLES
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            let x = Math.random() * aboutCanvas.width;
            let y = Math.random() * aboutCanvas.height;
            particles.push({ x, y, bx: x, by: y, vx: 0, vy: 0, sz: Math.random() * 3 + 1 });
        }
    }

    window.addEventListener('mousemove', (e) => {
        const rect = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - (rect.top + window.scrollY); // Account for smooth scroll
    });

    function engine() {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * easing;
        smoothContent.style.transform = `translate3d(0, ${-currentY.toFixed(2)}px, 0)`;

        // CURVED RUNNER ANIMATION
        if (runnerBoy && runnerOverlay) {
            const startLine = 10;
            const finishLine = 1000;

            if (targetY > startLine && targetY < finishLine + 200) {
                let progress = Math.min(Math.max((targetY - startLine) / (finishLine - startLine), 0), 1);
                runnerOverlay.style.opacity = (progress > 0.01 && progress < 0.98) ? 1 : 0;

                const bx = -300 + (window.innerWidth + 600) * progress;
                
                // THE SCOOP: Dip down and pull back up
                // (550 * progress^2) - (450 * progress) creates the curve
                const curveDip = (550 * (progress * progress)) - (450 * progress);
                const by = 420 + curveDip; 
                
                runnerBoy.style.transform = `translate(${bx}px, ${by}px)`;

                const fIdx = Math.floor(targetY / 120) % RUNNER_FRAMES.length;
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = 0;
            }
        }

        // ABOUT CANVAS DRAWING
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x, dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 10;
                p.vy -= (dy / dist) * force * 10;
            }
            p.vx += (p.bx - p.x) * 0.05;
            p.vy += (p.by - p.y) * 0.05;
            p.vx *= 0.9; p.vy *= 0.9;
            p.x += p.vx; p.y += p.vy;
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill();
        });

        requestAnimationFrame(engine);
    }

    function updateHeight() {
        document.body.style.height = Math.floor(smoothContent.offsetHeight) + "px";
    }

    window.addEventListener('resize', () => { initCanvas(); updateHeight(); });
    initCanvas();
    updateHeight();
    setTimeout(updateHeight, 1000);
    engine();
});
