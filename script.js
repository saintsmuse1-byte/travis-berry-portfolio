document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    
    const artSection = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    
    const snowContainer = document.getElementById('falling-snow-container');
    const canvas = document.getElementById('about-canvas');
    const ctx = canvas.getContext('2d');

    const mouse = { x: -1000, y: -1000, radius: 180 };
    let lastFrameIdx = 0; // Tracks runner frame

    // =========================================
    // 1. HERO SNOW (Restored)
    // =========================================
    if (snowContainer) {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 4 + 5) + 's';
            flake.style.opacity = Math.random() * 0.5 + 0.3;
            snowContainer.appendChild(flake);
        }
    }

    // =========================================
    // 2. RUNNER & FEATHER (Restored)
    // =========================================
    function updateRunner() {
        const y = window.scrollY;
        // Animation happens over top 2200px of scroll
        const range = 2200; 
        let progress = Math.min(Math.max(y / range, 0), 1);

        // Opacity check
        if (progress > 0.02 && progress < 0.85) {
            overlay.style.opacity = 1;
        } else {
            overlay.style.opacity = 0;
        }

        // Boy Movement
        const bx = -400 + (window.innerWidth + 800) * progress;
        const by = 450 + (650 * Math.pow(progress, 2)) - (550 * progress);
        boyContainer.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // Feather Movement
        const fx = bx + 300 + (progress * 850);
        const fy = by - 140 + (Math.sin(progress * 15) * 100);
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${y * 1.5}deg)`;

        // Frame Swapping
        const fIdx = Math.floor(progress * 45) % frames.length;
        if (fIdx !== lastFrameIdx) {
            frames[lastFrameIdx].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrameIdx = fIdx;
        }
    }

    // =========================================
    // 3. ART EXPANSION (Timq Style: White Box Grows)
    // =========================================
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Calculate 0 to 1 progress based on section entering viewport
        let progress = 1 - (rect.top / vh);
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Easing for smoother growth
        const ease = Math.pow(progress, 1.2);

        // Target: 85% of viewport height, 4:5 aspect ratio
        const targetH = vh * 0.85;
        const targetW = targetH * 0.8; // 4:5 ratio

        // Interpolate Dimensions
        const startW = 300; 
        const startH = 300;
        
        const currentW = startW + (targetW - startW) * ease;
        const currentH = startH + (targetH - startH) * ease;

        artExpander.style.width = `${currentW}px`;
        artExpander.style.height = `${currentH}px`;
        
        // Optional: Add a slight "rise" translate effect
        // It moves up slightly as it grows to look like it's lifting off
        // artExpander.style.transform = `translateY(${(1-ease) * 50}px)`;
    }

    // =========================================
    // 4. CAROUSEL LOGIC
    // =========================================
    let slideIdx = 0;
    function moveSlide(dir) {
        slideIdx = (slideIdx + dir + 3) % 3; // +3 ensures no negative modulo
        if (track) track.style.transform = `translateX(-${slideIdx * 33.3333}%)`;
    }
    if (prevArrow) prevArrow.addEventListener('click', () => moveSlide(-1));
    if (nextArrow) nextArrow.addEventListener('click', () => moveSlide(1));

    // =========================================
    // 5. ABOUT PHYSICS SNOW (Restored)
    // =========================================
    let particles = [];
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 60; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push({
                x: x, y: y, bx: x, by: y, vx: 0, vy: 0,
                isFlake: Math.random() > 0.6, // Mix of flakes and dots
                size: Math.random() * 2 + 2
            });
        }
    }

    window.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    function drawPhysics() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            // Mouse Repulsion
            let dx = mouse.x - p.x; 
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 5;
                p.vy -= (dy / dist) * force * 5;
            }

            // Return to home position (elasticity)
            p.vx += (p.bx - p.x) * 0.05;
            p.vy += (p.by - p.y) * 0.05;
            
            // Friction
            p.vx *= 0.9; 
            p.vy *= 0.9;
            
            p.x += p.vx; 
            p.y += p.vy;

            ctx.fillStyle = "white";
            if (p.isFlake) {
                ctx.font = "24px serif"; 
                ctx.fillText("❅", p.x, p.y);
            } else {
                ctx.beginPath(); 
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
                ctx.fill();
            }
        });
        requestAnimationFrame(drawPhysics);
    }

    // =========================================
    // MAIN LISTENERS
    // =========================================
    window.addEventListener('scroll', () => {
        updateRunner();
        updateExpansion();
    });
    window.addEventListener('resize', () => {
        initCanvas();
        updateExpansion();
    });

    // Start everything
    initCanvas();
    drawPhysics();
    updateRunner();
    updateExpansion();
});
