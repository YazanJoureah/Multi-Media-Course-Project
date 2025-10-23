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

// Initialize video player
document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayer();
});
