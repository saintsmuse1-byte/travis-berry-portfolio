document.addEventListener('DOMContentLoaded', () => {
    
    const smoothContent = document.getElementById('smooth-content');
    const runnerBoy = document.getElementById('runner-boy'); 
    const runnerContainer = document.getElementById('runner-container');
    const mainContent = document.querySelector('.main-content');
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');

    if (!smoothContent || !runnerBoy || !mainContent) return;

    let currentScroll = 0; 
    let targetScroll = 0;  
    const SMOOTHING_FACTOR = 0.07; 

    const RUNNER_FRAMES = [
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG',
        'images/boy 1.PNG', 'images/boy 2.PNG', 'images/boy 3.PNG', 'images/boy 4.PNG'
    ];
    const BOY_WIDTH = 350; 
    let currentFrameIndex = -1;

    function updatePageHeight() {
        const totalHeight = smoothContent.getBoundingClientRect().height;
        document.body.style.height = Math.floor(totalHeight) + "px";
    }

    function animateRunner(scrollY) {
        // Start right under the profile picture
        const startPoint = mainContent.offsetTop + 10; 
        // He runs over a distance of 900px scroll distance now
        const animationRange = 900; 
        const endPoint = startPoint + animationRange;

        if (scrollY >= startPoint && scrollY <= endPoint) {
            const progress = (scrollY - startPoint) / animationRange;
            
            // HORIZONTAL: Across the screen
            const xTravel = (window.innerWidth - BOY_WIDTH) * progress;
            
            // VERTICAL: Start at 20% down, end at 60% down (stays in vision)
            const startY = window.innerHeight * 0.35;
            const endY = window.innerHeight * 0.80;
            const yTravel = startY + (endY - startY) * progress;

            runnerBoy.style.transform = `translate(${xTravel}px, ${yTravel}px)`;
            
            const frameIndex = Math.min(Math.floor(progress * RUNNER_FRAMES.length), RUNNER_FRAMES.length - 1);
            if (frameIndex !== currentFrameIndex) {
                runnerBoy.src = RUNNER_FRAMES[frameIndex];
                currentFrameIndex = frameIndex;
            }
            runnerContainer.style.opacity = '1';

        } else if (scrollY > endPoint) {
            runnerContainer.style.opacity = '0';
        } else {
            runnerContainer.style.opacity = '0';
        }
    }

    function render() {
        targetScroll = window.scrollY;
        currentScroll += (targetScroll - currentScroll) * SMOOTHING_FACTOR;
        smoothContent.style.transform = `translateY(${-currentScroll}px)`;
        animateRunner(currentScroll);
        requestAnimationFrame(render);
    }

    // Video & Snow logic
    const vidContainer = document.querySelector('.video-link');
    const video = document.querySelector('.hover-video');
    if (vidContainer && video) {
        vidContainer.addEventListener('mouseenter', () => video.play());
        vidContainer.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (snowflakesContainer) {
                snowflakesContainer.style.opacity = 1 - entry.intersectionRatio;
            }
        });
    }, { threshold: [0, 0.2, 0.5, 0.8, 1] });

    if (artSection) fadeOutObserver.observe(artSection);

    updatePageHeight();
    window.addEventListener('load', updatePageHeight);
    window.addEventListener('resize', updatePageHeight);
    setTimeout(updatePageHeight, 1000); 
    render();
});
