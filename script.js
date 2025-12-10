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
    const fallingFlakes = document.querySelectorAll('.snowflake:not(.landing)');
    const landingFlakes = document.querySelectorAll('.snowflake.landing');
    const heroBottom = document.querySelector('.main-content').offsetHeight;
    
    // Set landing flakes to their initial random horizontal positions
    landingFlakes.forEach((flake) => {
        flake.style.left = `${Math.random() * 90 + 5}%`;
    });

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // Defines the short scroll zone where the action happens
        const startZone = heroBottom * 0.9;
        const endZone = heroBottom + 100; // 100px into the white section
        const inZone = scrollPos >= startZone && scrollPos <= endZone;

        if (inZone) {
            const progress = (scrollPos - startZone) / (endZone - startZone);
            
            // --- LANDING EFFECT ---
            // Move landing flakes up (sudden appearance)
            if (progress < 0.2) { // 0% to 20% progress: Suddenly appear and move up quickly
                 landingFlakes.forEach(flake => {
                    flake.style.opacity = '1';
                    flake.style.transform = `translateY(${window.innerHeight - 50}px)`; // Just above the bottom of viewport
                });
            }
            
            // --- DISAPPEARANCE ---
            // 20% to 100% progress: All snow (falling and landing) quickly fades out
            if (progress >= 0.2) {
                // Fade out from 1 to 0 over the rest of the zone
                const fadeOut = 1 - ((progress - 0.2) / 0.8); 
                snowflakesContainer.style.opacity = fadeOut;

                // Stop falling flakes visually before the container reaches 0 opacity
                fallingFlakes.forEach(flake => {
                    flake.style.top = `${flake.offsetTop}px`; // Fix their current vertical position
                    flake.style.animation = 'none'; // Stop falling
                });

                // Move landing flakes below the fold and hide them
                landingFlakes.forEach(flake => {
                    flake.style.transform = `translateY(${window.innerHeight + 100}px)`;
                });
            }

        } else if (scrollPos < startZone) {
            // Before the zone: Standard falling snow, full opacity
            snowflakesContainer.style.opacity = '1';
            fallingFlakes.forEach(flake => {
                flake.style.animation = 'fall 10s linear infinite';
            });
            landingFlakes.forEach(flake => flake.style.opacity = '0');

        } else if (scrollPos > endZone) {
            // After the zone: All snow is gone
            snowflakesContainer.style.opacity = '0';
        }
    });
});
