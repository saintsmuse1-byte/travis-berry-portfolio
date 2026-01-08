document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC (Updated to Run Off Screen)
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        // Hero is 200vh tall. 
        const heroSectionHeight = window.innerHeight * 2; 
        
        // Progress: 0 (Top) -> 1 (Bottom of Hero)
        let progress = y / (heroSectionHeight - window.innerHeight);

        // VISIBILITY: 
        // Fade in quickly at start.
        // Stay visible even as we pass 1.0 so he can finish running off screen.
        if (progress > 1.5) { 
             overlay.style.opacity = 0; // Hide only after he is definitely gone
        } else {
             overlay.style.opacity = (progress > 0.01) ? 1 : 0;
        }

        if (progress > 1.5) return; 

        // --- POSITION MATH ---
        // X: Start Left (-200) -> End OFF SCREEN RIGHT
        const startX = -200;
        // CHANGED: Added +200 to width so he runs completely out of frame
        const endX = window.innerWidth + 200; 
        
        // We allow progress to go slightly past 1 so he finishes the run
        const moveProgress = Math.min(progress, 1.1); 
        const bx = startX + (endX - startX) * moveProgress;

        // Y: Start Top (150) -> End Bottom (Screen Height - 250)
        const startY = 150;
        const endY = window.innerHeight - 250;
        
        // Slight hop curve
        const hop = 100 * Math.sin(moveProgress * Math.PI); 
        // We clamp Y progress at 1 so he doesn't keep dropping into the void
        const by = startY + (endY - startY) * Math.min(progress, 1) - hop;

        if (boy) boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        if (feather) feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 720}deg)`;

        // --- FRAME ANIMATION ---
        const fIdx = Math.floor(progress * 25) % frames.length;
        if (frames[fIdx] && fIdx !== lastFrame) {
            frames[lastFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrame = fIdx;
        }
    });


    // ==========================================
    // 2. CAROUSEL LOGIC
    // ==========================================
    const track = document.getElementById('carousel-track');
    let slideIdx = 0;
    const nextBtn = document.getElementById('next-arrow');
    const prevBtn = document.getElementById('prev-arrow');
    
    if (nextBtn && prevBtn && track) {
        nextBtn.onclick = () => {
            slideIdx = (slideIdx + 1) % 6;
            track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
        };
        prevBtn.onclick = () => {
            slideIdx = (slideIdx - 1 + 6) % 6;
            track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
        };
    }


    // ==========================================
    // 3. ADVANCED SNOW ENGINE (LOCKED IN - NO CHANGES)
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
            const dpr = window.devicePixelRatio || 1;
            const size = this.radius * 2 * dpr;
            this.canvas.width = size;
            this.canvas.height = size;
            if (this.ctx) {
                this.ctx.scale(dpr, dpr);
                this.ctx.fillStyle = "white";
                this.ctx.strokeStyle = "white";
                this.ctx.lineCap = "round";
                this.ctx.lineJoin = "round";
                this.ctx.lineWidth = 1;
                this.drawPattern();
            }
        }
        drawPattern() {
            this.ctx.save();
            this.ctx.translate(this.radius, this.radius);
            if (this.patternType === 0) { 
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.radius / 2.5, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                const sectors = 6;
                for (let i = 0; i < sectors; i++) {
                    this.ctx.rotate(Math.PI / 3);
                    if (this.patternType === 1) this.drawBranch();
                    else if (this.patternType === 2) this.drawSpearhead();
                    else this.drawAsterisk();
                }
            }
            this.ctx.restore();
        }
        drawAsterisk() {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, this.radius - 2);
            this.ctx.stroke();
        }
        drawBranch() {
            const r = this.radius - 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -r);
            this.ctx.stroke();
            const spurY = -r * 0.5;
            const spurLen = r * 0.3;
            this.ctx.beginPath();
            this.ctx.moveTo(0, spurY);
            this.ctx.lineTo(-spurLen, spurY - spurLen);
            this.ctx.moveTo(0, spurY);
            this.ctx.lineTo(spurLen, spurY - spurLen);
            this.ctx.stroke();
        }
        drawSpearhead() {
            const r = this.radius - 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -r * 0.5); 
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, -r); 
            this.ctx.lineTo(-r*0.25, -r*0.6);
            this.ctx.lineTo(0, -r*0.5); 
            this.ctx.lineTo(r*0.25, -r*0.6);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    class SnowEngine {
        constructor(containerId, mode) {
            this.container = document.getElementById(containerId);
            this.mode = mode; 
            if (!this.container) return;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            this.sprites = [
                new SnowflakeSprite(0), new SnowflakeSprite(1), 
                new SnowflakeSprite(2), new SnowflakeSprite(3)
            ];
            this.particles = [];
            this.cursor = { x: -1000, y: -1000 };
            this.init();
        }
        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => {
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
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.ctx.scale(dpr, dpr);
            this.createParticles();
        }
        createParticles() {
            const density = this.mode === 'falling' ? 5000 : 12000;
            const area = this.container.offsetWidth * this.container.offsetHeight;
            const count = Math.floor(area / density);
            this.particles = [];
            for (let i = 0; i < count; i++) {
                const patternIdx = Math.floor(Math.random() * 4);
                this.particles.push({
                    x: Math.random() * this.container.offsetWidth,
                    y: Math.random() * this.container.offsetHeight,
                    vx: 0, vy: 0,
                    speedY: Math.random() * 1.5 + 0.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: Utils.random(-0.02, 0.02),
                    radius: this.mode === 'falling' ? Utils.random(4, 9) : Utils.random(10, 18),
                    sprite: this.sprites[patternIdx].canvas
                });
            }
        }
        update() {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            for (let p of this.particles) {
                if (this.mode === 'falling') {
                    p.y += p.speedY;
                    p.rotation += p.rotationSpeed;
                    const dx = p.x - this.cursor.x;
                    const dy = p.y - this.cursor.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        p.x += (dx / dist) * force * 2;
                    }
                    if (p.y > height + 20) {
                        p.y = -20;
                        p.x = Math.random() * width;
                    }
                } else {
                    p.x += p.vx; p.y += p.vy;
                    p.rotation += p.vx * 0.01; 
                    p.vx *= 0.94; p.vy *= 0.94;
                    const dx = p.x - this.cursor.x;
                    const dy = p.y - this.cursor.y;
                    const dist = Math.hypot(dx, dy);
                    const range = 250; 
                    if (dist < range) {
                        const force = (range - dist) / range;
                        const angle = Math.atan2(dy, dx);
                        const strength = 3; 
                        p.vx += Math.cos(angle) * strength;
                        p.vy += Math.sin(angle) * strength;
                    }
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                }
            }
        }
        draw() {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            this.ctx.clearRect(0, 0, width, height);
            for (let p of this.particles) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                const size = p.radius * 2;
                this.ctx.drawImage(p.sprite, -p.radius, -p.radius, size, size);
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
