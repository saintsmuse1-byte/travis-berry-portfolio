document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ELEMENT SELECTIONS ---
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const aboutCanvas = document.getElementById('about-canvas');

    if (!smoothContent || !runnerBoy || !mainContent || !aboutCanvas) return;

    const ctx = aboutCanvas.getContext('2d');

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

    // --- 4. INTERACTIVE ABOUT SNOW LOGIC ---
    let particlesArray = [];
    const mouse = { x: -1000, y: -1000, radius: 170 }; 

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
            this.density = (Math.random() * 20) + 5;
            
            this.isSnowflake = Math.random() > 0.6;
            // BIGGER SNOWFLAKES: Increased size range for '❅'
            this.size = this.isSnowflake ? Math.random() * 15 + 20 : Math.random() * 3 + 1;
            this.rotation = Math.random() * Math.PI * 2;
        }

        draw() {
            ctx.fillStyle = 'white';
            if (this.isSnowflake) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.font = `${this.size}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText('❅', 0, 0);
                ctx.restore();
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
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (Math.abs(this.x - this.baseX) > 0.1) {
                    this.x -= (this.x - this.baseX) / 15;
                }
                if (Math.abs(this.y - this.baseY) > 0.1) {
                    this.y -= (this.y - this.baseY) / 15
