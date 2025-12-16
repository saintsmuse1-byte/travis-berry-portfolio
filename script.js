document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const circleWrapper = document.querySelector('.circle-wrapper');
    const artSection = document.querySelector('.art-section');
    const aboutCanvas = document.getElementById('about-canvas');

    if (!smoothContent || !runnerBoy || !aboutCanvas) return;
    const ctx = aboutCanvas.getContext('2d');

    // --- SETTINGS ---
    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; 
    const BOY_WIDTH = 350; 
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];

    // --- ABOUT SECTION SNOW LOGIC ---
    let particlesArray = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        const rect = aboutCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * aboutCanvas.width;
            this.y = Math.random() * aboutCanvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 20) + 2;
            this.isSnow = Math.random() > 0.6;
            this.size = this.isSnow ? 25 : Math.random() * 3 + 1; // Big snowflakes
        }
        draw() {
            ctx.fillStyle = 'white';
            if (this.isSnow) {
                ctx.font = `${this.size}px serif`;
                ctx.fillText('❅', this.x, this.y);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                this.x -= (dx / distance) * force * this.density;
                this.y -= (dy / distance) * force * this.density;
            } else {
                this.x -= (this.x - this.baseX) * 0.1;
                this.y -= (this.y - this.baseY) * 0.1;
            }
        }
    }

    function initAboutSnow() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particlesArray = [];
        for (let i = 0; i < 120; i++) particlesArray.push(new Particle());
    }

    // --- RUNNER POSITIONING ---
    function animateRunner(scrollY) {
        // 1. Calculate the Y position of your Profile Pic
        const circleRect = circleWrapper.getBoundingClientRect();
        const startPoint = 100; // When to start the run (scrolled 100px)
        const animationRange = 800; // How long the run lasts
        
        if (scrollY >= startPoint && scrollY <= (startPoint + animationRange)) {
            const progress = (scrollY - startPoint) / animationRange;
            
            // HORIZONTAL: Side to side
            const xTravel = (window.innerWidth - BOY_WIDTH) * progress;
            
            // VERTICAL: This places him exactly a "finger width" (approx 40px) below the circle
            // We use the smoothed scroll to keep him steady
            const yBase = (circleWrapper.offsetTop + circleWrapper.offsetHeight) - scrollY;
            const yOffset = 40; // <--- ADJUST THIS to change "finger size" gap
            
            runnerBoy.style.transform = `translate(${xTravel}px, ${yBase + yOffset}px)`;
            
            // Frame switching
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            runnerBoy.src = RUNNER_FRAMES[frameIndex];
            
            runnerContainer.style.opacity = '1';
        } else {
            runnerContainer.style.opacity = '0';
        }
    }

    // --- MAIN ENGINE ---
    function render() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING_FACTOR;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        animateRunner(currentScroll);

        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(render);
    }

    function updateHeight() {
        document.body.style.height = smoothContent.getBoundingClientRect().height + "px";
    }

    // Initialize everything
    initAboutSnow();
    updateHeight();
    window.addEventListener('resize', () => { updateHeight(); initAboutSnow(); });
    window.addEventListener('load', updateHeight);
    setTimeout(updateHeight, 1500);
    render();
});
