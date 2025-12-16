document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ELEMENT SELECTIONS ---
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');

    if (!smoothContent || !runnerBoy || !mainContent) return;

    // --- 2. SMOOTH SCROLL VARIABLES ---
    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; 

    // --- 3. RUNNER ANIMATION SETTINGS ---
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const BOY_WIDTH = 350; 
    let currentFrameIndex = -1;

    // --- 4. PAGE HEIGHT MANAGEMENT ---
    function updatePageHeight() {
        const totalHeight = smoothContent.getBoundingClientRect().height;
        document.body.style.height = Math.floor(totalHeight) + "px";
    }

    // --- 5. THE RUNNER ANIMATION LOGIC ---
    function animateRunner(scrollY) {
        // Starts 20px below main header area
        const startPoint = mainContent.offsetTop + 20; 
        // Finishes run within 500px of scrolling
        const animationRange = 500; 
        const endPoint = startPoint + animationRange;

        if (scrollY >= startPoint && scrollY <= endPoint) {
            const progress = (scrollY - startPoint) / animationRange;
            
            // Move across screen
            const travel = (window.innerWidth - BOY_WIDTH) * progress;
            runnerBoy.style.transform = `translateX(${travel}px)`;
            
            // Change animation frames
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            if (frameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
                currentFrameIndex = frameIndex;
            }
            runnerContainer.style.opacity = '1';

        } else if (scrollY > endPoint) {
            // Fade out once finished
            runnerContainer.style.opacity = '0';
        } else {
            // Reset if scrolled back to top
            runnerBoy.style.transform = `translateX(0px)`;
            runnerContainer.style.opacity = '0';
        }
    }

    // --- 6. THE MAIN SMOOTH SCROLL LOOP ---
    function render() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING_FACTOR;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        animateRunner(currentScroll);
        requestAnimationFrame(render);
    }

    // --- 7. VIDEO HOVER ---
    const vidContainer = document.querySelector('.video-link');
    const video = document.querySelector('.hover-video');
    if (vidContainer && video) {
        vidContainer.addEventListener('mouseenter', () => video.play());
        vidContainer.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    // --- 8. SNOW FADE ---
    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (snowflakesContainer) {
                snowflakesContainer.style.opacity = 1 - entry.intersectionRatio;
            }
        });
    }, { threshold: [0, 0.2, 0.5, 0.8, 1] });

    if (artSection) fadeOutObserver.observe(artSection);

    // --- 9. INITIALIZATION ---
    updatePageHeight();
    window.addEventListener('load', updatePageHeight);
    window.addEventListener('resize', updatePageHeight);
    setTimeout(updatePageHeight, 1000); // Back-up height check
    render();
});
