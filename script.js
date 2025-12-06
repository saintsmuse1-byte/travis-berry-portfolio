document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    // The Parallax System
    const parallaxSnowContainer = document.querySelector('.snow-container'); 
    const parallaxSnowLayer = document.getElementById('snow-layer'); 
    
    // The Floating System
    const floatingSnowContainer = document.querySelector('.snowflakes'); 
    
    // 2. Settings
    const speed = 0.08; 
    const triggerFadeIn = 700;   // When Parallax starts
    const triggerFadeOut = 1200; // When BOTH snow systems disappear

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // --- VISIBILITY CONTROL FOR PARALLAX SNOW (Scroll-triggered layer) ---
        if (scrollPosition > triggerFadeOut || scrollPosition < triggerFadeIn) {
            // Fades OUT when scrolling back up OR when scrolling past the white trigger
            parallaxSnowContainer.style.opacity = '0';
        } else {
            // Fades IN only between the two trigger points
            parallaxSnowContainer.style.opacity = '1';
        }

        // --- VISIBILITY CONTROL FOR FLOATING SNOW (Continuous layer) ---
        if (scrollPosition > triggerFadeOut) {
            // Fades OUT only when reaching the white trigger point
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
            // This holds the parallax layer fixed once the effect is over
            parallaxSnowLayer.style.transform = `translateY(${triggerFadeOut * speed}px)`;
        }
    }

    window.addEventListener('scroll', updateSnow);
});
