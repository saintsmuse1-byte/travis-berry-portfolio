document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC (UNCHANGED)
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
        const endX = window.innerWidth + 400;
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
    // 3. CALM SNOW ENGINE (NO INTERACTION)
    // ==========================================
    class SnowEngine {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            this.particles = [];
            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
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
            const density = 9000; // HIGHER = FEWER FLAKES
