// Scroll to top on page reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Optional: Clear session-related data if needed
sessionStorage.clear();

/* Technology Background */

sessionStorage.clear();

const canvas = document.getElementById("techCanvas");
const ctx = canvas.getContext("2d");

// Function to resize the canvas to fit the window
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

draw(); // Start drawing particles

/* Burger Navigation Logo */

// Function to show the logo name in the burger navigation
function showLogoName() {
    if (window.innerWidth >= 600) return;

    if (!document.querySelector("p.header__title.new")) {
        let headerTitle = document.createElement("p");
        headerTitle.className = "header__title new";
        headerTitle.textContent = "Portfolio";

        // Set the style of the logo name
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
}

// Function to remove the logo name if window width is >= 600
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

    let isClicking = false; // Tracks if the user is clicking a link

    // Smooth scrolling when a navigation link is clicked
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            isClicking = true; // Disable scroll-based highlighting temporarily
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            const headerHeight = header.offsetHeight;

            // Smooth scroll to the section
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: "smooth",
            });

            // Mark the clicked link as active
            navLinks.forEach((nav) => nav.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Highlight active link based on scroll position
    const highlightActiveLink = () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Determine the section currently in view
            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                current = section.getAttribute("id");
            }
        });

        // Update the active class for navigation links
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    };

    // Listen for scrolling
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        if (isClicking) {
            // Reset click-based marking if scrolling happens
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isClicking = false; // Re-enable scroll-based behavior after scrolling stabilizes
            }, 100); // Short delay to avoid flickering during rapid scrolling
        }
        if (!isClicking) {
            highlightActiveLink(); // Apply scroll-based highlighting only if not clicking
        }
    });

    // Reveal sections as they come into view
    const revealSections = () => {
        const windowHeight = window.innerHeight;

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            const revealPoint = 150;

            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });
    };

    // Attach scroll event listener
    window.addEventListener("scroll", revealSections);

    // Initial setup
    revealSections();
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

let submitButton = document.querySelector(".contact__button");

submitButton.addEventListener("click", function () {
    const nameField = document.querySelector(".contact__name");
    const emailField = document.querySelector(".contact__email");
    const messageField = document.querySelector(".contact__message");
 
    let errorMessage = "";

    if (nameField.value.trim() === "") {
        alert(errorMessage = "Name is required.");
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value.trim() === "") {
        alert(errorMessage = "Email is required.");
        return
    } else if (!emailRegex.test(emailField.value.trim())) {
        alert(errorMessage = "Please enter a valid email address.");
        return
    }

    if (messageField.value.trim() === "") {
        alert(errorMessage = "Message cannot be empty.");
        return
    }

    alert("Form submitted successfully!");

    nameField.value = "";
    emailField.value = "";
    messageField.value = "";
});
