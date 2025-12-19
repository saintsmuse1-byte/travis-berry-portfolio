document.addEventListener('DOMContentLoaded', () => {
    const smoothContent = document.getElementById('smooth-content');
    const ghostSpacer = document.getElementById('ghost-spacer');
    const runnerOverlay = document.getElementById('runner-overlay');
    const feather = document.getElementById('feather');
    const boyFrames = document.querySelectorAll('.boy-frame');
    const aboutCanvas = document.getElementById('about-canvas');

    let currentScroll = 0, targetScroll = 0;
    const SMOOTHING = 0.06;
    let lastFrameIdx = 0;

    function updateAnimations(y) {
        const startTrigger = 0;
        const finishLine = 1600;
        let progress = Math.min(Math.max((y - startTrigger) / finishLine, 0), 1);

        // Visibility
        runnerOverlay.style.opacity = (progress > 0.02 && progress < 0.98) ? 1 : 0;

        // Path Math
        const bx = -400 + ((window.innerWidth + 800) * progress);
        const bCurve = (650 * Math.pow(progress, 2)) - (550 * progress);
        const by = 450 + bCurve;

        // Move the whole frame container
        document.getElementById('boy-frames').style.transform = `translate3d(${bx}px, ${by}px, 0)`;

        // Feather Logic (Faster and bigger)
        const fx = bx + 250 + (progress * 600); 
        const squiggle = Math.sin(progress * 14) * 80;
        const fy = by - 120 + squiggle;
        feather.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${progress * 2500}deg)`;

        // Frame Toggling (NO SRC SWAPPING = NO FLICKER)
        const fIdx = Math.floor(progress * 45) % boyFrames.length;
        if (fIdx !== lastFrameIdx) {
            boyFrames[lastFrameIdx].classList.remove('active');
            boyFrames[fIdx].classList.add('active');
            lastFrameIdx = fIdx;
        }
    }

    function engine() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING;
        const scrollPos = parseFloat(currentScroll.toFixed(2));

        if(smoothContent) {
            smoothContent.style.transform = `translate3d(0, ${-scrollPos}px, 0)`;
        }
        
        updateAnimations(scrollPos);
        
        // (About canvas logic goes here as before)
        requestAnimationFrame(engine);
    }

    function syncHeight() {
        if (smoothContent && ghostSpacer) {
            const h = smoothContent.getBoundingClientRect().height;
            ghostSpacer.style.height = h + 'px';
            document.body.style.height = h + 'px';
        }
    }

    window.addEventListener('load', syncHeight);
    window.addEventListener('resize', syncHeight);
    syncHeight();
    engine();
});
