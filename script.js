document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    const snowContainer = document.querySelector('.snow-container');
    const snowLayer = document.getElementById('snow-layer');

    // 2. Settings
    const speed = 0.08; 
    const triggerFadeIn = 700;   // Snow appears after 700px of scroll
    const triggerFadeOut = 1200; // Snow starts disappearing after 1200px of scroll

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // --- APPEARANCE AND FADE-OUT CONTROL ---
        if (scrollPosition > triggerFadeOut) {
            // Fades OUT completely before the white section
            snowContainer.style.opacity = '0';
        } else if (scrollPosition > triggerFadeIn) {
            // Snow is fully visible
            snowContainer.style.opacity = '1';
        } else {
            // Snow is invisible (at the top of the page)
            snowContainer.style.opacity = '0';
        }

        // --- MOVEMENT CONTROL ---
        // Snow movement stops entirely past the fade-out point
        if (scrollPosition < triggerFadeOut) {
             snowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
        } else {
            // This holds the snow layer fixed once the effect is over
            snowLayer.style.transform = `translateY(${triggerFadeOut * speed}px)`;
        }
    }

    window.addEventListener('scroll', updateSnow);
});
