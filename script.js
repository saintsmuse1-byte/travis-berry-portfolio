document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ELEMENT SELECTIONS ---
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const aboutCanvas = document.getElementById('about-canvas');
    const ctx = aboutCanvas.getContext('2d');

    if (!smoothContent || !runnerBoy || !mainContent) return;

    // --- 2. SMOOTH SCROLL VARIABLES ---
    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; 

    // --- 3. RUNNER SETTINGS ---
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const BOY_WIDTH = 350; 
    let currentFrameIndex = -1;

    // --- 4. INTERACTIVE SNOW SETTINGS (ABOUT SECTION) ---
    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        const rect = aboutCanvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    class SnowflakeParticle {
        constructor() {
            this.x = Math.random() * aboutCanvas.width;
            this.y = Math.random() * aboutCanvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            
            // Randomly decide if this is a dot (60%) or a snowflake (40%)
            this.isSnowflake = Math.random() > 0.6;
            
            // Size adjustment: Text snowflakes need to be a bit bigger to be seen
            this.size = this.isSnowflake ? Math.random() * 10 + 10 : Math.random() * 3 + 1;
        }

        draw() {
            ctx.fillStyle = 'white';
            if (this.isSnowflake) {
                // Draw the snowflake character
                ctx.font = `${this.size}px serif`;
                ctx.fillText('❅', this.x, this.y);
            } else {
                // Draw the clean dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    this.x -= (this.x - this.baseX) / 10;
                }
                if (this.y !== this.baseY) {
                    this.y -= (this.y - this.baseY) / 10;
                }
            }
        }
    }

    function initAboutSnow() {
        aboutCanvas.width = aboutCanvas.offsetWidth;
        aboutCanvas.height = aboutCanvas.offsetHeight;
        particlesArray = [];
        // Increased count slightly to make the mix feel fuller
        for (let i = 0; i < 180; i++) {
            particlesArray.push(new SnowflakeParticle());
        }
    }

    // --- 5. LOGIC FUNCTIONS ---
    function updatePageHeight() {
        const totalHeight = smoothContent.getBoundingClientRect().height;
        document.body.style.height = Math.floor(totalHeight) + "px";
    }

    function animateRunner(scrollY) {
        const startPoint = mainContent.offsetTop + 100; 
        const animationRange = 900; 
        const endPoint = startPoint + animationRange;

        if (scrollY >= startPoint && scrollY <= endPoint) {
            const progress = (scrollY - startPoint) / animationRange;
            const xTravel = (window.innerWidth - BOY_WIDTH) * progress;
            const startY = window.innerHeight * 0.30; 
            const endY = window.innerHeight * 0.50;   
            const yTravel = startY + (endY - startY) * progress;
            runnerBoy.style.transform = `translate(${xTravel}px, ${yTravel}px)`;
            
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            if (frameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
                currentFrameIndex = frameIndex
