const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const mainContent = document.getElementById("mainContent");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const musicBtn = document.getElementById("musicBtn");

let width;
let height;

let particles = [];
let stars = [];

let started = false;

let mouse = {
    x: 0,
    y: 0
};

let animationTime = 0;


/* --------------------------------
   RESIZE
-------------------------------- */

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    createStars();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


/* --------------------------------
   STARS
-------------------------------- */

function createStars() {

    stars = [];

    const count =
        Math.floor(
            (width * height) / 5500
        );

    for (let i = 0; i < count; i++) {

        stars.push({

            x: Math.random() * width,

            y: Math.random() * height,

            size:
                Math.random() * 1.5 + 0.2,

            alpha:
                Math.random() * 0.8 + 0.1,

            twinkle:
                Math.random() * Math.PI * 2
        });
    }
}


/* --------------------------------
   DRAW STARS
-------------------------------- */

function drawStars() {

    for (const star of stars) {

        const alpha =
            star.alpha +
            Math.sin(
                animationTime * 0.002 +
                star.twinkle
            ) * 0.25;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${Math.max(0, alpha)})`;

        ctx.fill();
    }
}


/* --------------------------------
   HEART POINT
-------------------------------- */

function heartPoint(t, scale) {

    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x * scale,
        y: -y * scale
    };
}


/* --------------------------------
   CREATE HEART FIREWORK
-------------------------------- */

function createHeartFirework(
    centerX,
    centerY
) {

    const count = 180;

    const scale =
        Math.min(width, height) *
        0.012;

    for (let i = 0; i < count; i++) {

        const t =
            Math.random() *
            Math.PI * 2;

        const point =
            heartPoint(
                t,
                scale
            );

        const targetX =
            centerX + point.x;

        const targetY =
            centerY + point.y;

        const angle =
            Math.atan2(
                targetY - centerY,
                targetX - centerX
            );

        const distance =
            Math.sqrt(
                Math.pow(
                    targetX - centerX,
                    2
                ) +
                Math.pow(
                    targetY - centerY,
                    2
                )
            );

        particles.push({

            x: centerX,

            y: centerY,

            targetX: targetX,

            targetY: targetY,

            vx:
                Math.cos(angle) *
                (distance / 35),

            vy:
                Math.sin(angle) *
                (distance / 35),

            size:
                Math.random() * 2.1 +
                0.5,

            life: 1,

            decay:
                Math.random() *
                0.006 +
                0.003,

            hue:
                Math.random() < 0.75
                    ? "255,70,140"
                    : "255,220,120"
        });
    }


    // center sparkle particles

    for (let i = 0; i < 50; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            Math.random() * 4 + 1;

        particles.push({

            x: centerX,

            y: centerY,

            targetX: centerX,

            targetY: centerY,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                Math.random() * 2 + 0.5,

            life: 1,

            decay:
                Math.random() *
                0.012 +
                0.008,

            hue:
                "255,255,255"
        });
    }
}


/* --------------------------------
   UPDATE PARTICLES
-------------------------------- */

function updateParticles() {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.vy += 0.012;

        p.life -= p.decay;

        if (p.life <= 0) {

            particles.splice(
                i,
                1
            );
        }
    }
}


/* --------------------------------
   DRAW PARTICLES
-------------------------------- */

function drawParticles() {

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    for (const p of particles) {

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${p.hue},${p.life})`;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
            `rgba(${p.hue},0.8)`;

        ctx.fill();
    }

    ctx.restore();
}


/* --------------------------------
   RANDOM FIREWORK
-------------------------------- */

function randomFirework() {

    const x =
        Math.random() *
        width;

    const y =
        Math.random() *
        height *
        0.65;

    createHeartFirework(
        x,
        y
    );
}


/* --------------------------------
   MAIN LOOP
-------------------------------- */

function animate() {

    animationTime++;

    ctx.fillStyle =
        "rgba(2,0,6,0.18)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    drawStars();

    updateParticles();

    drawParticles();

    requestAnimationFrame(
        animate
    );
}


/* --------------------------------
   START EXPERIENCE
-------------------------------- */

function startExperience() {

    if (started) return;

    started = true;

    startScreen.classList.add(
        "hide"
    );

    mainContent.classList.add(
        "show"
    );

    setTimeout(() => {

        createHeartFirework(
            width / 2,
            height / 2
        );

    }, 500);


    setTimeout(() => {
        randomFirework();
    }, 1800);

    setTimeout(() => {
        randomFirework();
    }, 3300);
}


/* --------------------------------
   START BUTTON
-------------------------------- */

startBtn.addEventListener(
    "click",
    startExperience
);


/* --------------------------------
   CLICK ANYWHERE
-------------------------------- */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            musicBtn ||
            event.target ===
            restartBtn ||
            event.target ===
            fullscreenBtn ||
            event.target ===
            startBtn
        ) {
            return;
        }

        if (!started) {

            startExperience();

            return;
        }

        createHeartFirework(
            event.clientX,
            event.clientY
        );
    }
);


/* --------------------------------
   DRAG
-------------------------------- */

document.addEventListener(
    "mousemove",
    function (event) {

        mouse.x =
            event.clientX;

        mouse.y =
            event.clientY;
    }
);


/* --------------------------------
   RESTART
-------------------------------- */

restartBtn.addEventListener(
    "click",
    function () {

        particles = [];

        started = false;

        startScreen.classList.remove(
            "hide"
        );

        mainContent.classList.remove(
            "show"
        );
    }
);


/* --------------------------------
   FULLSCREEN
-------------------------------- */

fullscreenBtn.addEventListener(
    "click",
    async function () {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();
            }

        } catch (error) {

            console.log(error);
        }
    }
);


/* --------------------------------
   MUSIC BUTTON
-------------------------------- */

let audioContext = null;
let musicOn = false;

musicBtn.addEventListener(
    "click",
    function () {

        musicOn = !musicOn;

        musicBtn.innerHTML =
            musicOn
                ? "<span>🔊</span>"
                : "<span>🎵</span>";

        /*
            Simple ambient sound.
            Browser allows audio after user interaction.
        */

        if (musicOn) {

            startAmbientSound();

        } else {

            stopAmbientSound();
        }
    }
);


let oscillator = null;
let gainNode = null;

function startAmbientSound() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    if (oscillator) return;

    oscillator =
        audioContext.createOscillator();

    gainNode =
        audioContext.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.value =
        220;

    gainNode.gain.value =
        0.025;

    oscillator.connect(
        gainNode
    );

    gainNode.connect(
        audioContext.destination
    );

    oscillator.start();
}


function stopAmbientSound() {

    if (!oscillator) return;

    oscillator.stop();

    oscillator.disconnect();

    gainNode.disconnect();

    oscillator = null;
    gainNode = null;
}


/* --------------------------------
   INITIALIZE
-------------------------------- */

resizeCanvas();

requestAnimationFrame(
    animate
);