document.addEventListener('DOMContentLoaded', () => {
    
    // Select necessary elements
    const artSection = document.querySelector('.art-section');
    const snowflakesContainer = document.querySelector('.snowflakes');
    
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

    // 2. SNOW FADE OUT OBSERVER (Reintroduced)
    // This observer watches the white art section and fades the snow out as it becomes visible.
    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // entry.intersectionRatio is the percentage of the target element (artSection) that is visible (0 to 1).
            const visibility = entry.intersectionRatio;
            
            // We want the opacity to go from 1 (visible) down to 0 (hidden) as visibility increases.
            // Opacity = 1 - visibility
            if (snowflakesContainer) {
                snowflakesContainer.style.opacity = 1 - visibility;
            }
        });
    }, {
        // Observe the entire art section, reporting visibility constantly
        // Includes a range of thresholds for a smoother fade
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
    });

    // Start observing the art section if it exists
    if (artSection) {
        fadeOutObserver.observe(artSection);
    }
});
