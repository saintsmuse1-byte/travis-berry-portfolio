/* ========== SNOW SYSTEM ========== */

class SnowSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.container.appendChild(this.canvas);

        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        this.flakes = [];
        this.mouse = { x: null, y: null };

        this.profileCircle = options.profileCircle || null;
        this.enableMouseRepel = options.mouseRepel || false;

        this.spawnRate = options.spawnRate || 1;

        window.addEventListener("resize", () => this.resize());
        if (this.enableMouseRepel) {
            window.addEventListener("mousemove", e => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createFlake(xOverride = null) {
        return {
            x: xOverride ?? Math.random() * this.width,
            y: -10,
            r: Math.random() * 1.5 + 0.5,
            vy: Math.random() * 0.6 + 0.4,
            vx: 0
        };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.width, this.height);

        /* GLOBAL SPAWN */
        if (Math.random() < this.spawnRate) {
            this.flakes.push(this.createFlake());
        }

        /* PROFILE SHADOW SPAWN (REDUCED) */
        if (this.profileCircle && Math.random() < 0.25) {
            const x = this.profileCircle.x +
                (Math.random() - 0.5) * this.profileCircle.r * 1.2;
            this.flakes.push(this.createFlake(x));
        }

        this.flakes.forEach((f, i) => {
            /* PROFILE COLLISION */
            if (this.profileCircle) {
                const dx = f.x - this.profileCircle.x;
                const dy = f.y - this.profileCircle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.profileCircle.r) {
                    const angle = Math.atan2(dy, dx);
                    f.x = this.profileCircle.x + Math.cos(angle) * this.profileCircle.r;
                    f.vx = Math.cos(angle) * 0.4;   // symmetrical slide
                    f.vy = 0.9;
                }
            }

            /* MOUSE REPEL (ABOUT SECTION) */
            if (this.enableMouseRepel && this.mouse.x !== null) {
                const dx = f.x - this.mouse.x;
                const dy = f.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80) {
                    f.vx += dx / dist * 0.3;
                    f.vy += dy / dist * 0.05;
                }
            }

            f.y += f.vy;
            f.x += f.vx;
            f.vx *= 0.95;

            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(255,255,255,0.9)";
            this.ctx.fill();

            if (f.y > this.height) this.flakes.splice(i, 1);
        });
    }
}

/* HERO SNOW (PROFILE REPEL) */
const heroCircle = document.querySelector(".circle-wrapper").getBoundingClientRect();

new SnowSystem(
    document.getElementById("hero-snow"),
    {
        profileCircle: {
            x: heroCircle.left + heroCircle.width / 2,
            y: heroCircle.top + heroCircle.height / 2,
            r: heroCircle.width / 2
        },
        spawnRate: 0.9
    }
);

/* ABOUT SNOW (MOUSE REPEL) */
new SnowSystem(
    document.getElementById("about-snow"),
    {
        mouseRepel: true,
        spawnRate: 0.8
    }
);

/* RUNNER EXIT ANIMATION */
const frames = document.querySelectorAll(".boy-frame");
let frame = 0;
let pos = -200;

setInterval(() => {
    frames.forEach(f => f.classList.remove("active"));
    frames[frame % frames.length].classList.add("active");
    frame++;
}, 120);

function moveRunner() {
    pos += 2;
    document.getElementById("runner-overlay").style.left = pos + "px";
    if (pos < window.innerWidth + 200) requestAnimationFrame(moveRunner);
}
moveRunner();
