class VideoPlayer {
  constructor() {
    this.video = document.getElementById("mainVideo");
    this.playPauseBtn = document.getElementById("play");
    this.progressFill = document.getElementById("progressFill");
    this.progressThumb = document.getElementById("progressThumb");
    this.progressPercent = document.getElementById("progressPercent");
    this.addBookmarkBtn = document.getElementById("addBookmarkBtn");
    this.bookmarksList = document.getElementById("bookmarksList");
    this.chapterItems = document.querySelectorAll(".chapter-item");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupChapters();
    this.loadBookmarks();
  }

  setupEventListeners() {
    // Play/Pause
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.video.addEventListener("click", () => this.togglePlayPause());

    // Video events
    this.video.addEventListener("play", () => this.updatePlayButton());
    this.video.addEventListener("pause", () => this.updatePlayButton());
    this.video.addEventListener("timeupdate", () => this.updateProgress());

    // Progress bar
    const progressBar = document.getElementById("progressBar");
    progressBar.addEventListener("click", (e) => this.seekVideo(e));

    // Bookmarks
    this.addBookmarkBtn.addEventListener("click", () => this.addBookmark());

    // Keyboard controls
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  togglePlayPause() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  updatePlayButton() {
    const playIcon = this.playPauseBtn.querySelector(".play-icon");
    const pauseIcon = this.playPauseBtn.querySelector(".pause-icon");

    if (this.video.paused) {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }
  }

  updateProgress() {
    const percent = (this.video.currentTime / this.video.duration) * 100;
    this.progressFill.style.width = `${percent}%`;
    this.progressThumb.style.right = `${100 - percent}%`;
    this.progressPercent.textContent = `${Math.round(percent)}%`;
  }

  seekVideo(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.video.currentTime = percent * this.video.duration;
  }

  setupChapters() {
    this.chapterItems.forEach((chapter) => {
      chapter.addEventListener("click", () => {
        const time = parseInt(chapter.dataset.seconds);
        this.video.currentTime = time;
        this.video.play();
      });
    });
  }

  addBookmark() {
    const time = Math.floor(this.video.currentTime);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    const bookmark = document.createElement("div");
    bookmark.className = "bookmark-item";
    bookmark.innerHTML = `
            <span>🔖 ${timeString}</span>
            <button class="bookmark-remove">×</button>
        `;

    bookmark
      .querySelector(".bookmark-remove")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        bookmark.remove();
        this.saveBookmarks();
      });

    bookmark.addEventListener("click", () => {
      this.video.currentTime = time;
      this.video.play();
    });

    this.bookmarksList.appendChild(bookmark);
    this.saveBookmarks();
  }

  saveBookmarks() {
    const bookmarks = Array.from(this.bookmarksList.children).map(
      (bookmark) => {
        return bookmark.querySelector("span").textContent.split(" ")[1];
      }
    );
    localStorage.setItem("videoBookmarks", JSON.stringify(bookmarks));
  }

  loadBookmarks() {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("videoBookmarks") || "[]"
    );
    savedBookmarks.forEach((timeString) => {
      const [minutes, seconds] = timeString.split(":").map(Number);
      const time = minutes * 60 + seconds;

      const bookmark = document.createElement("div");
      bookmark.className = "bookmark-item";
      bookmark.innerHTML = `
                <span>🔖 ${timeString}</span>
                <button class="bookmark-remove">×</button>
            `;

      bookmark
        .querySelector(".bookmark-remove")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          bookmark.remove();
          this.saveBookmarks();
        });

      bookmark.addEventListener("click", () => {
        this.video.currentTime = time;
        this.video.play();
      });

      this.bookmarksList.appendChild(bookmark);
    });
  }

  handleKeyboard(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        this.togglePlayPause();
        break;
      case "f":
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case "m":
        e.preventDefault();
        this.video.muted = !this.video.muted;
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.video.currentTime -= 5;
        break;
      case "ArrowRight":
        e.preventDefault();
        this.video.currentTime += 5;
        break;
      case "b":
        e.preventDefault();
        this.addBookmark();
        break;
    }
  }

  toggleFullscreen() {
    const videoWrapper = this.video.parentElement;
    if (!document.fullscreenElement) {
      videoWrapper.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

// Video Gallery Logic - Separate from VideoPlayer class
const playVideoButtons = document.querySelectorAll(".play-video-btn");

// Create video modal element
const videoModal = document.createElement("div");
videoModal.className = "video-gallery-modal";
videoModal.innerHTML = `
  <div class="modal-overlay"></div>
  <div class="modal-content video-modal-content">
    <button class="modal-close video-modal-close">&times;</button>
    <div class="video-player-wrapper">
      <video class="modal-video" controls>
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
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
document.body.appendChild(videoModal);

// Add CSS for video gallery modal (only modal styles, not grid styles)
const videoModalStyles = `
  /* Video Modal Styles */
  .video-gallery-modal {
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

  .video-gallery-modal.active {
    display: block;
    opacity: 1;
  }

  .video-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
    transition: transform 0.3s ease;
  }

  .video-gallery-modal.active .video-modal-content {
    transform: translate(-50%, -50%) scale(1);
  }

  .video-modal-close {
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

  .video-modal-close:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  .video-player-wrapper {
    width: 100%;
    background: #000;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }

  .modal-video {
    width: 100%;
    height: auto;
    max-height: 500px;
    display: block;
  }

  .modal-info {
    padding: 1.5rem;
  }

  .modal-info h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }

  .modal-info p {
    color: var(--text-light);
    margin-bottom: 1rem;
  }

  .modal-meta {
    background: var(--gray-100);
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .modal-prompt {
    color: var(--text-light);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .video-modal-content {
      max-width: 95%;
    }

    .modal-video {
      max-height: 300px;
    }
  }

  /* Additional styles for video duration in thumbnails */
  .video-thumbnail {
    position: relative;
  }

  .video-duration {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* Ensure video element fills the thumbnail */
  .video-thumbnail video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Add video modal styles
const videoStyleSheet = document.createElement("style");
videoStyleSheet.textContent = videoModalStyles;
document.head.appendChild(videoStyleSheet);

// Video button click handler
playVideoButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const videoSrc = this.getAttribute("data-video");
    const videoCard = this.closest(".video-card");
    const title = videoCard.querySelector("h4").textContent;
    const description = videoCard.querySelector(".video-info p").textContent;
    const prompt = videoCard.querySelector(".prompt").textContent;

    // Set modal content
    const modalVideo = videoModal.querySelector(".modal-video");
    modalVideo.src = videoSrc;
    modalVideo.poster = ""; // Remove poster when playing
    videoModal.querySelector(".modal-title").textContent = title;
    videoModal.querySelector(".modal-description").textContent = description;
    videoModal.querySelector(".modal-prompt").textContent = prompt;

    // Show modal
    videoModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Play video automatically
    setTimeout(() => {
      modalVideo.play().catch((e) => {
        console.log("Autoplay prevented:", e);
      });
    }, 300);
  });
});

// Close video modal functionality
function closeVideoModal() {
  const modalVideo = videoModal.querySelector(".modal-video");
  modalVideo.pause();
  modalVideo.currentTime = 0;
  videoModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close video modal events
videoModal
  .querySelector(".video-modal-close")
  .addEventListener("click", closeVideoModal);
videoModal
  .querySelector(".modal-overlay")
  .addEventListener("click", closeVideoModal);

// Close video modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && videoModal.classList.contains("active")) {
    closeVideoModal();
  }
});

// Prevent modal content click from closing modal
videoModal
  .querySelector(".video-modal-content")
  .addEventListener("click", function (e) {
    e.stopPropagation();
  });

// Video hover play preview (optional)
const videoCards = document.querySelectorAll(".video-card");
videoCards.forEach((card) => {
  const video = card.querySelector(".ai-video");

  card.addEventListener("mouseenter", function () {
    video.play().catch((e) => {
      // Autoplay might be blocked, this is normal
    });
  });

  card.addEventListener("mouseleave", function () {
    video.pause();
    video.currentTime = 0;
  });
});

// Initialize video player
document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayer();
});
