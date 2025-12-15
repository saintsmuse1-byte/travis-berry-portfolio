document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VIDEO HOVER PLAYBACK (Kept functional)
    const vidContainer = document.querySelector('.video-link');
    const video = document.querySelector('.hover-video');

    if (vidContainer && video) {
        vidContainer.addEventListener('mouseenter', () => video.play());
        vidContainer.addEventListener('mouseleave', () => {
            video.pause();
            // Reset video to start when leaving the hover area
            video.currentTime = 0;
        });
    }

    // Art reveal and snow observer logic has been removed for stability and simplicity.
});
