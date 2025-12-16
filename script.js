document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const aboutCanvas = document.getElementById('about-canvas');
    const snowContainer = document.getElementById('falling-snow-container');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentScroll = 0;
    let targetScroll = 0;
    const SMOOTHING = 0.08;
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // 1. GENERATE HEADER SNOWFLAKES
    function createSnow() {
        if(!snowContainer) return;
        snowContainer.innerHTML = ''; // Clear existing
        for (let i = 0; i < 15; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake-js';
            flake.innerHTML = '❅';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (Math.random() * 5 + 7) + 's';
            flake.style.opacity = Math.random();
            flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowContainer.appendChild(flake);
        }
    }
    createSnow();

    // 2. THE ANIMATION ENGINE
    function animateRunner(scrollY) {
        if (!runnerBoy || !runnerContainer) return;

        // --- MANUALLY CHANGE THESE TWO NUMBERS ---
        const scrollDistance = 2500; // How many pixels of scroll the boy stays on screen
        const verticalDrop = 800;    // Increase this to make him go lower/steeper
        // -----------------------------------------

        if (scrollY > 10 && scrollY <= scrollDistance) {
            const progress = scrollY / scrollDistance;
            
            // X: This forces him to go from 0 to the absolute right edge
            // We subtract the boy's width (280) so he doesn't create a horizontal scrollbar
            const x = (window.innerWidth - 280
