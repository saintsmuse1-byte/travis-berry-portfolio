document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RUNNER BOY LOGIC (EXIT SCREEN)
    // ==========================================
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    const feather = document.getElementById('feather');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const heroSectionHeight = window.innerHeight * 2;
        let progress = y / (heroSectionHeight - window.innerHeight);

        overlay.style.opacity = (progress > 0.01 && progress < 1.3) ? 1 : 0;
        if (progress > 1.4) return;

        const startX = -250;
        const endX = window.innerWidth + 400; // exits fully
        const startY = 150;
        const endY = window.innerHeight - 250;

        const bx = startX + (endX - startX) * progress;
        const by = startY + (endY - startY) * progress - (100 * Math.sin(progress * Math.PI));

        boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        feather.style.transform = `translate3d(${bx - 50}px, ${by + 50}px, 0) rotate(${progress * 720}deg)`;

        const fIdx = Math.floor(progress * 20) % frames.length;
        if (frames[fIdx] && fIdx !== lastFrame) {
            frames[lastFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrame = fIdx;
        }
    });

    // ==========================================
    // 2. CAROUSEL LOGIC (UNCHANGED)
    // ==========================================
    const track = document.getEl
