document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');
    if (!smoothContent || !aboutCanvas) return;

    const ctx = aboutCanvas.getContext('2d');
    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;

    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;

        const start = 0;
        const range = 2400; // How long the run lasts in scroll pixels
        
        if (scrollY >= start && scrollY <= (start + range)) {
            const progress = (scrollY - start) / range;
            
            // X: Linear left-to-right move
            const x = (window.innerWidth - 320) * progress;
            
            // Y: THE BLUE LINE CURVE (Quadratic Parabola)
            // progress * progress makes the drop start slow and get steeper
            // 650 is the 'Depth' of the drop. Increase to drop further.
            const curveDrop = Math.pow(progress, 2) * 650; 
            
            // scrollY keeps him in view while the curveDrop creates the arc path
            const y = scrollY + curveDrop;

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            const frame = Math.floor(progress * 30) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[frame];
            
            runnerContainer.style.opacity = 1;
            runnerContainer.style.visibility = 'visible';
        } else {
            runnerContainer.style.opacity = 0;
            runnerContainer.style.visibility = 'hidden';
        }
    }

    // --- CANVAS ENGINE ---
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 100; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({
                x: px, y: py, bx: px, by: py,
                d: (Math.random() * 15) + 2,
                isFlake: Math.random() > 0.6,
                sz: Math.random() * 3 + 1
            });
        }
    }

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        animateRunner(currentScroll);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x, dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let f = (mouse.radius - dist) / mouse.radius;
                p.x -= (dx/dist) * f * p.d;
                p.y -= (dy/dist) * f * p.d;
            } else {
                p.x -= (p.x - p.bx) * 0.1;
                p.y -= (p.y - p.by) * 0.1;
            }
            ctx.fillStyle = 'white';
            if (p.isFlake) { ctx.font = "22px serif"; ctx.fillText('❅', p.x, p.y); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI*2); ctx.fill(); }
        });
        requestAnimationFrame(engine);
    }

    window.addEventListener('mousemove', e => {
        const r = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    window.addEventListener('resize', () => {
        initCanvas();
        document.body.style.height = smoothContent.offsetHeight + 'px';
    });

    initCanvas();
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 500);
    engine();
});
