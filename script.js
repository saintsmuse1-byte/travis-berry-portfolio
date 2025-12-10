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

    // 2. ART REVEAL
    const artObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                artObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.art-item').forEach(item => artObserver.observe(item));

    // 3. SNOW LANDING AND DISAPPEARANCE EFFECT
    const snowflakesContainer = document.querySelector('.snowflakes');
    const regularFlakes = document.querySelectorAll('.snowflake.regular');
    const landingFlakes = document.querySelectorAll('.snowflake.landing');
    const artSection = document.querySelector('.art-section');
    const heroContent = document.querySelector('.main-content');

    // Calculate the distance the landing flakes need to travel (from top: 50% to the hero bottom)
    const landingStartTop = window.innerHeight * 0.5; // CSS top: 50%
    const landingEndTop = heroContent.offsetHeight;
    const dropDistance = landingEndTop - landingStartTop;

    // Set initial random horizontal positions for the 35 landing flakes
    landingFlakes.forEach(flake => {
        // Random horizontal position for the clump, ensuring they are staggered
        flake.style.left = `${Math.random() * 95}%`;
    });

    // Create a sentinel element to track the scroll position at the bottom of the hero section
    const snowSentinel = document.createElement('div');
    snowSentinel.style.height = '1px';
    snowSentinel.style.position = 'absolute';
    snowSentinel.style.bottom = '0';
    snowSentinel.style.width = '100%';
    heroContent.appendChild(snowSentinel);

    // --- LANDING OBSERVER (Triggers the sudden appearance and drop) ---
    const landingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Sentinel is entering viewport:
                
                // 1. Makes the clump instantly appear by adding the class
                snowflakesContainer.classList.add('landing-active');
                
                // 2. Make the 35 flakes immediately drop/land to the bottom edge
                landingFlakes.forEach(flake => {
                    // This creates the sudden drop effect
                    flake.style.transform = `translateY(${dropDistance + 20}px)`; 
                });

                // 3. Stop the regular flakes' animation immediately to hold them in place
                regularFlakes.forEach(flake => {
                    flake.style.animationPlayState = 'paused';
                });

            } else if (entry.boundingClientRect.top > 0) {
                // Sentinel is above (scrolling back up)
                
                // Reset to standard falling
                snowflakesContainer.classList.remove('landing-active');
                snowflakesContainer.style.opacity = '1';
                landingFlakes.forEach(flake => {
                    flake.style.transform = 'translateY(0px)'; // Reset transform for reset
                });
                regularFlakes.forEach(flake => {
                    flake.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        // Trigger the event 200px BEFORE the bottom of the hero section is visible at the top of the viewport
        rootMargin: '-200px 0px 0px 0px',
        threshold: 0
    });
    
    landingObserver.observe(snowSentinel);

    // --- FADE OUT OBSERVER (Gently fades everything out over the white section) ---
    const fadeOutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Calculate opacity based on how much of the art section is showing
            const visibility = entry.intersectionRatio; // 0 to 1
            
            // Invert the visibility to get a fade out (1 to 0)
            snowflakesContainer.style.opacity = 1 - visibility;
        });
    }, {
        // Observe the entire art section, reporting visibility constantly
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
    });

    fadeOutObserver.observe(artSection);
});
