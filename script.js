document.addEventListener('DOMContentLoaded', () => {
    
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');

    if (!smoothContent || !runnerBoy || !mainContent) return;

    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; // Slightly slower for that luxury feel

    // --- 1. HEIGHT CALCULATION FUNCTION ---
    function updatePageHeight() {
        const totalHeight = smoothContent.getBoundingClientRect().height;
        document.body.style.height = Math.floor(totalHeight) + "px";
    }

    // --- 2. RUNNER ANIMATION LOGIC ---
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const BOY_WIDTH = 350; 
    let currentFrameIndex = -1;

    function animateRunner(scrollY) {
        const startPoint = mainContent.offsetTop + 100; 
        const animationRange = 800;
        const endPoint = startPoint + animationRange;

        if (scrollY >= startPoint && scrollY <= endPoint) {
            const progress = (scrollY - startPoint) / animationRange;
            const travel = (window.innerWidth - BOY_WIDTH) * progress;
            
            runnerBoy.style.transform = `translateX(${travel}px)`;
            
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            if (frameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
                currentFrameIndex = frameIndex;
            }
            runnerContainer.style.opacity = '1';
        } else {
            runnerContainer.style.opacity = '0';
        }
    }

    // --- 3. THE SMOOTH LOOP ---
    function render() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING_FACTOR;
        
        // Move the content
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        // Animate the runner based on smooth position
        animateRunner(currentScroll);

        requestAnimationFrame(render);
    }

    // --- 4. INITIALIZE & SAFETY CHECKS ---
    
    // Run height check immediately
    updatePageHeight();

    // Run height check again after a short delay (for images loading)
    setTimeout(updatePageHeight, 500);
    setTimeout(updatePageHeight, 2000);

    // Run height check when everything is fully loaded
    window.addEventListener('load', updatePageHeight);
    window.addEventListener('resize', updatePageHeight);

    // Start the loop
    render();
});
