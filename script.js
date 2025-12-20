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

    // 1. HERO SNOW
    if (snowContainer) {
        for (let i = 0; i < 25; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 4 + 6) + 's';
            flake.style.opacity = Math.random() * 0.4 + 0.3;
            snowContainer.appendChild(flake);
        }
    }

    // 2. RUNNER
    function updateRunner() {
        const y = window.scrollY;
        const range = 2200; 
        let progress = Math.min(Math.max(y / range, 0), 1);
        overlay.style.opacity = (progress > 0.02 && progress < 0.85) ? 1 : 0;
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

    // 3. ART SECTION EXPANSION
    function updateArtExpansion() {
        if (!artSectionTrigger || !artExpander) return;
        const rect = artSectionTrigger.getBoundingClientRect();
        const vh = window.innerHeight;
        let entryProgress = 1 - (rect.top / vh);
        entryProgress = Math.min(Math.max(entryProgress, 0), 1);
        const expand = Math.pow(Math.min(entryProgress * 1.2, 1), 2);

        const targetH = vh * 0.85;
        const targetW = targetH * (4/5);

        const curW = (window.innerWidth * 0.3) + ((targetW - (window.innerWidth * 0.3)) * expand);
        const curH = 300 + ((targetH - 300) * expand);

        artExpander.style.width = `${curW}px`;
        artExpander.style.height = `${curH}px`;
    }

    // 4. MANUAL CAROUSEL (Corrected Shuffling)
    let slideIdx = 0;
    function moveSlide(direction) {
        slideIdx += direction;
        if (slideIdx < 0) slideIdx = 2;
        if (slideIdx >= 3) slideIdx = 0;
        // Shift track by 33.333% increments because track is 300% wide
        if (track) track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    }
    if(prevArrow) prevArrow.addEventListener('click', () => moveSlide(-1));
    if(nextArrow) nextArrow.addEventListener('click', () => moveSlide(1));

    // 5. ABOUT PHYSICS
    let particles = [];
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 70; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push({
                x: x, y: y, bx: x, by: y, vx: 0, vy: 0,
                isFlake: Math.random() > 0.75, size: Math.random() * 2 + 2
            });
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
            if (p.isFlake) {
                ctx.font = "30px serif"; ctx.fillText("❅", p.x, p.y);
            } else {
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            }
        });
        requestAnimationFrame(drawPhysics);
    }

    window.addEventListener('scroll', () => { updateRunner(); updateArtExpansion(); });
    window.addEventListener('resize', () => { initCanvas(); updateArtExpansion(); });
    initCanvas(); drawPhysics(); updateRunner(); updateArtExpansion();
});
