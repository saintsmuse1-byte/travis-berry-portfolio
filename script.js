document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC (ALLOW EXIT)
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const heroSectionHeight = window.innerHeight * 2; 
        let progress = y / (heroSectionHeight - window.innerHeight);

        if (y > heroSectionHeight - 50) {
            overlay.style.opacity = 0;
        } else {
            overlay.style.opacity = (progress > 0.01) ? 1 : 0;
        }

        if (progress > 1.4) return;

        const startX = -250;
        const endX = window.innerWidth + 400; // 👈 exits screen fully
        const startY = 150;
        const endY = window.innerHeight - 250;

        const bx = startX + (endX - startX) * progress;
        const by = startY + (endY - startY) * progress - (100 * Math.sin(progress * Math.PI));

        boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 720}deg)`;

        const fIdx = Math.floor(progress * 20) % frames.length;
        if (frames[fIdx] && fIdx !== lastFrame) {
            frames[lastFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrame = fIdx;
        }
    });

    // ==========================================
    // 2. CAROUSEL (UNCHANGED)
    // ==========================================
    const track = document.getElementById('carousel-track');
    let slideIdx = 0;
    document.getElementById('next-arrow').onclick = () => {
        slideIdx = (slideIdx + 1) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
    };
    document.getElementById('prev-arrow').onclick = () => {
        slideIdx = (slideIdx - 1 + 6) % 6;
        track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
    };

    // ==========================================
    // 3. SNOW ENGINE WITH CIRCULAR COLLISION
    // ==========================================
    class Utils {
        static random(min, max) { return min + Math.random() * (max - min); }
    }

    class SnowEngine {
        constructor(containerId, mode) {
            this.container = document.getElementById(containerId);
            this.mode = mode;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            this.particles = [];
            this.cursor = { x: -9999, y: -9999 };

            // 👇 Profile circle reference
            this.circleEl = document.getElementById('profile-circle');

            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', e => {
                const rect = this.canvas.getBoundingClientRect();
                this.cursor.x = e.clientX - rect.left;
                this.cursor.y = e.clientY - rect.top;
            });
            this.loop();
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = this.container.offsetWidth * dpr;
            this.canvas.height = this.container.offsetHeight * dpr;
            this.canvas.style.width = this.container.offsetWidth + "px";
            this.canvas.style.height = this.container.offsetHeight + "px";
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.createParticles();
        }

        createParticles() {
            const density = this.mode === 'falling' ? 4000 : 12000;
            const count = (this.container.offsetWidth * this.container.offsetHeight) / density;
            this.particles = [];

            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.container.offsetWidth,
                    y: Math.random() * this.container.offsetHeight,
                    vy: Math.random() * 1.5 + 0.5,
                    vx: 0,
                    r: Utils.random(3, 8),
                    rot: Math.random() * Math.PI * 2
                });
            }
        }

        handleCircleCollision(p) {
            if (!this.circleEl) return;

            const rect = this.circleEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - this.canvas.getBoundingClientRect().left;
            const cy = rect.top + rect.height / 2 - this.canvas.getBoundingClientRect().top;
            const radius = rect.width / 2;

            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.hypot(dx, dy);

            if (dist < radius + p.r) {
                const angle = Math.atan2(dy, dx);
                const edgeX = cx + Math.cos(angle) * (radius + p.r);
                const edgeY = cy + Math.sin(angle) * (radius + p.r);

                p.x = edgeX;
                p.y = edgeY;

                // Tangential slide
                const tangent = angle + Math.PI / 2;
                p.vx += Math.cos(tangent) * 0.6;
                p.vy += Math.sin(tangent) * 0.6;
            }
        }

        update() {
            for (let p of this.particles) {
                p.y += p.vy;
                p.x += p.vx;
                p.vx *= 0.96;

                this.handleCircleCollision(p);

                if (p.y > this.container.offsetHeight + 20) {
                    p.y = -20;
                    p.x = Math.random() * this.container.offsetWidth;
                }
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let p of this.particles) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.fillStyle = "white";
                this.ctx.fill();
            }
        }

        loop() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }

    new SnowEngine('hero-snow', 'falling');
    new SnowEngine('about-snow', 'repel');
});
