document.addEventListener('DOMContentLoaded', () => {
    
    // Select necessary elements
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const mainContent = document.querySelector('.main-content');
    
    // RUNNER ANIMATION ELEMENTS
    const runnerContainer = document.getElementById('runner-container');
    const runnerBoy = document.getElementById('runner-boy');
    
    // Define the image frames for the running animation (MUST match your file names)
    // NOTE: Update these file paths to match your 6 images (e.g., 'images/boy-running-01.png')
    const RUNNER_FRAMES = [
        'images/boy-1.png', 
        'images/boy-2.png', 
        'images/boy-3.png', 
        'images/boy-4.png', 
        'images/boy-5.png', 
        'images/boy-6.png'
    ];
    const NUM_FRAMES = RUNNER_FRAMES.length;
    
    // 1. VIDEO HOVER PLAYBACK
    const vidContainer = document.querySelector('.video-link');
    const video = document.querySelector('.hover-video');

    if (vidContainer && video) {
        vidContainer.addEventListener('mouseenter', () => video.play());
        vidContainer.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    // --- RUNNER ANIMATION LOGIC ---
    
    // Function to calculate the position of the animation start/end points
    function getAnimationBounds() {
        const startPoint = mainContent.offsetTop + mainContent.offsetHeight - 500; // Start below profile image
        const endPoint = mainContent.offsetTop + mainContent.offsetHeight - runnerBoy.offsetHeight; // End just before art section
        const animationRange = endPoint - startPoint;
        return { startPoint, endPoint, animationRange };
    }
    
    let { startPoint, endPoint, animationRange } = getAnimationBounds();

    // Use a flag to throttle the scroll handler for performance
    let isTicking = false;

    function updateRunnerAnimation() {
        const scrollY = window.scrollY;

        // Check if the scroll position is within the animation range
        if (scrollY >= startPoint && scrollY <= endPoint) {
            
            // 1. Calculate Progress (0 to 1)
            const scrollProgress = (scrollY - startPoint) / animationRange;

            // 2. Set Horizontal Position (Runs from left (0) to right (90%))
            // The 90% ensures the image doesn't go completely off-screen
            const horizontalPosition = scrollProgress * (window.innerWidth * 0.90);
            
            runnerBoy.style.transform = `translateX(${horizontalPosition}px)`;

            // 3. Determine the current frame index
            // Map the scroll progress (0-1) to the number of frames (0-5)
            const frameIndex = Math.floor(scrollProgress * NUM_FRAMES) % NUM_FRAMES;
            
            // 4. Set the current frame image
            runnerBoy.style.backgroundImage = `url(${RUNNER_FRAMES[frameIndex]})`;

            // 5. Make the container visible
            runnerContainer.style.opacity = '1';

        } else if (scrollY < startPoint) {
            // Before the animation starts
            runnerContainer.style.opacity = '0'; // Hide
            runnerBoy.style.transform = 'translateX(0px)'; // Reset position

        } else if (scrollY > endPoint) {
            // After the animation ends
            runnerContainer.style.opacity = '0'; // Hide
            
        }

        isTicking = false;
    }

    // Throttle scroll events for better performance
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateRunnerAnimation();
            });
            isTicking = true;
        }
    });
    
    // Recalculate positions on window resize
    window.addEventListener('resize', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        updateRunnerAnimation();
    });
    
    // Initial call to set state correctly on load
    updateRunnerAnimation();


    // 4. SNOW FADE OUT OBSERVER (Kept functional)
    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const visibility = entry.intersectionRatio;
            
            if (snowflakesContainer) {
                // Fades snow out as art section scrolls in
                snowflakesContainer.style.opacity = 1 - visibility;
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
    });

    if (artSection) {
        fadeOutObserver.observe(artSection);
    }
});
