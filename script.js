document.addEventListener('DOMContentLoaded', () => {
    
    // Select necessary elements
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const mainContent = document.querySelector('.main-content');
    
    // RUNNER ANIMATION ELEMENTS
    const runnerContainer = document.getElementById('runner-container');
    const runnerBoy = document.getElementById('runner-boy'); 

    if (!artSection || !mainContent || !runnerContainer || !runnerBoy) {
        console.error("Missing required HTML elements. Cannot run animation.");
        return; 
    }
    
    // 5 & 6. NEW 8-FRAME LOGIC and NEW PATHWAYS (Transparent Background)
    const RUNNER_FRAMES = [
        'images/boy 1.PNG',   // Frame 1
        'images/boy 2.PNG',   // Frame 2
        'images/boy 3.PNG',   // Frame 3
        'images/boy 4.PNG',   // Frame 4
        'images/boy 1.PNG',   // Frame 5 (Repeat 1)
        'images/boy 2.PNG',   // Frame 6 (Repeat 2)
        'images/boy 3.PNG',   // Frame 7 (Repeat 3)
        'images/boy 4.PNG'    // Frame 8 (Repeat 4)
    ];
    const NUM_FRAMES = RUNNER_FRAMES.length;
    
    // 1. VIDEO HOVER PLAYBACK (Kept for completeness)
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
        const endPoint = artSection.offsetTop; 
        
        // 1 & 2. REDUCED SCROLL SECTION SIZE & EARLIER START
        const ANIMATION_HEIGHT = 500; // Total vertical distance for the animation
        const startPoint = endPoint - ANIMATION_HEIGHT; // The animation starts 500px before the art section
        const animationRange = ANIMATION_HEIGHT;

        return { startPoint, endPoint, animationRange };
    }
    
    let { startPoint, endPoint, animationRange } = getAnimationBounds();

    let isTicking = false;

    function updateRunnerAnimation() {
        const scrollY = window.scrollY;

        // Check if the scroll position is within the animation range
        if (scrollY >= startPoint && scrollY <= endPoint && animationRange > 0) {
            
            // 1. Calculate Progress (0 to 1)
            const scrollProgress = (scrollY - startPoint) / animationRange;

            // 4. RUN ALL THE WAY ACROSS (Full width travel)
            // Use window.innerWidth minus the boy's width (250px) so he reaches the edge of the screen
            const boyWidth = 250; 
            const horizontalTravelDistance = window.innerWidth - boyWidth;
            const horizontalPosition = scrollProgress * horizontalTravelDistance;
            
            runnerBoy.style.transform = `translateX(${horizontalPosition}px)`;

            // 3. Determine the current frame index (using 8 frames)
            const frameIndex = Math.min(Math.floor(scrollProgress * NUM_FRAMES), NUM_FRAMES - 1);
            
            // 4. Set the current frame image
            if (runnerBoy.src !== RUNNER_FRAMES[frameIndex]) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
            }

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
