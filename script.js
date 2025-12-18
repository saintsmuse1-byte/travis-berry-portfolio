document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerBoy = document.getElementById('runner-boy');

    const RUNNER_FRAMES = ['images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'];
    let currentY = 0, targetY = 0;
    const easing = 0.075; 

    function engine() {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * easing;
        
        if (smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-currentY.toFixed(2)}px, 0)`;
        }

        // --- THE "SCOOP" PATH WITH TURN-UP ---
        if (runnerBoy && runnerOverlay) {
            const startLine = 20;
            const finishLine = 1200;

            if (targetY > startLine && targetY < finishLine) {
                let progress = (targetY - startLine) / (finishLine - startLine);
                progress = Math.min(Math.max(progress, 0), 1);
                runnerOverlay.style.opacity = 1;

                const bx = -300 + (window.innerWidth + 600) * progress;
                
                // Parabolic curve logic:
                const curve = (650 * Math.pow(progress, 2)) - (550 * progress);
                const by = 430 + curve; 
                
                runnerBoy.style.transform = `translate(${bx}px, ${by}px)`;
                
                const fIdx = Math.floor(targetY / 120) % RUNNER_FRAMES.length;
                runnerBoy.src = RUNNER_FRAMES[fIdx];
            } else {
                runnerOverlay.style.opacity = 0;
            }
        }
        requestAnimationFrame(engine);
    }

    // THIS UNFREEZES THE SCROLLING
    function syncHeight() {
        if (smoothContent && ghostSpacer) {
            const h = smoothContent.getBoundingClientRect().height;
            ghostSpacer.style.height = h + "px";
            document.body.style.height = h + "px";
        }
    }

    window.addEventListener('resize', syncHeight);
    window.addEventListener('load', syncHeight);
    
    engine();
    setTimeout(syncHeight, 1000); // Back-up for late-loading images
});
