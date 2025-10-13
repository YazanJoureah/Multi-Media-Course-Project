document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".navigation");

  if (navToggle && navigation) {
    navToggle.addEventListener("click", function () {
      navigation.classList.toggle("active");
      navToggle.classList.toggle("active");

      // Animate hamburger icon
      const spans = navToggle.querySelectorAll("span");
      if (navigation.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navigation.classList.contains("active")) {
        navigation.classList.remove("active");
        navToggle.classList.remove("active");

        const spans = navToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  });

  // Scroll Progress Bar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / documentHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateProgressBar);
  window.addEventListener("resize", updateProgressBar);

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      }
    });
  }

  // Initialize reveal elements
  revealElements.forEach((element) => {
    element.classList.remove("active");
  });

  window.addEventListener("scroll", checkReveal);
  window.addEventListener("load", checkReveal);

  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // AI Content Badge Animation
  const aiBadges = document.querySelectorAll(".ai-badge");
  aiBadges.forEach((badge) => {
    badge.addEventListener("mouseenter", function () {
      this.style.animation = "pulse 0.5s ease";
    });

    badge.addEventListener("animationend", function () {
      this.style.animation = "pulse 2s infinite";
    });
  });

  // Feature Card Interactive Effects
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Performance monitoring
  let loadTime =
    performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log("Page load time: " + loadTime + "ms");

  // Service Worker Registration (for PWA)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log("ServiceWorker registration successful");
        })
        .catch(function (error) {
          console.log("ServiceWorker registration failed: ", error);
        });
    });
  }
});
