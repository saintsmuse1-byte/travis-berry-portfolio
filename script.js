document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    // The Parallax System (The large snowflakes image)
    const parallaxSnowContainer = document.querySelector('.snow-container'); 
    const parallaxSnowLayer = document.getElementById('snow-layer'); 
    
    // The Floating System (The new CSS-only snowflakes)
    const floatingSnowContainer = document.querySelector('.snowflakes'); 
    
    // 2. Settings
    const speed = 0.08; 
    const triggerFadeIn = 700;   // Where the Parallax snow starts appearing
    const triggerFadeOut = 1200; // Where BOTH snow systems disappear

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // -------------------------------------------------------------
        // --- VISIBILITY CONTROL FOR PARALLAX SNOW (Scroll-triggered) ---
        // Fades the large snow image in and out strictly between 700px and 1200px.
        // -------------------------------------------------------------
        if (scrollPosition > triggerFadeOut || scrollPosition < triggerFadeIn) {
            // Invisible if before the fade-in point or past the fade-out point
            parallaxSnowContainer.style.opacity = '0';
        } else {
            // Fully visible between the two points
            parallaxSnowContainer.style.opacity = '1';
        }

        // ---------------------------------------------------------------
        // --- VISIBILITY CONTROL FOR FLOATING SNOW (Continuous effect) ---
        // Stays visible from the top (0px) and only disappears at the white section.
        // ---------------------------------------------------------------
        if (scrollPosition > triggerFadeOut) {
            // Fades OUT when reaching the white section trigger
            floatingSnowContainer.style.opacity = '0';
        } else {
            // Stays visible (opacity 1) from the top down to the trigger point
            floatingSnowContainer.style.opacity = '1';
        }


        // --------------------------------------------------------------
        // --- MOVEMENT CONTROL (Only for Parallax Layer) ---
        // This makes the large snow image move slower than the scroll.
        // --------------------------------------------------------------
        if (scrollPosition < triggerFadeOut) {
             // Calculate movement based on scroll position
             parallaxSnowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
        } else {
            // Holds the layer fixed once the effect is over
            parallaxSnowLayer.style.transform = `translateY(${triggerFadeOut * speed}px)`;
        }
        // The floating snowflakes handle their movement entirely via CSS @keyframes.
    }

    window.addEventListener('scroll', updateSnow);
});
