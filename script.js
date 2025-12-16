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
    const mouse = { x: -1000, y: -1000, radius: 150 };

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

    // 2. HERO-ONLY SLOPE
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerOverlay) return;

        // --- SETTINGS FOR THE HERO PAGE ONLY ---
        const startTrigger = 20;     // Starts as soon as you scroll
        const finishLine = 1200;    // He reaches the right side at 1200px scroll (Hero end)
        
        // Start Position (relative to screen)
        const startX = -100;         
        const startY = 480;         
        
        // End Position (relative to screen)
        const endX = window.innerWidth + 100; 
        const endY = 650;           // Only 170px drop over full width = Very shallow
        // ---------------------------------------

        if (scrollY > startTrigger && scrollY <= finishLine) {
            // progress goes 0 to 1 strictly within the Hero section
            let progress = (scrollY - startTrigger) / (finishLine - startTrigger);
            progress = Math.min(Math.max(progress, 0), 1);

            const currentX = startX + ((endX - startX) * progress);
            const currentY = startY + ((endY - startY) * progress);

            runnerBoy.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            // Speed up the legs slightly for a more frantic run
            const fIdx = Math.floor(progress * 60) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
            
            runnerOverlay.style.opacity = 1;
        } else {
            // Hide him if we are at the top OR past the finish line
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
            particles.push({ x: px, y: py, bx: px, by: py, vx: 0, vy: 0, d: (Math.random() * 15) + 5, isFlake: Math.random() > 0.7, sz: Math.random() * 3 + 1 });
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
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        animateRunner(window.scrollY);

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
            if (p.isFlake) { ctx.font = "24px serif"; ctx.fillText('❅', p.x, p.y); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill(); }
        });
        requestAnimationFrame(engine);
    }
