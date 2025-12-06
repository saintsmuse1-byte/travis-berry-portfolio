document.addEventListener('DOMContentLoaded', function() {
    // 1. Elements
    const snowContainer = document.querySelector('.snow-container'); // Controls the fade-in/out
    const snowLayer = document.getElementById('snow-layer'); // Controls the movement

    // 2. Settings
    const speed = 0.08; // Very slow speed for gentle fall
    const triggerPoint = 700; // Snow appears only after 700px of scroll

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        // --- APPEARANCE CONTROL ---
        if (scrollPosition > triggerPoint) {
            // Fades the snow in smoothly once the trigger point is passed
            snowContainer.style.opacity = '1';
        } else {
            // Snow is invisible (opacity 0)
            snowContainer.style.opacity = '0';
        }

        // --- MOVEMENT CONTROL ---
        // Applies movement regardless of opacity, pulling it up slowly (0.08)
        snowLayer.style.transform = `translateY(${scrollPosition * speed}px)`;
    }

    window.addEventListener('scroll', updateSnow);
});
