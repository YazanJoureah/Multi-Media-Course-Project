document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".navigation");
  const viewButtons = document.querySelectorAll(".view-btn");

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
  // Create modal element
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-image-container">
        <img class="modal-image" src="" alt="" />
      </div>
      <div class="modal-info">
        <h3 class="modal-title"></h3>
        <p class="modal-description"></p>
        <div class="modal-meta">
          <span class="modal-prompt"></span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add CSS for the modal
  const modalStyles = `
    .image-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .image-modal.active {
      display: block;
      opacity: 1;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
    }
    
    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: white;
      border-radius: 12px;
      max-width: 90%;
      max-height: 90%;
      width: auto;
      height: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
    }
    
    .image-modal.active .modal-content {
      transform: translate(-50%, -50%) scale(1);
    }
    
    .modal-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .modal-close:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }
    
    .modal-image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      max-height: 70vh;
      overflow: hidden;
    }
    
    .modal-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .modal-info {
      padding: 20px;
      border-top: 1px solid #eee;
      background: #f9f9f9;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    
    .modal-title {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.4em;
    }
    
    .modal-description {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 0.9em;
    }
    
    .modal-prompt {
      color: #888;
      font-size: 0.85em;
      line-height: 1.4;
      display: block;
      padding: 10px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #007bff;
    }
    
    @media (max-width: 768px) {
      .modal-content {
        max-width: 95%;
        max-height: 95%;
      }
      
      .modal-image-container {
        max-height: 60vh;
        padding: 15px;
      }
      
      .modal-info {
        padding: 15px;
      }
      
      .modal-title {
        font-size: 1.2em;
      }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);

  // View button click handler
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const imageSrc = this.getAttribute("data-image");
      const galleryItem = this.closest(".gallery-item");
      const title = galleryItem.querySelector("h4").textContent;
      const description =
        galleryItem.querySelector(".image-info p").textContent;
      const prompt = galleryItem.querySelector(".prompt").textContent;

      // Set modal content
      modal.querySelector(".modal-image").src = imageSrc;
      modal.querySelector(".modal-image").alt = title;
      modal.querySelector(".modal-title").textContent = title;
      modal.querySelector(".modal-description").textContent = description;
      modal.querySelector(".modal-prompt").textContent = prompt;

      // Show modal
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  });

  // Close modal functionality
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Close modal events
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelector(".modal-overlay").addEventListener("click", closeModal);

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Prevent modal content click from closing modal
  modal.querySelector(".modal-content").addEventListener("click", function (e) {
    e.stopPropagation();
  });
});
