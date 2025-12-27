import React, { StrictMode, useRef, useEffect } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

// --- 1. REACT SNOWFLAKE ENGINE (Hero Section) ---
const SnowflakePatternMap = { Dot: 0, Branches: 1, Spearheads: 2, Asterisk: 3 };

function InteractiveSnowfall() {
    const canvasRef = useRef(null);
    const cursor = useRef({ radius: 80 }); // Slightly bigger push radius
    const frameRef = useRef(0);
    const snowflakes = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const sprites = [];
        for (let s = 0; s <= 3; ++s) { sprites.push(new SnowflakeSprite(s)); }

        const animate = () => {
            const { width, height } = getCanvas();
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 0.6;
            snowflakes.current.forEach((flake) => {
                flake.update(cursor.current, width, height);
                flake.draw(ctx);
            });
            frameRef.current = requestAnimationFrame(animate);
        };

        const createSnowflakes = () => {
            const { width, height } = getCanvas();
            const snowflakeCount = Math.min(Math.round(width * height / 1000), 400);
            snowflakes.current = [];
            for (let i = 0; i < snowflakeCount; i++) {
                const radius = Utils.random(2, 5);
                const pattern = Math.round(Utils.random(0, 3));
                snowflakes.current.push(new Snowflake(width, height, radius, sprites[pattern].canvas));
            }
        };

        const getCanvas = () => {
            const { devicePixelRatio } = window;
            return { width: canvas.width / devicePixelRatio, height: canvas.height / devicePixelRatio };
        };

        const resize = () => {
            const { devicePixelRatio, innerWidth, innerHeight } = window;
            canvas.width = innerWidth * devicePixelRatio;
            canvas.height = innerHeight * devicePixelRatio;
            canvas.style.width = innerWidth + "px";
            canvas.style.height = innerHeight + "px";
            ctx.scale(devicePixelRatio, devicePixelRatio);
            createSnowflakes();
        };

        const handleMove = (e) => {
            cursor.current.x = e.clientX;
            cursor.current.y = e.clientY;
        };

        resize();
        animate();
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", handleMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handleMove);
            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ pointerEvents: 'none' }} />;
}

// --- SUPPORT CLASSES FOR ENGINE ---
class Snowflake {
    constructor(width, height, radius, pattern) {
        this.x = Utils.random(0, width);
        this.y = Utils.random(0, height);
        this.radius = radius;
        this.pattern = pattern;
        this.rotation = Utils.random(0, Math.PI);
        this.rotationSpeed = Utils.random(-0.02, 0.02);
        this.speedX = Utils.random(-0.5, 0.5);
        this.speedY = Utils.random(1, 3);
        this.density = 30;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.pattern, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
    }
    update(cursor, width, height) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (cursor.x) {
            const dx = cursor.x - this.x;
            const dy = cursor.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < cursor.radius) {
                const force = (cursor.radius - dist) / cursor.radius;
                this.x -= (dx / dist) * force * this.density;
                this.y -= (dy / dist) * force * this.density;
            }
        }
        if (this.y > height + 10) { this.y = -10; this.x = Utils.random(0, width); }
    }
}

class SnowflakeSprite {
    constructor(patternIndex) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        const radius = 10;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = radius * 2 * dpr;
        this.canvas.height = radius * 2 * dpr;
        this.ctx.scale(dpr, dpr);
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "round";
        
        this.ctx.translate(radius, radius);
        if (patternIndex === 0) {
            this.ctx.beginPath(); this.ctx.arc(0,0, radius/2, 0, Math.PI*2); this.ctx.fill();
        } else {
            for (let i = 0; i < 6; i++) {
                this.ctx.rotate(Math.PI/3);
                this.ctx.beginPath(); this.ctx.moveTo(0,0); this.ctx.lineTo(0, radius-1); this.ctx.stroke();
            }
        }
    }
}

class Utils {
    static random(min, max) { return min + Math.random() * (max - min); }
}

// --- 2. INITIALIZE REACT ---
const rootEl = document.getElementById("root");
if (rootEl) {
    createRoot(rootEl).render(<StrictMode><InteractiveSnowfall /></StrictMode>);
}

// --- 3. PORTFOLIO LOGIC (Runner & Carousel) ---
document.addEventListener('DOMContentLoaded', () => {
    // RUNNER BOY
    const overlay = document.getElementById('runner-overlay');
    const boy = document.getElementById('boy-container');
    const frames = document.querySelectorAll('.boy-frame');
    let lastFrame = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const heroH = window.innerHeight;
        let progress = Math.min(Math.max(y / heroH, 0), 1);
        
        if (overlay) overlay.style.opacity = (progress > 0 && progress < 0.9) ? 1 : 0;
        if (boy) {
            const bx = -250 + (window.innerWidth + 500) * progress;
            const by = 400 + (250 * Math.pow(progress, 2));
            boy.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        }
        
        const fIdx = Math.floor(progress * 25) % frames.length;
        if (frames[fIdx] && fIdx !== lastFrame) {
            frames[lastFrame].classList.remove('active');
            frames[fIdx].classList.add('active');
            lastFrame = fIdx;
        }
    });

    // CAROUSEL
    const track = document.getElementById('carousel-track');
    let slideIdx = 0;
    const next = document.getElementById('next-arrow');
    const prev = document.getElementById('prev-arrow');

    if (next && prev && track) {
        next.onclick = () => { slideIdx = (slideIdx + 1) % 6; track.style.transform = `translateX(-${slideIdx * 16.666}%)`; };
        prev.onclick = () => { slideIdx = (slideIdx - 1 + 6) % 6; track.style.transform = `translateX(-${slideIdx * 16.666}%)`; };
    }
});
