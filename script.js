document.addEventListener('DOMContentLoaded', () => {
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

    // 2. ART REVEAL (for portfolio items)
    const artObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                artObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.art-item').forEach(item => artObserver.observe(item));

    // 3. SNOW LANDING AND DISAPPEARANCE EFFECT (using IntersectionObserver)
    const snowflakesContainer = document.querySelector('.snowflakes');
    const regularFlakes = document.querySelectorAll('.snowflake.regular');
    const artSection = document.querySelector('.art-section');

    // Create a sentinel element to track the scroll position at the bottom of the hero section
    const snowSentinel = document.createElement('div');
    snowSentinel.style.height = '1px';
    snowSentinel.style.position = 'absolute';
    snowSentinel.style.bottom = '0';
    snowSentinel.style.width = '100%';
    document.querySelector('.main-content').appendChild(snowSentinel);

    // --- LANDING OBSERVER ---
    const landingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Sentinel is entering viewport: Start landing and fade out.
                
                // 1. Trigger the clump to appear and float up slightly
                snowflakesContainer.classList.add('landing-active');
                
                // 2. Start the general fade out (smooth disappearance)
                snowflakesContainer.style.opacity = '0';
                
                // 3. Stop the falling flakes' animation so they don't continue to scroll down the page
                regularFlakes.forEach(flake => {
                    flake.style.animationPlayState = 'paused';
                });

            } else if (entry.boundingClientRect.top > 0) {
                // Sentinel is above, but still in the dark section (scrolling back up)
                
                // Reset to standard falling
                snowflakesContainer.classList.remove('landing-active');
                snowflakesContainer.style.opacity = '1';
                regularFlakes.forEach(flake => {
                    flake.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        // Set root margin to trigger the event 100px BEFORE the element hits the very top of the viewport
        rootMargin: '-100px 0px 0px 0px',
        threshold: 0
    });
    
    // Start observing the invisible sentinel element
    landingObserver.observe(snowSentinel);

    // --- FINAL FADE OUT OBSERVER (Backup for when scrolling into the art section) ---
    const finalFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Art section is visible: Ensure snow is gone
                snowflakesContainer.style.opacity = '0';
            }
        });
    }, {
        // Trigger when 50% of the art section is visible
        threshold: 0.5 
    });

    finalFadeObserver.observe(artSection);
});
