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

    // BEZIER CALCULATION
    function getBezierY(t) {
        // Points: P0 (Start), P1 (Control), P2 (Control), P3 (End)
        // These values control the 'Sweep' and 'Depth'
        const p0 = 0;    // Starting height
        const p1 = 400;  // Initial dip speed
        const p2 = 600;  // Flat bottom depth
        const p3 = 550;  // Final height glide
        
        return Math.pow(1 - t, 3) * p0 + 
               3 * Math.pow(1 - t, 2) * t * p1 + 
               3 * (1 - t) * Math.pow(t, 2) * p2 + 
               Math.pow(t, 3) * p3;
    }

    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;
        const range = 2400; 
        const start = 0;
        
        if (scrollY >= start && scrollY <= (start + range)) {
            const progress = (scrollY - start) / range;
            const x = (window.innerWidth - 320) * progress;
            const yBezier = getBezierY(progress);
            const y = scrollY + yBezier;

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            const fIdx = Math.floor(progress * 30) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[fIdx];
            runnerContainer.style.opacity = 1;
        } else {
            runnerContainer.style.opacity = 0;
        }
    }

    // --- INTERACTIVE ABOUT CANVAS ---
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 90; i++) {
            let px = Math.random() * aboutCanvas.width;
            let py = Math.random() * aboutCanvas.height;
            particles.push({
                x: px, y: py, bx: px, by: py,
                d: (Math.random() * 15) + 2,
                isFlake: Math.random() > 0.65,
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
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 800);
    engine();
});
