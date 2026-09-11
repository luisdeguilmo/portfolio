// Scroll to top on page reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

sessionStorage.clear();

/* Technology Background */

const canvas = document.getElementById("techCanvas");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const particleCount = 90;
// Reduced-motion still gets a slow, gentle drift instead of a frozen frame.
const speedFactor = prefersReducedMotion ? 0.15 : 1;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() * 1 - 0.5) * speedFactor,
        vy: (Math.random() * 1 - 0.5) * speedFactor,
    });
}

let animationId = null;
let isTabVisible = !document.hidden;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#f5a623";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = index + 1; j < particleCount; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 110) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = "rgba(94, 234, 212, 0.12)";
                ctx.stroke();
            }
        }
    });

    animationId = requestAnimationFrame(draw);
}

function startAnimation() {
    if (!animationId && isTabVisible) {
        animationId = requestAnimationFrame(draw);
    }
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

startAnimation();

// Pause the animation when the tab is hidden to save CPU/battery
document.addEventListener("visibilitychange", () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
        startAnimation();
    } else {
        stopAnimation();
    }
});

/* Burger Navigation Logo */

function showLogoName() {
    if (window.innerWidth >= 600) return;

    if (!document.querySelector("p.header__title.new")) {
        let headerTitle = document.createElement("p");
        headerTitle.className = "header__title new";
        headerTitle.textContent = "Luis Deguilmo";

        headerTitle.style.fontSize = "20px";
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
}

function removeLogoNameOnResize() {
    let elem = document.querySelector("p.header__title.new");
    if (window.innerWidth >= 600 && elem) {
        elem.remove();
    }
}

window.addEventListener("resize", removeLogoNameOnResize);

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".header__nav-link");
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");

    let isClicking = false;

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            isClicking = true;
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            const headerHeight = header.offsetHeight;

            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });

            navLinks.forEach((nav) => nav.classList.remove("active"));
            link.classList.add("active");
        });
    });

    const highlightActiveLink = () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    };

    let scrollTimeout;
    window.addEventListener("scroll", () => {
        if (isClicking) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isClicking = false;
            }, 100);
        }
        if (!isClicking) {
            highlightActiveLink();
        }
    });

    highlightActiveLink();
});

// Close navigation drawer when a link is clicked
const navLinks = document.querySelectorAll(".header__nav-link");
const menuCheckbox = document.querySelector('input[type="checkbox"]');

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (menuCheckbox) menuCheckbox.checked = false;
    });
});

/* Form Validation */

const submitButton = document.querySelector(".contact__button");
const statusEl = document.querySelector(".contact__status");

function setStatus(message, state) {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
}

if (submitButton) {
    submitButton.addEventListener("click", function () {
        const nameField = document.querySelector(".contact__name");
        const emailField = document.querySelector(".contact__email");
        const messageField = document.querySelector(".contact__message");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nameField.value.trim() === "") {
            setStatus("Please enter your name.", "error");
            nameField.focus();
            return;
        }

        if (emailField.value.trim() === "") {
            setStatus("Please enter your email.", "error");
            emailField.focus();
            return;
        }

        if (!emailRegex.test(emailField.value.trim())) {
            setStatus("Please enter a valid email address.", "error");
            emailField.focus();
            return;
        }

        if (messageField.value.trim() === "") {
            setStatus("Please write a short message.", "error");
            messageField.focus();
            return;
        }

        setStatus("Message sent — thanks for reaching out!", "success");

        nameField.value = "";
        emailField.value = "";
        messageField.value = "";
    });
}