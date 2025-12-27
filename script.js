document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    const artSection = document.getElementById('art-section-trigger');
    const artExpander = document.getElementById('art-expander');
    const track = document.getElementById('carousel-track');
    const overlay = document.getElementById('runner-overlay');
    const boyContainer = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    const snowContainer = document.getElementById('falling-snow-container');

    // CONFIGURATION
    let slideIdx = 0;
    const totalSlides = 6; // Streets, Chaos, Clem, Silver, Book, Home
    let lastFrameIdx = 0;

    // 2. HERO SNOW GENERATION
    if (snowContainer) {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            flake.style.opacity = Math.random() * 0.5;
            snowContainer.appendChild(flake);
        }
    }

    // 3. CAROUSEL NAVIGATION (6 Slides)
    const nextBtn = document.getElementById('next-arrow');
    const prevBtn = document.getElementById('prev-arrow');

    if (nextBtn && prevBtn && track) {
        nextBtn.onclick = () => {
            slideIdx = (slideIdx + 1) % totalSlides;
            track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
        };
        prevBtn.onclick = () => {
            slideIdx = (slideIdx - 1 + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${slideIdx * (100 / totalSlides)}%)`;
        };
    }

    // 4. TIMQ EXPANSION & RISE (The entire white section effect)
    function updateExpansion() {
        if (!artSection || !artExpander) return;
        
        const rect = artSection.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Progress: 0 when bottom enters, 1 when middle is in view
        let progress = 1 - (rect.top / vh);
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Growth logic (Starting at 320x420 scaling to nearly full screen)
        const targetH = vh * 0.9;
        const targetW = targetH * 0.8;

        const currentW = 320 + (targetW - 320) * progress;
        const currentH = 420 + (targetH - 420) * progress;

        artExpander.style.width = `${currentW}px`;
        artExpander.style.height = `${currentH}px`;
        
        // THE RISE: Makes the white box slide up from the bottom as it grows
        // You can change '200' to a higher number if you want more "lift"
        const lift = (1 - progress) * 200;
        artExpander.style.transform = `translateY(${lift}px)`;
    }

    // 5. RUNNER BOY SYSTEM
    function updateRunner() {
        const y = window.scrollY;
        // Adjust the 2200 to make the boy finish his run earlier or later
        const progress =
