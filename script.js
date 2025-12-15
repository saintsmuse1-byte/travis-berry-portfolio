document.addEventListener('DOMContentLoaded', () => {
    
    // Select necessary elements
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const mainContent = document.querySelector('.main-content');
    const circleWrapper = document.querySelector('.circle-wrapper'); // New reference for earlier start
    
    // RUNNER ANIMATION ELEMENTS
    const runnerContainer = document.getElementById('runner-container');
    const runnerBoy = document.getElementById('runner-boy'); 

    if (!artSection || !mainContent || !runnerContainer || !runnerBoy || !circleWrapper) {
        console.error("Missing required HTML elements. Cannot run animation.");
        return; 
    }
    
    // File paths should match your files exactly
    const RUNNER_FRAMES = [
        'images/boy 1.PNG',
        'images/boy 2.PNG',
        'images/boy 3.PNG',
        'images/boy 4.PNG',
        'images/boy 1.PNG',
        'images/boy 2.PNG',
        'images/boy 3.PNG',
        'images/boy 4.PNG'
    ];
    const NUM_FRAMES = RUNNER_FRAMES.length;
    // 3. FULL EDGE-TO-EDGE RUN: Must match the new CSS width
    const BOY_WIDTH = 350; 
    
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
    
    function getAnimationBounds() {
        // Calculate the absolute vertical position of the bottom of the profile picture area
        const heroBottom = circleWrapper.offsetTop + circleWrapper.offsetHeight;
        
        // 2. EARLIER START FIX: Start the animation immediately after the profile picture.
        // We add a small buffer (50px) to keep it visually separate from the image.
        const startPoint = heroBottom + 50; 
        
        // The animation will run over 1500px of scrolling distance
        const ANIMATION_HEIGHT = 1500; 
        const endPoint = startPoint + ANIMATION_HEIGHT;
        const animationRange = ANIMATION_HEIGHT;

        return { startPoint, endPoint, animationRange };
    }
    
    let { startPoint, endPoint, animationRange } = getAnimationBounds();

    let isTicking = false;
    let currentFrameIndex = -1; 

    function updateRunnerAnimation() {
        const scrollY = window.scrollY;

        // Check if the scroll position is within the animation range
        if (scrollY >= startPoint && scrollY <= endPoint && animationRange > 0) {
            
            // 1. Calculate Progress (0 to 1)
            const scrollProgress = (scrollY - startPoint) / animationRange;

            // 3. FULL EDGE-TO-EDGE RUN: Correctly calculates travel distance
            const horizontalTravelDistance = Math.max(0, window.innerWidth - BOY_WIDTH);
            const horizontalPosition = scrollProgress * horizontalTravelDistance;
            
            runnerBoy.style.transform = `translateX(${horizontalPosition}px)`;

            // 4. Determine the current frame index
            const newFrameIndex = Math.min(Math.floor(scrollProgress * NUM_FRAMES), NUM_FRAMES - 1);
            
            // 5. Set the current frame image
            if (newFrameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[newFrameIndex];
                currentFrameIndex = newFrameIndex;
            }

            // 6. Make the container visible
            runnerContainer.style.opacity = '1';

        } else if (scrollY < startPoint) {
            // Before the animation starts
            runnerContainer.style.opacity = '0'; // Hide
            runnerBoy.style.transform = 'translateX(0px)'; // Reset position
            currentFrameIndex = -1;

        } else if (scrollY > endPoint) {
            // After the animation ends
            runnerContainer.style.opacity = '0'; // Hide
            // Ensure the boy is positioned at the far right when he disappears
            const finalPosition = Math.max(0, window.innerWidth - BOY_WIDTH);
            runnerBoy.style.transform = `translateX(${finalPosition}px)`;
            currentFrameIndex = -1;
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
    
    window.addEventListener('load', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        updateRunnerAnimation();
    });
    
    // --- SNOW FADE OUT OBSERVER (Kept functional) ---
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
