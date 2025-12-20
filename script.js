document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const feather = document.getElementById('feather');
    const frames = document.querySelectorAll('.boy-frame');
    
    // Art Section Elements
    const artSectionTrigger = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    
    // About Section Elements
    const snowContainer = document.getElementById('falling-snow-container');
    const canvas = document.getElementById('about-canvas');
    const ctx = canvas.getContext('2d');

    const mouse = { x: -1000, y: -1000, radius: 180 };
    let lastFrameIdx = 0;


    // =========================================
    // 1. HERO SNOW GENERATOR
    // =========================================
    if (snowContainer) {
        for (let i = 0; i < 25; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 4 + 6) + 's';
            flake.style.opacity = Math.random() * 0.6 + 0.4;
            snowContainer.appendChild(flake);
        }
    }


    // =========================================
    // 2. RUNNER & FEATHER ANIMATION
    // =========================================
    function updateRunner() {
        const y = window.scrollY;
        // How long the runner animation lasts in scroll pixels
        const range = 2200; 
        let progress = Math.min(Math.max(y / range, 0), 1);

        // Fade out faster at end so it doesn't overlap art expansion too much
        overlay.style.opacity = (progress > 0.02 && progress < 0.85) ? 1 : 0;

        const bx = -400 + (window.innerWidth + 800) * progress;
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
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


    // =========================================
    // 3. ART SECTION: SCROLL EXPANSION EFFECT
    // =========================================
    function updateArtExpansion() {
        if (!artSectionTrigger || !artExpander) return;

        const rect = artSectionTrigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate entry progress: 0 when section top enters bottom of screen, 1 when it reaches top
        let entryProgress = 1 - (rect.top / viewportHeight);
        entryProgress = Math.min(Math.max(entryProgress, 0), 1);
        
        // We want the expansion to finish slightly before it hits the exact center
        // Smooth the progress curve for a better feel
        const expansionProgress = Math.pow(Math.min(entryProgress * 1.3, 1), 2);

        // --- CALCULATE 4:5 TARGET DIMENSIONS ---
        // Target height: 85% of viewport
        const targetHeight = viewportHeight * 0.85;
        // Target width: based on 4:5 ratio off the target height
        const targetWidth = targetHeight * (4/5); 
        // Ensure width doesn't exceed screen width on mobile
        const finalWidth = Math.min(targetWidth, window.innerWidth * 0.92);

        // --- INTERPOLATE SIZES ---
        // Start Width: 40% viewport -> End Width: calculated 4:5 width
        const currentWidth = (window.innerWidth * 0.4) + ((finalWidth - (window.innerWidth * 0.4)) * expansionProgress);
        
        // Start Height: 400px -> End Height: calculated 85vh height
        const currentHeight = 400 + ((targetHeight - 400) * expansionProgress);

        artExpander.style.width = `${currentWidth}px`;
        artExpander.style.height = `${currentHeight}px`;
    }


    // =========================================
    // 4. ART SECTION: MANUAL CAROUSEL
    // =========================================
    let slideIdx = 0;
    const totalSlides = 3;

    function moveSlide(direction) {
        slideIdx += direction;
        // Loop around logic
        if (slideIdx < 0) slideIdx = totalSlides - 1;
        if (slideIdx >= totalSlides) slideIdx = 0;
        
        if (track) track.style.transform = `translateX(-${(slideIdx * 100) / totalSlides}%)`;
    }

    if(prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => moveSlide(-1));
        nextArrow.addEventListener('click', () => moveSlide(1));
    }


    // =========================================
    // 5. ABOUT PHYSICS (BIG SNOWFLAKES)
    // =========================================
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
                isFlake: Math.random() > 0.75,
                size: Math.random() * 2 + 2
            });
        }
    }

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function drawPhysics() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                p.vx -= (dx / dist) * force * 10;
                p.vy -= (dy / dist) * force * 10;
            }
            p.vx += (p.bx - p.x) * 0.04;
            p.vy += (p.by - p.y) * 0.04;
            p.vx *= 0.9; p.vy *= 0.9;
            p.x += p.vx; p.y += p.vy;

            ctx.fillStyle = "white";
            if (p.isFlake) {
                ctx.font = "30px serif"; 
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
        updateArtExpansion();
    });
    window.addEventListener('resize', () => {
        initCanvas();
        updateArtExpansion(); // Recalculate sizes on resize
    });

    // Initial kicks
    initCanvas();
    drawPhysics();
    updateRunner();
    updateArtExpansion();
});
