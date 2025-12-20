document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    const artSectionTrigger = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    const snowContainer = document.getElementById('falling-snow-container');
    const canvas = document.getElementById('about-canvas');
    const ctx = canvas.getContext('2d');

    const mouse = { x: -1000, y: -1000, radius: 180 };
    let lastFrameIdx = 0;

    // 1. SNOW
    if (snowContainer) {
        for (let i = 0; i < 20; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 4 + 6) + 's';
            flake.style.opacity = Math.random() * 0.4;
            snowContainer.appendChild(flake);
        }
    }

    // 2. RUNNER
    function updateRunner() {
        const y = window.scrollY;
        const range = 2200; 
        let progress = Math.min(Math.max(y / range, 0), 1);
        overlay.style.opacity = (progress > 0.02 && progress < 0.8) ? 1 : 0;
        const bx = -400 + (window.innerWidth + 800) * progress;
        const by = 450 + (650 * Math.pow(progress, 2)) - (550 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        const fx = bx + 300 + (progress * 850);
        const fy = by - 140 + (Math.sin(progress * 15) * 100);
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${y * 1.5}deg)`;
        const fIdx = Math.floor(progress * 45) % frames.length;
        if (fIdx !== lastFrameIdx) {
            frames[lastFrameIdx].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrameIdx = fIdx;
        }
    }

    // 3. EXPANSION Logic
    function updateArtExpansion() {
        if (!artSectionTrigger || !artExpander) return;
        const rect = artSectionTrigger.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Expansion starts as soon as top of section hits bottom of screen
        let entry = 1 - (rect.top / vh);
        entry = Math.min(Math.max(entry, 0), 1);
        const expand = Math.pow(entry, 1.5);

        // Targeted 4:5 ratio expansion
        const targetH = vh * 0.75;
        const targetW = targetH * (4/5);

        const curW = (window.innerWidth * 0.25) + ((targetW - (window.innerWidth * 0.25)) * expand);
        const curH = 350 + ((targetH - 350) * expand);

        artExpander.style.width = `${curW}px`;
        artExpander.style.height = `${curH}px`;
    }

    // 4. CAROUSEL
    let slideIdx = 0;
    function moveSlide(dir) {
        slideIdx = (slideIdx + dir + 3) % 3;
        if (track) track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    }
    prevArrow?.addEventListener('click', () => moveSlide(-1));
    nextArrow?.addEventListener('click', () => moveSlide(1));

    // 5. PHYSICS
    let particles = [];
    function initCanvas() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 70; i++) {
            let x = Math.random() * canvas.width; let y = Math.random() * canvas.height;
            particles.push({ x, y, bx: x, by: y, vx: 0, vy: 0, isFlake: Math.random() > 0.75, size: Math.random() * 2 + 2 });
        }
    }
    window.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    function drawPhysics() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x; let dy = mouse.y - p.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < mouse.radius) {
                let f = (mouse.radius - d) / mouse.radius;
                p.vx -= (dx / d) * f * 10; p.vy -= (dy / d) * f * 10;
            }
            p.vx += (p.bx - p.x) * 0.04; p.vy += (p.by - p.y) * 0.04;
            p.vx *= 0.9; p.vy *= 0.9; p.x += p.vx; p.y += p.vy;
            ctx.fillStyle = "white";
            if (p.isFlake) { ctx.font = "30px serif"; ctx.fillText("❅", p.x, p.y); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
        });
        requestAnimationFrame(drawPhysics);
    }

    window.addEventListener('scroll', () => { updateRunner(); updateArtExpansion(); });
    window.addEventListener('resize', () => { initCanvas(); updateArtExpansion(); });
    initCanvas(); drawPhysics(); updateRunner(); updateArtExpansion();
});
