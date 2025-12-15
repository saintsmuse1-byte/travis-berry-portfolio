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

    // 2. ART REVEAL (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.art-item').forEach(item => observer.observe(item));

    // 3. PARALLAX SNOW SYSTEM
    const snowContainer = document.querySelector('.snow-container');
    const snowLayer = document.getElementById('snow-layer');
    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY;
        // Adjust these triggers to hide snow at the white section
        if (scrollPos > 400 && scrollPos < 1100) { snowContainer.style.opacity = '1'; } 
        else { snowContainer.style.opacity = '0'; }
        snowLayer.style.transform = `translateY(${scrollPos * 0.08}px)`;
    });
});
