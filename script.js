document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. RUNNER BOY LOGIC (Updated for Long Hero)
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        // The hero section is now taller (approx 1.5 * windowHeight)
        // We want the animation to finish exactly when we scroll past it.
        const heroHeight = window.innerHeight * 1.5; 
        
        let progress = y / (heroHeight - window.innerHeight); 

        // Clamp progress
        if (progress < 0) progress = 0;
        
        // Hide boy if we are past the hero section
        if (y > heroHeight - 100) {
            overlay.style.opacity = 0;
        } else {
            // Fade in
            overlay.style.opacity = (progress > 0.02) ? 1 : 0;
        }

        if (progress > 1.2) return; // Stop calculating if way off screen

        // --- POSITION MATH ---
        // X: Start Left (-200) -> End Right (Screen Width - 300)
        const startX = -200;
        const endX = window.innerWidth - 300;
        const bx = startX + (endX - startX) * Math.min(progress, 1);

        // Y: Start Top (100) -> End Bottom (Screen Height - 250)
        const startY = 100;
        const endY = window.innerHeight - 250;
        
        // Add a parabola curve so he hops slightly
        const jumpCurve = 150 * Math.sin(progress * Math.PI);
        const by = startY + (endY - startY) * Math.min(progress, 1) - jumpCurve;

        if (boy) boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        if (feather) feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 720}deg)`;

        // --- FRAME ANIMATION ---
        // Slower frame rate to stop glitching (progress * 15 instead of 30)
        const fIdx = Math.floor(progress * 15) % frames.length;
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
    // 3. ADVANCED SNOW ENGINE (Two Modes)
    // ==========================================
    class SnowEngine {
        constructor(containerId, mode) {
            this.container = document.getElementById(containerId);
            this.mode = mode; // 'falling' or 'repel'
            if (!this.container) return;

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            
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
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            this.createParticles();
        }

        createParticles() {
            // Thicker snow for Hero ('falling'), fewer for About ('repel')
            const density = this.mode === 'falling' ? 6000 : 15000; 
            const count = Math.floor((this.canvas.width * this.canvas.height) / density);
            
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    // Repel mode particles have velocity (vx, vy)
                    vx: 0,
                    vy: 0,
                    // Falling mode particles have constant speed
                    speedY: Math.random() * 2 + 1,
                    radius: Math.random() * 2 + 1, // Size
                    angle: Math.random() * Math.PI * 2 // For spinning snowflakes
                });
            }
        }

        update() {
            for (let p of this.particles) {
                
                // --- MODE 1: FALLING SNOW (HERO) ---
                if (this.mode === 'falling') {
                    p.y += p.speedY;
                    p.angle += 0.02; // Spin

                    if (p.y > this.canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * this.canvas.width;
                    }
                } 
                
                // --- MODE 2: REPEL MAGNETIC SNOW (ABOUT) ---
                else if (this.mode === 'repel') {
                    // Physics friction (slow down over time)
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.95; 
                    p.vy *= 0.95;

                    // Mouse Interaction
                    const dx = p.x - this.cursor.x;
                    const dy = p.y - this.cursor.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const repelRange = 150; 

                    if (dist < repelRange) {
                        const force = (repelRange - dist) / repelRange;
                        const angle = Math.atan2(dy, dx);
                        const pushStrength = 2; // How hard it pushes

                        p.vx += Math.cos(angle) * force * pushStrength;
                        p.vy += Math.sin(angle) * force * pushStrength;
                    }
                }
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1.5;

            for (let p of this.particles) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);

                if (this.mode === 'falling') {
                    // DRAW ACTUAL SNOWFLAKE SHAPE (*)
                    this.ctx.rotate(p.angle);
                    this.ctx.beginPath();
                    // Three lines crossing to make a star/snowflake
                    for(let i=0; i<3; i++) {
                        this.ctx.rotate(Math.PI / 3);
                        this.ctx.moveTo(-p.radius * 2, 0);
                        this.ctx.lineTo(p.radius * 2, 0);
                    }
                    this.ctx.stroke();
                } else {
                    // DRAW DOTS (For About Section)
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
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
    // Hero: Falling, Real Snowflake Shapes
    new SnowEngine('hero-snow', 'falling');
    
    // About: Repel, Dots
    new SnowEngine('about-snow', 'repel');
});
