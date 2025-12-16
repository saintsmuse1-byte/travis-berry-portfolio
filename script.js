document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ELEMENT SELECTIONS ---
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');

    if (!smoothContent || !runnerBoy || !mainContent) {
        console.error("Required elements not found. Check your HTML IDs.");
        return;
    }

    // --- 2. SMOOTH SCROLL VARIABLES ---
    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; // Lower = slower/smoother (Jack Elder style)

    // --- 3. RUNNER ANIMATION SETTINGS ---
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const BOY_WIDTH = 350; // Matches your CSS
    let currentFrameIndex = -1;

    // --- 4. PAGE HEIGHT MANAGEMENT ---
    // Tells the browser how long the page is so the smooth scroll works
    function updatePageHeight() {
        const totalHeight = smoothContent.getBoundingClientRect().height;
        document.body.style.height = Math.floor(totalHeight) + "px";
    }

    // --- 5. THE RUNNER ANIMATION LOGIC ---
    function animateRunner(scrollY) {
        // Start almost immediately after the profile pic (+20px offset)
        const startPoint = mainContent.offsetTop + 20; 
        
        // Shortened range to keep the section tight
        const animationRange = 650; 
        const endPoint = startPoint + animationRange;

        if (scrollY >= startPoint && scrollY <= endPoint) {
            const progress = (scrollY - startPoint) / animationRange;
            
            // Calculate horizontal movement
            const travel = (window.innerWidth - BOY_WIDTH) * progress;
            runnerBoy.style.transform = `translateX(${travel}px)`;
            
            // Cycle through the 8 frames based on scroll progress
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            if (frameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
                currentFrameIndex = frameIndex;
            }
            
            // Fade in the boy while in range
            runnerContainer.style.opacity = '1';

        } else if (scrollY > endPoint) {
            // Once finished, hold position at the far right and fade out
            const finalTravel = window.innerWidth - BOY_WIDTH;
            runnerBoy.style.transform = `translateX(${finalTravel}px)`;
            runnerContainer.style.opacity = '0';
        } else {
            // Before the start point, keep him at the left and hidden
