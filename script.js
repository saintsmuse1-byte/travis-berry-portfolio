document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    
    // SMOOTH SCROLL VARIABLES
    let currentY = 0;   // The position currently being displayed
    let targetY = 0;    // The actual position of the scroll bar
    const easing = 0.07; // JACK ELDER EFFECT: Lower = smoother/heavier (try 0.05 to 0.1)

    function animate() {
        // 1. SMOOTH SCROLL LOGIC
        targetY = window.scrollY;
        currentY += (targetY - currentY) * easing;
        
        // Move the whole page content smoothly
        smoothContent.style.transform = `translateY(-${currentY}px)`;

        // 2. RUNNER ANIMATION
        if (runnerBoy && runnerOverlay) {
            const startTrigger = 10;    // Starts after 10px of scroll
            const finishLine = 900;     // Ends at the bottom of Hero
            
            if (targetY > startTrigger && targetY < finishLine + 200) {
                let progress = (targetY - startTrigger) / (finishLine - startTrigger);
                progress = Math.min(Math.max(progress, 0), 1);

                // APPEARANCE: Fade in quickly at start, fade out at end
                runnerOverlay.style.opacity = progress > 0.01 && progress < 0.95 ? 1 : 0;

                // POSITION: Horizontal and Shallow Vertical Slope
                const x = -200 + (window.innerWidth + 400) * progress;
                const y = 450 + (130 * progress);
                runnerBoy.style.transform = `translate(${x}px, ${y}px)`;

                // LEG SPEED: Lower number = Slower legs. 
                // Changed from 35 to 15 for a much slower run.
                const fIdx = Math.floor(targetY / 80) % RUNNER_FRAMES.length; 
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = 0;
            }
        }

        requestAnimationFrame(animate);
    }

    // Set the body height so the scrollbar exists
    function updateHeight() {
        document.body.style.height = smoothContent.getBoundingClientRect().height + 'px';
    }

    window.addEventListener('resize', updateHeight);
    updateHeight(); // Initial check
    
    // Start the animation loop
    animate();
});
