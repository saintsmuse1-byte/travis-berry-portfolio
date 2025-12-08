document.addEventListener('DOMContentLoaded', () => {
    // 1. VIDEO HOVER PLAYBACK
    const videoContainer = document.querySelector('.video-hover-container');
    const video = document.querySelector('.hover-video');

    if (videoContainer && video) {
        videoContainer.addEventListener('mouseenter', () => video.play());
        videoContainer.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Reset to start
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
    }, { rootMargin: '0px 0px -15% 0px' });

    document.querySelectorAll('.art-item').forEach(item => observer.observe(item));

    // 3. SNOW LOGIC
    const snowContainer = document.querySelector('.snow-container');
    const snowLayer = document.getElementById('snow-layer');
    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY;
        if (scrollPos > 500 && scrollPos < 1500) { snowContainer.style.opacity = '1'; } 
        else { snowContainer.style.opacity = '0'; }
        snowLayer.style.transform = `translateY(${scrollPos * 0.08}px)`;
    });
});
