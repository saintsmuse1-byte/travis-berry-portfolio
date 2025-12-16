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

    // --- ARC ANIMATION ---
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;
        const start = 0;
        const range = 1800; // Distance he runs
        
        if (scrollY > start && scrollY < start + range) {
            const progress = (scrollY - start) / range;
            
            // X: Left to Right
            const x = (window.innerWidth - 320) * progress;
            
            // Y: Follow Scroll + Sin Wave Arc (Dips 350px)
            const yArc = Math.sin(progress * Math.PI) * 350;
            const y = scrollY + yArc;

            runnerBoy.style.transform = `translate(${x}px, ${y}px)`;
            
            // Frame Switch
            const frame = Math.floor(progress * 20) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[frame];
            
            runnerContainer.style.opacity = 1;
            runnerContainer.style.visibility = 'visible';
        } else {
            runnerContainer.style.opacity = 0;
            runnerContainer.style.visibility = 'hidden';
        }
    }

    // --- CANVAS SNOW ---
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };
    window.addEventListener('mousemove', e => {
        const r = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * aboutCanvas.width;
            this.y = Math.random() * aboutCanvas.height;
            this.bx = this.x; this.by = this.y;
            this.d = (Math.random() * 15) + 2;
            this.isFlake = Math.random() > 0.6;
            this.sz = this.isFlake ? 25 : Math.random() * 3 + 1;
        }
        draw() {
            ctx.fillStyle = 'white';
            if (this.isFlake) {
                ctx.font = `${this.sz}px serif`;
                ctx.fillText('❅', this.x, this.y);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let f = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx / dist) * f * this.d;
                this.y -= (dy / dist) * f * this.d;
            } else {
                this.x -= (this.x - this.bx) * 0.1;
                this.y -= (this.y - this.by) * 0.1;
            }
        }
    }

    function initCanvas() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 100; i++) particles.push(new Particle());
    }

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        animateRunner(currentScroll);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(engine);
    }

    window.addEventListener('resize', () => {
        initCanvas();
        document.body.style.height = smoothContent.offsetHeight + 'px';
    });

    // Start
    initCanvas();
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 500);
    engine();
});
