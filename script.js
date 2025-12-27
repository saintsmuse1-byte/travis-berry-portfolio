document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. RUNNER BOY LOGIC (FIXED MATH)
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const heroHeight = window.innerHeight; // The height of the hero section
        
        // Progress: 0 (top) to 1 (bottom of hero)
        let progress = y / heroHeight;

        // Limit progress: if we scroll past hero, cap it at 1 (or slightly more to fade out)
        if (progress > 1.1) {
            overlay.style.opacity = 0;
            return;
        } else {
            // Fade in quickly, stay visible until the end
            overlay.style.opacity = (progress > 0.05) ? 1 : 0;
        }

        // --- POSITION MATH ---
        // X: Start at -200px (left), End at Window Width - 300px (right)
        const startX = -200;
        const endX = window.innerWidth - 350; // 350px buffer from right edge
        const bx = startX + (endX - startX) * Math.min(progress, 1);

        // Y: Start at 200px, End at Bottom of Screen (minus boy height)
        const startY = 200;
        const endY = window.innerHeight - 300; // Lands near bottom
        // Add a slight curve (parabola) for visual flair
        const curve = 100 * Math.sin(progress * Math.PI); 
        const by = startY + (endY - startY) * Math.min(progress, 1) - curve;

        boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        
        // Feather follows slightly behind
        if(feather) {
            feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 360}deg)`;
        }

        // --- FRAME ANIMATION ---
        const fIdx = Math.floor(progress * 20) % frames.length; // Speed of animation
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
    const totalSlides = 6;

    if (nextBtn && prevBtn && track) {
        nextBtn.onclick = () => {
            slideIdx = (slideIdx + 1) % totalSlides;
            track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
        };
        prevBtn.onclick = () => {
            slideIdx = (slideIdx - 1 + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${slideIdx * 16.666}%)`;
        };
    }


    // ==========================================
    // 3. PURE JS INTERACTIVE SNOW (HERO & ABOUT)
    // ==========================================
    class SnowEffect {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            
            this.snowflakes = [];
            this.cursor = { x: null, y: null, radius: 100 }; // Interaction radius
            
            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => {
                this.cursor.x = e.clientX;
                this.cursor.y = e.clientY;
            });
            this.loop();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createSnowflakes();
        }

        createSnowflakes() {
            const count = Math.floor(window.innerWidth * window.innerHeight / 10000); // Density
            this.snowflakes = [];
            for (let i = 0; i < count; i++) {
                this.snowflakes.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: Math.random() * 1 - 0.5,
                    speedY: Math.random() * 1 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3
                });
            }
        }

        update() {
            for (let flake of this.snowflakes) {
                // Gravity
                flake.y += flake.speedY;
                flake.x += flake.speedX;

                // Mouse Interaction (The "Cool" Effect)
                if (this.cursor.x != null) {
                    const dx = flake.x - this.cursor.x;
                    const dy = flake.y - this.cursor.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);

                    if (distance < this.cursor.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (this.cursor.radius - distance) / this.cursor.radius;
                        
                        // Push flake away
                        flake.x += forceDirectionX * force * 5; 
                        flake.y += forceDirectionY * force * 5;
                    }
                }

                // Reset if off screen
                if (flake.y > this.canvas.height) {
                    flake.y = 0;
                    flake.x = Math.random() * this.canvas.width;
                }
                if (flake.x > this.canvas.width) flake.x = 0;
                if (flake.x < 0) flake.x = this.canvas.width;
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            
            for (let flake of this.snowflakes) {
                this.ctx.globalAlpha = flake.opacity;
                this.ctx.beginPath();
                this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        loop() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }

    // Initialize the snow in both locations
    new SnowEffect('hero-snow');
    new SnowEffect('about-snow');
});
