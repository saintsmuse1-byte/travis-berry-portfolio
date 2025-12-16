document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    if (!smoothContent || !aboutCanvas) return;

    const ctx = aboutCanvas.getContext('2d');
    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // 1. HEADER SNOW
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

    // 2. RUNNER ENGINE (FIXED AXIS)
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;

        // FIDDLE SETTINGS
        const scrollRange = 2200; // How long he stays on screen
        const verticalDrop = 1200; // Increase this to make the slope steeper

        if (scrollY > 10 && scrollY <= scrollRange) {
            const progress = scrollY / scrollRange;
            
            // X-AXIS: Forces him to travel the full width of the browser
            // Subtracting 300 ensures he doesn't disappear too early or cause scroll
            const x = (window.innerWidth) * progress;
            
            // Y-AXIS: Downward slope
            const y = scrollY + (progress * verticalDrop);

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            const fIdx = Math.floor(progress * 45) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
            runnerContainer.style.opacity = 1;
        } else {
            runnerContainer.style.opacity = 0;
        }
    }

    // 3. ABOUT CANVAS (MOUSE PHYSICS)
    let particles = [];
    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 100; i++) {
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
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        animateRunner(currentScroll);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
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
