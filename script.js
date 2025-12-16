document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');
    const ctx = aboutCanvas.getContext('2d');

    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.07;
    const BOY_WIDTH = 320;

    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];

    // --- DIAGONAL RUNNER LOGIC ---
    function animate(scrollY) {
        const start = 50;
        const range = 1200; // Total scroll distance for the run
        
        if (scrollY > start && scrollY < start + range) {
            const p = (scrollY - start) / range;
            
            // X moves from 0 to screen width
            const xTravel = (window.innerWidth - BOY_WIDTH) * p;
            
            // Y moves downward to follow the scroll speed
            // This keeps him centered in the viewport as you scroll
            const yTravel = scrollY * 0.8; 

            runnerBoy.style.transform = `translate(${xTravel}px, ${yTravel}px)`;
            
            // Frame animation
            const frameIndex = Math.floor(p * 20) % RUNNER_FRAMES.length;
            runnerBoy.src = RUNNER_FRAMES[frameIndex];
            
            runnerContainer.style.opacity = 1;
        } else {
            runnerContainer.style.opacity = 0;
        }
    }

    // --- ABOUT CANVAS SNOW ---
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };
    window.addEventListener('mousemove', e => {
        const r = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * aboutCanvas.width;
            this.y = Math.random() * aboutCanvas.height;
            this.bx = this.x; this.by = this.y;
            this.d = (Math.random() * 20) + 2;
            this.s = Math.random() > 0.6;
            this.sz = this.s ? 25 : Math.random() * 3 + 1;
        }
        draw() {
            ctx.fillStyle = 'white';
            if (this.s) { ctx.font = `${this.sz}px serif`; ctx.fillText('❅', this.x, this.y); }
            else { ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI*2); ctx.fill(); }
        }
        update() {
            let dx = mouse.x - this.x, dy = mouse.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let f = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx/dist) * f * this.d;
                this.y -= (dy/dist) * f * this.d;
            } else {
                this.x -= (this.x - this.bx) * 0.1;
                this.y -= (this.y - this.by) * 0.1;
            }
        }
    }

    function init() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particles = [];
        for(let i=0; i<120; i++) particles.push(new Particle());
    }

    function loop() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        animate(currentScroll);

        ctx.clearRect(0,0,aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
        document.body.style.height = smoothContent.offsetHeight + 'px';
        init();
    });

    init();
    setTimeout(() => { document.body.style.height = smoothContent.offsetHeight + 'px'; }, 1000);
    loop();
});
