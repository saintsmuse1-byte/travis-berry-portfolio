document.addEventListener('DOMContentLoaded', () => {
    
    // Select necessary elements
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const mainContent = document.querySelector('.main-content');
    
    // RUNNER ANIMATION ELEMENTS
    const runnerContainer = document.getElementById('runner-container');
    const runnerBoy = document.getElementById('runner-boy');
    
    // Define the image frames for the running animation (VERIFIED PATHS)
    const RUNNER_FRAMES = [
        'images/boy feather image 1.jpg',   // Frame 1
        'images/The second feather.jpg',    // Frame 2
        'images/The 3rd feather.jpg',       // Frame 3
        'images/The 4th feather .jpg',      // Frame 4 (CHECK FOR SPACE HERE)
        'images/boy feather image 1.jpg',   // Frame 5 (Repeat of Frame 1)
        'images/The second feather.jpg'     // Frame 6 (Repeat of Frame 2)
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
    
    // Simplified function to guarantee a fixed 800px scroll animation range
    function getAnimationBounds() {
        // Find the absolute top position of the white art section
        const endPoint = artSection.offsetTop; 
        
        // Define a guaranteed animation range height (e.g., 800px)
        const ANIMATION_HEIGHT = 800; 
        
        // The animation starts 800px before the art section begins
        const startPoint = endPoint - ANIMATION_HEIGHT; 
        
        const animationRange = ANIMATION_HEIGHT;

        return { startPoint, endPoint, animationRange };
    }
    
    let { startPoint, endPoint, animationRange } = getAnimationBounds();

    let isTicking = false;

    function updateRunnerAnimation() {
        // Only run if the art section is present
        if (!artSection) return; 

        const scrollY = window.scrollY;

        // Check if the scroll position is within the animation range
        if (scrollY >= startPoint && scrollY <= endPoint && animationRange > 0) {
            
            // 1. Calculate Progress (0 to 1)
            const scrollProgress = (scrollY - startPoint) / animationRange;

            // 2. Set Horizontal Position (Runs from left (0) to right (90%))
            const horizontalPosition = scrollProgress * (window.innerWidth * 0.90);
            
            runnerBoy.style.transform = `translateX(${horizontalPosition}px)`;

            // 3. Determine the current frame index
            // Math.min ensures the index doesn't exceed the array size at the very end
            const frameIndex = Math.min(Math.floor(scrollProgress * NUM_FRAMES), NUM_FRAMES - 1);
            
            // 4. Set the current frame image
            runnerBoy.style.backgroundImage = `url(${RUNNER_FRAMES[frameIndex]})`;

            // 5. Make the container visible and set Z-index above profile picture
            runnerContainer.style.opacity = '1';
            runnerContainer.style.zIndex = '500';

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
            window.requestAnimationFrame(updateRunnerAnimation);
            isTicking = true;
        }
    });
    
    // Recalculate positions on window resize or load
    window.addEventListener('resize', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        updateRunnerAnimation();
    });
    
    // Initial call to set state correctly on load
    window.addEventListener('load', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        updateRunnerAnimation();
    });
    
    // --- SNOW FADE OUT OBSERVER ---
    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const visibility = entry.intersectionRatio;
            
            if (snowflakesContainer) {
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
