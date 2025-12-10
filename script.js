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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.art-item').forEach(item => observer.observe(item));

    // 3. SNOW LANDING AND DISAPPEARANCE EFFECT
    const snowflakesContainer = document.querySelector('.snowflakes');
    const landingFlakes = document.querySelectorAll('.snowflake.landing');
    const regularFlakes = document.querySelectorAll('.snowflake.regular');
    const heroContent = document.querySelector('.main-content');
    
    // Calculate the Y position where the flakes should "land"
    const landingYPosition = heroContent.offsetHeight - 50; 
    
    // The scroll position where the landing transition should start
    const startScrollZone = heroContent.offsetHeight - window.innerHeight;
    
    // The scroll position where the snow should be completely gone
    const endScrollZone = heroContent.offsetHeight + 100;

    // Set landing flakes to initial staggered horizontal positions
    landingFlakes.forEach((flake) => {
        // Random horizontal position for the clump
        flake.style.left = `${Math.random() * 90 + 5}%`;
    });

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        if (scrollPos < startScrollZone) {
            // --- STANDARD FALLING ZONE ---
            snowflakesContainer.style.opacity = '1';
            
            // Ensure regular flakes are still animating and visible
            regularFlakes.forEach(flake => {
                flake.style.animationPlayState = 'running';
                flake.style.opacity = '1';
            });
            // Keep landing flakes hidden
            landingFlakes.forEach(flake => flake.style.opacity = '0');

        } else if (scrollPos >= startScrollZone && scrollPos <= endScrollZone) {
            // --- LANDING AND FADE ZONE ---
            
            // Calculate progress through the transition (0 to 1)
            const progress = (scrollPos - startScrollZone) / (endScrollZone - startScrollZone);

            // CLUMP APPEARANCE & LANDING: First 50% of the zone
            if (progress < 0.5) {
                const landingProgress = progress * 2; // Scales to 0 to 1
                const moveUpAmount = (window.innerHeight - landingYPosition) * landingProgress;
                
                // Opacity fades in quickly
                const clumpOpacity = Math.min(1, landingProgress * 2);

                landingFlakes.forEach(flake => {
                    // Flake moves from its starting point (90vh) up to the landing Y position
                    flake.style.transform = `translateY(${landingYPosition - moveUpAmount}px)`;
                    flake.style.opacity = clumpOpacity;
                });
                
                // All snow (regular + landing) fades out as we hit the white section
                snowflakesContainer.style.opacity = 1 - landingProgress; 

            } else {
                // FADE OUT COMPLETE
                snowflakesContainer.style.opacity = '0';
            }
            
            // Stop regular flakes from falling down further, fixing the "horizontal line" issue
            regularFlakes.forEach(flake => {
                flake.style.animationPlayState = 'paused';
                flake.style.opacity = '0';
            });

        } else if (scrollPos > endScrollZone) {
            // --- BELOW ART SECTION ---
            snowflakesContainer.style.opacity = '0';
        }
    });
});
