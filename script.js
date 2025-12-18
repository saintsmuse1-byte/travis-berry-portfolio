document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentY = 0, targetY = 0;
    const easing = 0.07;

    function engine() {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * easing;
        
        // This moves the page content
        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-currentY.toFixed(2)}px, 0)`;
        }

        // --- UPDATED CURVE WITH TURN-UP ---
        if (runnerBoy && runnerOverlay) {
            const startLine = 50;
            const finishLine = 1100;

            if (targetY > startLine && targetY < finishLine) {
                let progress = (targetY - startLine) / (finishLine - startLine);
                progress = Math.min(Math.max(progress, 0), 1);
                runnerOverlay.style.opacity = 1;

                const bx = -300 + (window.innerWidth + 600) * progress;
                
                // Curve Math: dips then turns back up
                // (600 * progress^2) - (500 * progress) 
                const curve = (600 * Math.pow(progress, 2)) - (500 * progress);
                const by = 420 + curve; 
                
                runnerBoy.style.transform = `translate(${bx}px, ${by}px)`;
                
                const fIdx = Math.floor(targetY / 120) % RUNNER_FRAMES.length;
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = 0;
            }
        }
        requestAnimationFrame(engine);
    }

    // THIS FIXES THE SCROLLING: It creates the space to scroll into
    function resize() {
        if (smoothContent) {
            document.body.style.height = smoothContent.getBoundingClientRect().height + "px";
        }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);
    
    engine();
    setTimeout(resize, 500); // Back-up check
});
