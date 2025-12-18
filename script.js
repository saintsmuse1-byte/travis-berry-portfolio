document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy'); 

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    
    let currentY = 0;
    let targetY = 0;
    const easing = 0.06; // JACK ELDER SMOOTHNESS: Lower is smoother/heavier.

    function animate() {
        // 1. SMOOTH SCROLL ENGINE
        targetY = window.scrollY;
        currentY += (targetY - currentY) * easing;
        
        // Move content with sub-pixel precision
        smoothContent.style.transform = `translate3d(0, ${-currentY.toFixed(2)}px, 0)`;

        // 2. RUNNER LOGIC
        if (runnerBoy && runnerOverlay) {
            const startTrigger = 50; 
            const finishLine = 1200; // Finish by end of Hero

            if (targetY > startTrigger && targetY < finishLine) {
                let progress = (targetY - startTrigger) / (finishLine - startTrigger);
                progress = Math.min(Math.max(progress, 0), 1);

                runnerOverlay.style.opacity = "1";

                // Shallow Slope Path
                const x = -300 + (window.innerWidth + 600) * progress;
                const y = 450 + (120 * progress);
                runnerBoy.style.transform = `translate(${x}px, ${y}px)`;

                // SLOW RUNNING SPEED
                // Increased divisor to 120 to slow down leg movement significantly
                const fIdx = Math.floor(targetY / 120) % RUNNER_FRAMES.length; 
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = "0";
            }
        }

        requestAnimationFrame(animate);
    }

    // UPDATES THE "GHOST HEIGHT" OF THE BODY
    function updateHeight() {
        if (smoothContent) {
            const h = smoothContent.getBoundingClientRect().height;
            document.body.style.height = Math.floor(h) + "px";
        }
    }

    // Listen for resize and initial load
    window.addEventListener('resize', updateHeight);
    
    // Start loop
    animate();
    
    // Delay height check slightly to ensure images/fonts are rendered
    setTimeout(updateHeight, 1000);
});
