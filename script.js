document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');

    if (!smoothContent || !aboutCanvas) return;

    const ctx = aboutCanvas.getContext('2d');
    // Ensure these file names match your folder EXACTLY
    const RUNNER_FRAMES = [
        'images/boy 1.PNG',
        'images/boy 2.PNG',
        'images/boy 3.PNG',
        'images/boy 4.PNG'
    ];
    
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;

    // FLATTENED BEZIER (The "Blue Line" path)
    function getBezierY(t) {
        const p0 = 0;    // Start (Left)
        const p1 = 480;  // First control point (controls the "dip" speed)
        const p2 = 480;  // Second control point (keeps the bottom flat)
        const p3 = 250;  // End point (how much it rises back up)
        
        return Math.pow(1 - t, 3) * p0 + 
               3 * Math.pow(1 - t, 2) * t * p1 + 
               3 * (1 - t) * Math.pow(t, 2) * p2 + 
               Math.pow(t, 3) * p3;
    }

    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;
        const range = 2400; // Total scroll length of the animation
        
        if (scrollY >= 0 && scrollY <= range) {
            const progress = scrollY / range;
            
            // Calculate Position
            const x = (window.innerWidth - 300) * progress;
            const yOffset = getBezierY(progress);
            const y = scrollY + yOffset;

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            // FRAME SWITCHING LOGIC
            // We use a faster multiplier (40) to ensure the 4 frames cycle 
            // multiple times during the run
            const frameIndex = Math.floor(progress * 40) % RUNNER_FRAMES.length;
            if (runnerBoy.src.indexOf(RUNNER_FRAMES[frameIndex]) === -1) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
            }
            
            runnerContainer.style.opacity = 1;
        } else {
            runnerContainer.style.opacity = 0;
        }
    }

    // --- ABOUT CANVAS SNOW ---
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({ x: px, y: py, bx: px, by: py, d: (Math.random() * 10) + 2, isFlake: Math.random() > 0.7, sz: Math.random() * 3 + 1 });
        }
    }

    window.addEventListener('mousemove', e => {
        const r = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

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
            if (p.isFlake) { ctx.font = "20px serif"; ctx.fillText('❅', p.x, p.y); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI*2); ctx.fill(); }
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
