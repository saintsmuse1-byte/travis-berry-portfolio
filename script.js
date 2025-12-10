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

    // 3. LANDING SNOW EFFECT
    const snowflakesContainer = document.querySelector('.snowflakes');
    const landingFlakes = document.querySelectorAll('.snowflake.landing');
    const artSection = document.querySelector('.art-section');

    window.addEventListener('scroll', () => {
        // Calculate the boundary where the hero section meets the white art section
        const heroBottom = document.querySelector('.main-content').offsetHeight;
        const scrollPos = window.scrollY;

        // Determine if the user is scrolling toward the transition zone
        if (scrollPos > heroBottom * 0.5 && scrollPos < heroBottom * 1.5) {
            
            // Calculate progress through the landing zone (0 to 1)
            const landingStart = heroBottom * 0.7; // Start transition halfway up the hero
            const landingEnd = heroBottom * 1.2; // End transition early into the art section
            const progress = (scrollPos - landingStart) / (landingEnd - landingStart);
            
            // Calculate opacity (appears then fades)
            let opacity = 0;
            if (progress < 0.5) {
                // Fade in
                opacity = progress * 2;
            } else {
                // Fade out
                opacity = 1 - ((progress - 0.5) * 2);
            }
            opacity = Math.max(0, Math.min(1, opacity)); // Clamp between 0 and 1

            // Calculate the landing position (moves from below screen to the bottom edge of hero)
            const snowTop = 100 - (progress * 10); // Simple calculation to move snow up
            snowflakesContainer.style.opacity = '1';
            
            landingFlakes.forEach((flake, index) => {
                // Stagger flakes and set their position based on scroll progress
                const finalPosition = heroBottom - 50; // Final Y destination
                const startPosition = window.innerHeight; // Starting point (bottom of viewport)
                const translateY = startPosition - (startPosition - finalPosition) * progress;

                // Set random horizontal position for the clump (0% to 100% of viewport)
                const leftPos = (index % 10) * 10;
                
                flake.style.opacity = opacity;
                flake.style.transform = `translateY(${translateY}px)`;
                // Randomize horizontal placement
                flake.style.left = `${Math.random() * 90 + 5}%`;
            });
            
        } else {
            // Standard falling snow opacity control
             if (scrollPos < heroBottom * 0.7) {
                 snowflakesContainer.style.opacity = '1'; // Standard falling
                 landingFlakes.forEach(flake => flake.style.opacity = '0');
             } else {
                 snowflakesContainer.style.opacity = '0'; // Completely disappear after transition
                 landingFlakes.forEach(flake => flake.style.opacity = '0');
             }
        }
    });
});
