document.addEventListener('DOMContentLoaded', function() {
    const farLayer = document.getElementById('snow-layer-far');
    const midLayer = document.getElementById('snow-layer-mid');
    const closeLayer = document.getElementById('snow-layer-close');

    const speedFar = 0.2; 
    const speedMid = 0.4; 
    const speedClose = 0.6; 

    function updateSnow() {
        const scrollPosition = window.pageYOffset;

        farLayer.style.transform = `translateY(${scrollPosition * speedFar}px)`;
        midLayer.style.transform = `translateY(${scrollPosition * speedMid}px)`;
        closeLayer.style.transform = `translateY(${scrollPosition * speedClose}px)`;
    }

    window.addEventListener('scroll', updateSnow);
    updateSnow();
});
