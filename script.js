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
            flake.style.fontSize = (Math.random() * 15 + 10) + 'px';
            snowContainer.appendChild(flake);
        }
    }

    // 2. THE "GOD MODE" ANIMATION ENGINE
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerOverlay) return;

        // --- SETTINGS (Easy to understand now) ---
        const startScroll = 50;  // User must scroll 50px before boy appears
        const endScroll = 2000;  // At 2000px scroll, boy hits the right side
        
        // SCREEN COORDINATES (Where on the glass does he start/end?)
        // Start: 500px from top (Near circle bottom), 10% from left
        const startY = 550; 
        const startX = window.innerWidth * 0.05; 
        
        // End: 1200px from top (Lower down), 100% from left (Off screen)
        const endY = 1200; 
        const endX = window.innerWidth; 
        // -----------------------------------------

        if (scrollY > startScroll && scrollY <= (endScroll + 200)) {
            // Normalize scroll to 0.0 -> 1.0
            let progress = (scrollY - startScroll) / (endScroll - startScroll);
            
            // Linear Interpolation (Lerp)
            // Current = Start + (Difference * Progress)
            const currentX = startX + ((endX - startX) * progress);
            const currentY = startY + ((endY - startY) * progress);

            runnerBoy.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            // Frame Cycle
            const fIdx = Math.floor(progress * 40) % RUNNER_FRAMES.length;
            const safeIdx = Math.max(0, fIdx); // Prevent -1 index error
            runnerBoy.src = RUNNER_FRAMES[safeIdx];
            
            // Fade In/Out logic
            runnerOverlay.style.opacity = (progress > 0.9) ? 0 : 1;
        } else {
            runnerOverlay.style.opacity = 0;
        }
    }

    // 3. ABOUT CANVAS (Fixed Mouse Physics)
    const ctx = aboutCanvas.getContext('2d');
    let particles = [];

    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 90; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({ 
                x: px, y: py, bx: px, by: py, 
                vx: 0, vy: 0, 
                d: (Math.random() * 15) + 5, 
                isFlake: Math.random() > 0.7, 
                sz: Math.random() * 3 + 1 
            });
        }
    }

    // IMPORTANT: Listen on WINDOW to catch mouse everywhere
    window.addEventListener('mousemove', e => {
        // We only care about mouse relative to the canvas WHEN the canvas is visible
        const rect = aboutCanvas.getBoundingClientRect();
        // If canvas is on screen
        if(rect.top < window.innerHeight && rect.bottom > 0) {
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }
    });

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        
        // Apply smooth scroll to content
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        // Animate overlay (Uses raw scrollY for direct control)
        animateRunner(window.scrollY);

        // Canvas Physics
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 15; // Higher force = more bounce
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
