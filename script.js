document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    // The Parallax System (Appears and disappears based on scroll points)
    const parallaxSnowContainer = document.querySelector('.snow-container'); 
    const parallaxSnowLayer = document.getElementById('snow-layer'); 
    
    // The Floating System (Always visible until the fade-out point)
    const floatingSnowContainer = document.querySelector('.snowflakes'); 
    
    // 2. Settings
    const speed = 0.08; 
    const triggerFadeIn = 700;   // Parallax snow appears here
    const triggerFadeOut = 1200; // BOTH snow systems fade out here

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // --- VISIBILITY CONTROL FOR PARALLAX SNOW (Scroll-triggered layer) ---
        // This logic ensures the large snow image only appears between 700px and 1200px.
        if (scrollPosition > triggerFadeOut || scrollPosition < triggerFadeIn) {
            parallaxSnowContainer.style.opacity = '0';
        } else {
            parallaxSnowContainer.style.opacity = '1';
        }

        // --- VISIBILITY CONTROL FOR FLOATING SNOW (Continuous layer) ---
        // This logic ensures the small snowflakes are VISIBLE by default (from the top)
        // and only disappear when the scroll reaches the white section.
        if (scrollPosition > triggerFadeOut) {
            // Fades OUT when reaching the white section trigger
            floatingSnowContainer.style.opacity = '0';
        } else {
            // Stays visible (opacity 1) otherwise (from the top of the page down)
            floatingSnowContainer.style.opacity = '1';
        }


        // --- MOVEMENT CONTROL (Only for Parallax Layer) ---
        // Snow movement stops entirely past the fade-out point
        if (scrollPosition < triggerFadeOut) {
             parallaxSnowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
        } else {
            // Holds the parallax layer fixed once the effect is over
            parallaxSnowLayer.style.transform = `translateY(${triggerFadeOut * speed}px)`;
        }
    }

    window.addEventListener('scroll', updateSnow);
});
