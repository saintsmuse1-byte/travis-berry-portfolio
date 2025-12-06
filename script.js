document.addEventListener('DOMContentLoaded', function() {
    // Only target the one remaining layer
    const snowLayer = document.getElementById('snow-layer');

    // Define one scroll speed (we'll make it medium/fast)
    const speed = 0.1; 

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // Apply movement to the single layer
        snowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
    }

    window.addEventListener('scroll', updateSnow);
});
