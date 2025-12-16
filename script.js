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

    // 1. SNOW GENERATION
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

    // 2. THE SHALLOW SLOPE ANIMATION ENGINE
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerOverlay) return;

        // --- SETTINGS ---
        const startScroll = 50;   // Start running almost immediately
        const endScroll = 1800;   // Finish running after 1800px of scrolling
        
        // --- SCREEN COORDINATES (The "Glass" Layer) ---
        // Start: 480px from top of screen (Aligns with circle bottom)
        const startY = 480; 
        const startX = -150; // Start slightly off-screen left
        
        // End: 680px from top of screen (Only 200px drop = Shallow Slope)
        const endY = 680; 
        const endX = window.innerWidth; // Go all the way to the right edge
        // -----------------------------------------

        if (scrollY > startScroll && scrollY <= (endScroll + 200)) {
            // Calculate Progress (0.0 to 1.0)
            let progress = (scrollY - startScroll) / (endScroll - startScroll);
            
            // Linear Interpolation (Lerp) for position
            const currentX = startX + ((endX - startX) * progress);
            const currentY = startY + ((endY - startY) * progress);

            runnerBoy.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            // Frame Cycle (Speed of legs)
            const fIdx = Math.floor(progress * 50) % RUNNER_FRAMES.length;
            const safeIdx = Math.max(0, fIdx);
            runnerBoy.src = RUNNER_FRAMES[safeIdx];
            
            // Fade In/Out logic
            // Fade out quickly at the end (progress > 0.9)
            runnerOverlay.style.opacity = (progress > 0.9) ? 0 : 1;
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
            particles.push({ 
                x: px, y: py, bx: px, by: py, 
                vx: 0, vy: 0, 
                d: (Math.random() * 15) + 5, 
                isFlake: Math.random() > 0.7, 
                sz: Math.random() * 3 + 1 
            });
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
        
        // Smooth Scroll the content
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        // Animate Overlay (Use raw scrollY for direct control)
        animateRunner(window.scrollY);

        // Canvas Physics
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
