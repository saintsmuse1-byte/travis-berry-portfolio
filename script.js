document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy');

    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 
        'images/boy 2.PNG', 
        'images/boy 3.PNG', 
        'images/boy 4.PNG'
    ];
    
    let currentY = 0;
    let targetY = 0;
    const easing = 0.075; // Adjust for smoothness

    function engine() {
        // 1. UPDATE TARGET POSITION
        targetY = window.scrollY;
        
        // 2. LERP (SMOOTHING)
        currentY += (targetY - currentY) * easing;
        
        // 3. MOVE THE WORLD
        if (smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-currentY.toFixed(2)}px, 0)`;
        }

        // 4. RUNNER PATH LOGIC
        if (runnerBoy && runnerOverlay) {
            const startLine = 20;
            const finishLine = 1100;

            if (targetY > startLine && targetY < finishLine) {
                let progress = (targetY - startLine) / (finishLine - startLine);
                progress = Math.min(Math.max(progress, 0), 1);
                
                runnerOverlay.style.opacity = 1;

                const bx = -300 + (window.innerWidth + 600) * progress;
                
                // --- THE SCOOP CURVE ---
                // Dips down then turns up at the end
                const curve = (650 * Math.pow(progress, 2)) - (550 * progress);
                const by = 430 + curve; 
                
                runnerBoy.style.transform = `translate(${bx}px, ${by}px)`;
                
                // Leg Speed
                const fIdx = Math.floor(targetY / 100) % RUNNER_FRAMES.length;
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = 0;
            }
        }
        requestAnimationFrame(engine);
    }

    // --- CRITICAL: THE SCROLLBAR FIX ---
    // This tells the browser how big the page actually is
    function updatePageHeight() {
        if (smoothContent) {
            const h = smoothContent.getBoundingClientRect().height;
            document.body.style.height = Math.floor(h) + "px";
        }
    }

    window.addEventListener('resize', updatePageHeight);
    window.addEventListener('load', updatePageHeight);
    
    // Start the animation loop
    engine();
    
    // Force a height check after half a second
    setTimeout(updatePageHeight, 500);
});
