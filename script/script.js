const canvas = document.getElementById("techCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffc6";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = index + 1; j < particleCount; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = "rgba(0, 255, 198, 0.1)";
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(draw);
}

draw();

/* Navigation */

function showLogoName() {
    let headerTitle = document.createElement("p");
    headerTitle.className = "header__title";
    headerTitle.textContent = "Portfolio";
    
    headerTitle.style.fontSize = "25px";
    headerTitle.style.position = "absolute";
    headerTitle.style.left = "50%";
    headerTitle.style.top = "5%";
    headerTitle.style.transform = "translateX(-50%)";

    let headerNavLinks = document.querySelector("ul.header__nav-links");

    if (headerNavLinks) {
        headerNavLinks.prepend(headerTitle);
    } else {
        console.error("Navigation links container not found!");
    }
}
