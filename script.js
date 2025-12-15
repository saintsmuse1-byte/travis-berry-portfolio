document.addEventListener('DOMContentLoaded', () => {
    
    // --- SMOOTH SCROLL VARIABLES ---
    const smoothContent = document.getElementById('smooth-content');
    if (!smoothContent) {
        console.error("Missing #smooth-content element for scroll smoothing.");
        return;
    }
    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.08; 
    
    // --- ALL EXISTING VARIABLES ---
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    const mainContent = document.querySelector('.main-content');
    const circleWrapper = document.querySelector('.circle-wrapper'); 
    const runnerContainer = document.getElementById('runner-container');
    const runnerBoy = document.getElementById('runner-boy'); 

    if (!artSection || !mainContent || !runnerContainer || !runnerBoy || !circleWrapper) {
        console.error("Missing required HTML elements for animation.");
        return; 
    }
    
    // File paths and dimensions (Unchanged)
    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const NUM_FRAMES = RUNNER_FRAMES.length;
    const BOY_WIDTH = 350; 
    
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

    // --- SMOOTH SCROLL FUNCTION ---
    function smoothScrollLoop() {
        // Calculate the difference between target and current position
        currentScroll += (targetScroll - currentScroll) * SMOOTHING_FACTOR;
        
        // Apply the smooth transform to the content wrapper
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        
        // Use the smoothed scroll position to run the animation
        updateRunnerAnimation(currentScroll);

        requestAnimationFrame(smoothScrollLoop);
    }
    
    // Listen for native scroll and update the target scroll position
    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    // Start the smooth scroll loop
    smoothScrollLoop();


    // --- RUNNER ANIMATION LOGIC ---
    
    function getAnimationBounds() {
        // Animation timing remains the same as the final successful setup
        const mainContentTop = mainContent.offsetTop; 
        const startPoint = mainContentTop + 100; 
        const ANIMATION_HEIGHT = 800; 
        const endPoint = startPoint + ANIMATION_HEIGHT;
        const animationRange = ANIMATION_HEIGHT;

        return { startPoint, endPoint, animationRange };
    }
    
    let { startPoint, endPoint, animationRange } = getAnimationBounds();
    let currentFrameIndex = -1; 

    function updateRunnerAnimation(scrollY) {
        // Check if the scroll position is within the animation range
        if (scrollY >= startPoint && scrollY <= endPoint && animationRange > 0) {
            
            // 1. Calculate Progress (0 to 1)
            const scrollProgress = (scrollY - startPoint) / animationRange;

            // 2. Horizontal Travel (Full width)
            const horizontalTravelDistance = Math.max(0, window.innerWidth - BOY_WIDTH);
            const horizontalPosition = scrollProgress * horizontalTravelDistance;
            
            runnerBoy.style.transform = `translateX(${horizontalPosition}px)`;

            // 3. Determine the current frame index
            const newFrameIndex = Math.min(Math.floor(scrollProgress * NUM_FRAMES), NUM_FRAMES - 1);
            
            // 4. Set the current frame image
            if (newFrameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[newFrameIndex];
                currentFrameIndex = newFrameIndex;
            }

            // 5. Make the container visible
            runnerContainer.style.opacity = '1';

        } else if (scrollY < startPoint) {
            // Before the animation starts
            runnerContainer.style.opacity = '0'; // Hide
            runnerBoy.style.transform = 'translateX(0px)'; // Reset position
            currentFrameIndex = -1;

        } else if (scrollY > endPoint) {
            // After the animation ends
            runnerContainer.style.opacity = '0'; // Hide
            const finalPosition = Math.max(0, window.innerWidth - BOY_WIDTH);
            runnerBoy.style.transform = `translateX(${finalPosition}px)`;
            currentFrameIndex = -1;
        }
    }

    // --- RECALCULATION & INITIALIZATION ---
    
    // IMPORTANT: When resizing, recalculate bounds AND the total height
    window.addEventListener('resize', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        
        // FIX: Recalculate body height on resize
        const totalHeight = smoothContent.clientHeight;
        document.body.style.height = `${totalHeight}px`;
    });
    
    // CRITICAL FIX: Only set the body height once all content is loaded.
    window.addEventListener('load', () => {
        ({ startPoint, endPoint, animationRange } = getAnimationBounds());
        
        // FIX: Set total scrollable height to enable scrolling
        const totalHeight = smoothContent.clientHeight;
        document.body.style.height = `${totalHeight}px`;

        // Run animation logic once to set the initial state
        updateRunnerAnimation(currentScroll); 
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
