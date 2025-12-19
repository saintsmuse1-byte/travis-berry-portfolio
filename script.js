document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-frames-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const track = document.getElementById('carousel-track');
    const canvas = document.getElementById('about-canvas');
    const ctx = canvas.getContext('2d');

    let currentFrame = 0;

    // 1. RUNNER ANIMATION
    function animate() {
        const y = window.scrollY;
        const progress = Math.min(Math.max(y / 2000, 0), 1);
        
        overlay.style.opacity = (progress > 0.05 && progress < 0.95) ? 1 : 0;

        // Scoop Path
        const bx = -300 + (window.innerWidth + 600) * progress;
        const by = 400 + (700 * Math.pow(progress, 2)) - (600 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // Feather Path (Faster)
        const fx = bx + 250 + (progress * 700);
        const fy = by - 100 + Math.sin(progress * 20) * 80;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${y * 2}deg)`;

        // Frame Toggling (No Flicker)
        const fIdx = Math.floor(progress * 40) % frames.length;
        if (fIdx !== currentFrame) {
            frames[currentFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            currentFrame = fIdx;
        }
        requestAnimationFrame(animate);
    }

    // 2. ART CAROUSEL
    let slideIdx = 0;
    setInterval(() => {
        slideIdx = (slideIdx + 1) % 3;
        track.style.transform = `translateX(-${slideIdx * 33.33}%)`;
    }, 4000);

    // 3. BIG SNOWFLAKES CANVAS
    let particles = [];
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 40 + 20, // BIG snowflakes
            speed: Math.random() * 2 + 1
        }));
    }

    function drawSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px serif";
        particles.forEach(p => {
            ctx.fillText("❅", p.x, p.y);
            p.y += p.speed;
            if (p.y > canvas.height) p.y = -50;
        });
        requestAnimationFrame(drawSnow);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    drawSnow();
    animate();
});
