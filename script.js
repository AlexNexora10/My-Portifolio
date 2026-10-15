
"use strict";

/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function openMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Close mobile menu when changing to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });
}

/* =========================================
   2. DARK / LIGHT THEME
========================================= */

const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme, savePreference = true) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  if (themeToggle) {
    themeToggle.textContent = isLight ? "🌙" : "☀️";

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );

    themeToggle.setAttribute("aria-pressed", String(isLight));
  }

  if (savePreference) {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
      // Theme still works if storage is unavailable.
    }
  }
}

let savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
  savedTheme = "dark";
}

setTheme(savedTheme === "light" ? "light" : "dark", false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");

    setTheme(isLight ? "dark" : "light");
  });
}

/* =========================================
   3. HERO TYPING ANIMATION
========================================= */

const typingText = document.getElementById("typing-text");

const titles = [
  "Software Engineering Student",
  "Aspiring Full-Stack Developer",
  "Web Development Learner",
  "Future Software Entrepreneur"
];

let titleIndex = 0;
let characterIndex = 0;
let deleting = false;
let typingTimer = null;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function typeEffect() {
  if (!typingText) return;

  const currentTitle = titles[titleIndex];

  if (!deleting) {
    characterIndex++;

    typingText.textContent = currentTitle.slice(0, characterIndex);

    if (characterIndex >= currentTitle.length) {
      deleting = true;
      typingTimer = setTimeout(typeEffect, 1600);
      return;
    }
  } else {
    characterIndex--;

    typingText.textContent = currentTitle.slice(0, characterIndex);

    if (characterIndex <= 0) {
      deleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  typingTimer = setTimeout(typeEffect, deleting ? 35 : 75);
}

if (typingText) {
  if (prefersReducedMotion.matches) {
    typingText.textContent = titles[0];
  } else {
    typeEffect();
  }
}

// Respect changes to the operating system's motion preference.
prefersReducedMotion.addEventListener?.("change", (event) => {
  if (!typingText) return;

  if (event.matches) {
    clearTimeout(typingTimer);
    typingText.textContent = titles[0];
  } else {
    titleIndex = 0;
    characterIndex = 0;
    deleting = false;
    typeEffect();
  }
});

/* =========================================
   4. PROJECT FILTERS
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );

  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isSelected = item === button;

      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach((card) => {
      const category = card.dataset.category;

      const shouldShow =
        selectedFilter === "all" ||
        category === selectedFilter;

      card.classList.toggle("hidden", !shouldShow);
      card.setAttribute("aria-hidden", String(!shouldShow));
    });
  });
});

/* =========================================
   5. CONTACT FORM
========================================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    if (!nameInput || !emailInput || !subjectInput || !messageInput) {
      formStatus.textContent = "The contact form fields could not be found.";
      formStatus.classList.add("error");
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (
      name.length < 2 ||
      !emailInput.validity.valid ||
      subject.length === 0 ||
      message.length < 10
    ) {
      formStatus.textContent =
        "Please complete all fields correctly.";
      formStatus.classList.add("error");
      return;
    }

    /*
      Replace this placeholder with your actual email address.
      Example: alex@example.com
    */
    const recipient = "YOUR_EMAIL@example.com";

    if (
      recipient === "YOUR_EMAIL@example.com" ||
      !recipient.includes("@")
    ) {
      formStatus.textContent =
        "Please configure your recipient email in script.js first.";
      formStatus.classList.add("error");
      return;
    }

    const emailSubject = encodeURIComponent(subject);

    const emailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Sender email: ${email}\n\n` +
      `Message:\n${message}`
    );

    const mailtoLink =
      `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    formStatus.textContent =
      "Opening your email application. Send the prepared message to complete delivery.";
    formStatus.classList.add("success");

    window.location.href = mailtoLink;
  });
}

/* =========================================
   6. BACK TO TOP BUTTON
========================================= */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  function updateBackToTop() {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  });
}

/* =========================================
   7. ACTIVE NAVIGATION BY SECTION
========================================= */

const sections = document.querySelectorAll("main section[id]");

function setActiveNavigation(sectionId) {
  navItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        setActiveNavigation(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================================
   8. CURRENT YEAR IN FOOTER
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   9. CLOSE MENU ON HASH NAVIGATION
========================================= */

window.addEventListener("hashchange", closeMenu);

/* =========================================
   10. INITIAL NAVIGATION STATE
========================================= */

function initializeNavigation() {
  const currentHash = window.location.hash;

  if (currentHash && document.querySelector(currentHash)) {
    setActiveNavigation(currentHash.slice(1));
  } else {
    setActiveNavigation("home");
  }
}

initializeNavigation();
