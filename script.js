/* =========================
   BASIC SNOW SYSTEM
   ========================= */

function Snow(container, options = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    container.appendChild(canvas);

    let w, h;
    function resize() {
        w = canvas.width = container.offsetWidth;
        h = canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const flakes = [];
    const maxFlakes = options.maxFlakes || 180;
    const repelCircle = options.repelCircle || null;
    const mouseRepel = options.mouseRepel || false;

    const mouse = { x: 0, y: 0 };
    if (mouseRepel) {
        window.addEventListener("mousemove", e => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
    }

    function addFlake(xOverride = null) {
        flakes.push({
            x: xOverride ?? Math.random() * w,
            y: Math.random() * -h,
            r: Math.random() * 1.4 + 0.6,
            vy: Math.random() * 0.6 + 0.4,
            vx: 0
        });
    }

    while (flakes.length < maxFlakes) addFlake();

    function update() {
        ctx.clearRect(0, 0, w, h);

        flakes.forEach(f => {

            /* PROFILE IMAGE DEFLECTION */
            if (repelCircle) {
                const dx = f.x - repelCircle.x;
                const dy = f.y - repelCircle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < repelCircle.r) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    f.x = repelCircle.x + nx * repelCircle.r;
                    f.vx += nx * 0.3;   // equal left/right push
                    f.vy += 0.2;
                }
            }

            /* MOUSE REPEL (ABOUT ONLY) */
            if (mouseRepel) {
                const dx = f.x - mouse.x;
                const dy = f.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    f.vx += dx / dist * 0.2;
                }
            }

            f.y += f.vy;
            f.x += f.vx;
            f.vx *= 0.92;

            if (f.y > h) {
                f.y = -10;
                f.x = Math.random() * w;
                f.vx = 0;
            }

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.fill();
        });

        requestAnimationFrame(update);
    }

    update();
}

/* =========================
   HERO SNOW (PROFILE AWARE)
   ========================= */

const profile = document.querySelector(".circle-wrapper");
const heroSnow = document.getElementById("hero-snow");

const rect = profile.getBoundingClientRect();
const heroRect = heroSnow.getBoundingClientRect();

Snow(heroSnow, {
    maxFlakes: 160,
    repelCircle: {
        x: rect.left - heroRect.left + rect.width / 2,
        y: rect.top - heroRect.top + rect.height / 2,
        r: rect.width / 2
    }
});

/* =========================
   ABOUT SNOW (MOUSE REPEL)
   ========================= */

Snow(document.getElementById("about-snow"), {
    maxFlakes: 140,
    mouseRepel: true
});

/* =========================
   RUNNER EXIT (UNCHANGED)
   ========================= */

const frames = document.querySelectorAll(".boy-frame");
let frameIndex = 0;
let runnerX = -200;

setInterval(() => {
    frames.forEach(f => f.classList.remove("active"));
    frames[frameIndex % frames.length].classList.add("active");
    frameIndex++;
}, 120);

function moveRunner() {
    runnerX += 2;
    document.getElementById("runner-overlay").style.left = runnerX + "px";
    if (runnerX < window.innerWidth + 200) requestAnimationFrame(moveRunner);
}
moveRunner();
