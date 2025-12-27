document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        // Hero is 200vh tall. We want the animation to complete by the time we leave it.
        const heroSectionHeight = window.innerHeight * 2; 
        
        // Progress: 0 to 1 based on scrolling through the hero section
        let progress = y / (heroSectionHeight - window.innerHeight);

        // Visibility
        if (y > heroSectionHeight - 50) {
            overlay.style.opacity = 0;
        } else {
            overlay.style.opacity = (progress > 0.01) ? 1 : 0;
        }

        if (progress > 1.2) return; // Optimization

        // Movement Math
        const startX = -200;
        const endX = window.innerWidth - 300;
        const startY = 150;
        const endY = window.innerHeight - 250;
        
        const bx = startX + (endX - startX) * Math.min(progress, 1);
        // Slight hop/curve
        const by = startY + (endY - startY) * Math.min(progress, 1) - (100 * Math.sin(progress * Math.PI));

        if (boy) boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        if (feather) feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 720}deg)`;

        // Frame Animation
        const fIdx = Math.floor(progress * 20) % frames.length;
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
    // 3. ADVANCED SNOW ENGINE (Ported from TypeScript)
    // ==========================================
    
    // --- HELPER CLASSES ---
    class Utils {
        static random(min, max) { return min + Math.random() * (max - min); }
    }

    // This class draws the specific shapes (Dot, Branch, Spearhead, Asterisk)
    // onto a small hidden canvas to be used as a stamp.
    class SnowflakeSprite {
        constructor(patternIndex) {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.patternType = patternIndex;
            this.radius = 12; // Base size of the drawing
            const size = this.radius * 2 * (window.devicePixelRatio || 1);
            
            this.canvas.width = size;
            this.canvas.height = size;
            
            if (this.ctx) {
                this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
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

            if (this.patternType === 0) { // Dot
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.radius / 2, 0, Math.PI * 2);
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
            
            // Spurs
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
            this.ctx.lineTo(0, -r * 0.5); // shaft
            
            this.ctx.moveTo(0, -r); // tip
            this.ctx.lineTo(-r*0.25, -r*0.6);
            this.ctx.lineTo(0, -r*0.5); // notch
            this.ctx.lineTo(r*0.25, -r*0.6);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    // Main Engine
    class SnowEngine {
        constructor(containerId, mode) {
            this.container = document.getElementById(containerId);
            this.mode = mode; // 'falling' (Hero) or 'repel' (About)
            if (!this.container) return;

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            
            // Pre-render the 4 sprite types
            this.sprites = [
                new SnowflakeSprite(0), // Dot
                new SnowflakeSprite(1), // Branch
                new SnowflakeSprite(2), // Spearhead
                new SnowflakeSprite(3)  // Asterisk
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
            this.canvas.style.width = this.container.offsetWidth + "px";
            this.canvas.style.height = this.container.offsetHeight + "px";
            this.ctx.scale(dpr, dpr);
            
            this.createParticles();
        }

        createParticles() {
            // Hero gets many particles, About gets fewer but bigger ones
            const density = this.mode === 'falling' ? 4000 : 12000;
            const count = Math.floor((this.container.offsetWidth * this.container.offsetHeight) / density);
            
            this.particles = [];
            for (let i = 0; i < count; i++) {
                const patternIdx = Math.floor(Math.random() * 4);
                
                this.particles.push({
                    x: Math.random() * this.container.offsetWidth,
                    y: Math.random() * this.container.offsetHeight,
                    vx: 0,
                    vy: 0,
                    speedY: Math.random() * 1.5 + 0.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: Utils.random(-0.02, 0.02),
                    radius: this.mode === 'falling' ? Utils.random(3, 8) : Utils.random(8, 15), // Bigger in About
                    sprite: this.sprites[patternIdx].canvas
                });
            }
        }

        update() {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;

            for (let p of this.particles) {
                
                // --- MODE 1: FALLING (Hero) ---
                if (this.mode === 'falling') {
                    p.y += p.speedY;
                    p.rotation += p.rotationSpeed;

                    // Mouse Interaction (Push gently)
                    const dx = p.x - this.cursor.x;
                    const dy = p.y - this.cursor.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        p.x += (dx / dist) * force * 5;
                        p.y += (dy / dist) * force * 5;
                    }

                    // Reset Loop
                    if (p.y > height + 20) {
                        p.y = -20;
                        p.x = Math.random() * width;
                    }
                } 
                
                // --- MODE 2: REPEL (About) ---
                else {
                    // Physics
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rotation += p.vx * 0.01; // Spin based on movement

                    p.vx *= 0.92; // Friction
                    p.vy *= 0.92;

                    // Repel Logic
                    const dx = p.x - this.cursor.x;
                    const dy = p.y - this.cursor.y;
                    const dist = Math.hypot(dx, dy);
                    const range = 200;

                    if (dist < range) {
                        const force = (range - dist) / range;
                        const angle = Math.atan2(dy, dx);
                        const strength = 4;
                        
                        p.vx += Math.cos(angle) * strength;
                        p.vy += Math.sin(angle) * strength;
                    }

                    // Boundaries (Bounce off walls)
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
                
                // Draw the cached sprite
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

    // INITIALIZE
    // Hero: Falling, Standard Size
    new SnowEngine('hero-snow', 'falling');
    
    // About: Repel, Big Size
    new SnowEngine('about-snow', 'repel');
});
