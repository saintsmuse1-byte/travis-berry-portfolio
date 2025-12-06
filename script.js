document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    // The Parallax System
    const parallaxSnowContainer = document.querySelector('.snow-container'); 
    const parallaxSnowLayer = document.getElementById('snow-layer'); 
    
    // The NEW Floating System
    const floatingSnowContainer = document.querySelector('.snowflakes'); // <--- NEW ELEMENT
    
    // 2. Settings
    const speed = 0.08; 
    const triggerFadeIn = 700;   // Snow appears after 700px of scroll
    const triggerFadeOut = 1200; // Snow starts disappearing after 1200px of scroll

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // --- APPEARANCE AND FADE-OUT CONTROL for BOTH snow layers ---
        if (scrollPosition > triggerFadeOut) {
            // Fades OUT completely before the white section
            parallaxSnowContainer.style.opacity = '0';
            floatingSnowContainer.style.opacity = '0'; // <--- APPLIES FADE OUT
        } else if (scrollPosition > triggerFadeIn) {
            // Snow is fully visible
            parallaxSnowContainer.style.opacity = '1';
            floatingSnowContainer.style.opacity = '1'; // <--- APPLIES FADE IN
        } else {
            // Snow is invisible (at the top of the page)
            parallaxSnowContainer.style.opacity = '0';
            floatingSnowContainer.style.opacity = '0'; // <--- INVISIBLE AT TOP
        }

        // --- MOVEMENT CONTROL (Only for Parallax Layer) ---
        // Snow movement stops entirely past the fade-out point
        if (scrollPosition < triggerFadeOut) {
             parallaxSnowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
        } else {
            // This holds the parallax layer fixed once the effect is over
            parallaxSnowLayer.style.transform = `translateY(${triggerFadeOut * speed}px)`;
        }
        
        // NOTE: The floatingSnowContainer handles its own movement via CSS @keyframes,
        // so we only control its visibility (opacity) here.
    }

    window.addEventListener('scroll', updateSnow);
});
