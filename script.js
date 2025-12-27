document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC (EXIT SCREEN)
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

        overlay.style.opacity = (progress > 0.01 && progress < 1.3) ? 1 : 0;
        if (progress > 1.4) return;

        const startX = -250;
        const endX = window.innerWidth + 400; // exits fully
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
    // 2. CAROUSEL LOGIC (UNCHANGED)
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
    // 3. SNOW ENGINE (YOUR ORIGINAL, FIXED)
    // ==========================================
    class Utils {
        static random(min, max) { return min + Math.random() * (max - min); }
    }

    class SnowflakeSprite {
        constructor(patternIndex) {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.patternType = patternIndex;
            this.radius = 12;
            const size = this.radius * 2 * (window.devicePixelRatio || 1);

            this.canvas.width = size;
            this.canvas.height = size;

            this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "white";
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth = 1;
            this.drawPattern();
        }

        drawPattern() {
            this.ctx.translate(this.radius, this.radius);
            if (this.patternType === 0) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.radius / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                for (let i = 0; i < 6; i++) {
                    this.ctx.rotate(Math.PI / 3);
                    this.drawBranch();
                }
            }
        }

        drawBranch() {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -this.radius);
            this.ctx.stroke();
        }
    }

    class SnowEngine {
        constructor(containerId, mode) {
            this.container = document.getElementById(containerId);
            this.mode = mode;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            this.sprites = [
                new SnowflakeSprite(0),
                new SnowflakeSprite(1),
                new SnowflakeSprite(2),
                new SnowflakeSprite(3)
            ];

            this.particles = [];
            this.cursor = { x: -1000, y: -1000 };

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
                    vx: 0,
                    vy: Math.random() * 1.5 + 0.5,
                    speedY: Math.random() * 1.5 + 0.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: Utils.random(-0.02, 0.02),
                    radius: Utils.random(3, 8),
                    sprite: this.sprites[Math.floor(Math.random() * 4)].canvas
                });
            }
        }

        handleProfileCollision(p) {
            if (this.mode !== 'falling') return;

            const circle = document.querySelector('.circle-wrapper');
            if (!circle) return;

            const cRect = circle.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();

            const cx = cRect.left + cRect.width / 2 - canvasRect.left;
            const cy = cRect.top + cRect.height / 2 - canvasRect.top;
            const r = cRect.width / 2;

            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.hypot(dx, dy);

            if (dist < r + p.radius) {
                const angle = Math.atan2(dy, dx);
                p.x = cx + Math.cos(angle) * (r + p.radius);
                p.y = cy + Math.sin(angle) * (r + p.radius);

                const tangent = angle + Math.PI / 2;
                p.vx += Math.cos(tangent) * 0.4;
                p.vy += Math.sin(tangent) * 0.4;
            }
        }

        update() {
            const w = this.container.offsetWidth;
            const h = this.container.offsetHeight;

            for (let p of this.particles) {
                if (this.mode === 'falling') {
                    p.y += p.speedY;
                    p.x += p.vx;
                    p.rotation += p.rotationSpeed;
                    p.vx *= 0.96;

                    this.handleProfileCollision(p);

                    if (p.y > h + 20) {
                        p.y = -20;
                        p.x = Math.random() * w;
                    }
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.92;
                    p.vy *= 0.92;
                }
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let p of this.particles) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                this.ctx.drawImage(p.sprite, -p.radius, -p.radius, p.radius * 2, p.radius * 2);
                this.ctx.restore();
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
