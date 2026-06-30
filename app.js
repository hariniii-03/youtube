/**
 * app.js — YouTube Homepage & Playback Application Logic
 * ════════════════════════════════════════════════════════════════
 */

"use strict";

// Redirect to login if not authenticated
if (typeof requireAuth === "function") requireAuth();

/* ═══════════════════════════════════════════════════════════════
   1. MOCK VIDEO DATASET
   ─────────────────────────────────────────────────────────────── */
const MOCK_VIDEOS = [
  {
    id: 1,
    title: "Big Buck Bunny — Official CGI Animated Short",
    description: "A large and lovable rabbit deals with three bullying rodents who try to ruin his peaceful day. Produced by the Blender Foundation, this classic short is renowned for showcasing high-quality animation rendering.",
    category: "Animals",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    uploader: "BlenderAnimation",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blender",
    views: "4.2M",
    uploadTime: "3 days ago",
    duration: "9:56",
    likes: 245821,
    subscribers: "1.5M subscribers",
    comments: [
      { user: "CartoonFan", text: "This brings back so many memories! The animation still holds up.", time: "2 hours ago" },
      { user: "DevArtist", text: "Incredible rendering. Love the rabbit design!", time: "1 hour ago" }
    ]
  },
  {
    id: 2,
    title: "Tears of Steel — Sci-Fi Visual Effects Showcase",
    description: "Set in a dystopian future where giant mechs patrol the ruins, a team of scientists attempts to resolve a past event that led to the apocalypse. Exploring long-exposure visual effects and green-screen composites.",
    category: "Tech",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80",
    uploader: "VFXStudio",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vfx",
    views: "890K",
    uploadTime: "1 week ago",
    duration: "12:14",
    likes: 75310,
    subscribers: "450K subscribers",
    comments: [
      { user: "Cinephile99", text: "The CGI on the giant mech is absolutely phenomenal.", time: "4 days ago" }
    ]
  },
  {
    id: 3,
    title: "Sintel — Cinematic Orchestral Music Video",
    description: "Follow Sintel, a lonely girl searching for her baby dragon companion, in this sweeping fantasy adventure. Accompanied by a spectacular orchestral theme that elevates the emotional journey.",
    category: "Music",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    uploader: "EpicCinematics",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=epic",
    views: "12M",
    uploadTime: "2 months ago",
    duration: "14:48",
    likes: 1048201,
    subscribers: "3.2M subscribers",
    comments: [
      { user: "MelodyMaker", text: "The soundtrack gave me literal chills. Fantastic masterpiece.", time: "1 month ago" },
      { user: "DragonRider", text: "The ending always breaks my heart 😭", time: "3 weeks ago" }
    ]
  },
  {
    id: 4,
    title: "Lo-Fi Beats for Coding, Studying & Relaxing ☕",
    description: "Grab a warm beverage and sink into this collection of chill, low-fidelity instrumental tracks designed to help you focus on your code, writing, or studying sessions.",
    category: "Music",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
    uploader: "ChilledCow",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chilled",
    views: "5.2M",
    uploadTime: "6 months ago",
    duration: "15:02",
    likes: 289456,
    subscribers: "15.4M subscribers",
    comments: [
      { user: "CodeNinja", text: "This beat compilation saved my computer science thesis.", time: "5 days ago" }
    ]
  },
  {
    id: 5,
    title: "How to Build a Custom Web App with Premium Glassmorphism UI",
    description: "Learn how to use vanilla HTML, CSS variables, and modern Javascript to create responsive layouts, glassmorphic cards, custom media players, and robust states without Tailwind.",
    category: "Tech",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    uploader: "CodeAcademy",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=code",
    views: "340K",
    uploadTime: "2 days ago",
    duration: "8:45",
    likes: 28900,
    subscribers: "120K subscribers",
    comments: [
      { user: "CSSWizard", text: "Finally, a tutorial explaining raw CSS instead of utility frameworks!", time: "1 day ago" }
    ]
  },
  {
    id: 6,
    title: "Golden Retriever Puppy's First Play Session in the Garden",
    description: "Meet Barnaby, a golden retriever puppy discovering falling leaves, sprinkler systems, and soft green grass for the first time. Prepare yourself for pure cuteness.",
    category: "Animals",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    uploader: "PawClips",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=paw",
    views: "1.4M",
    uploadTime: "4 hours ago",
    duration: "5:12",
    likes: 184200,
    subscribers: "890K subscribers",
    comments: [
      { user: "FluffCollector", text: "I need to adopt Barnaby immediately! Look at those paws!", time: "2 hours ago" }
    ]
  },
  {
    id: 7,
    title: "Abstract Chromatographic Simulation - Organic Color Chemistry",
    description: "Macro-photography demonstrating chemical reactions between colorful polymers, suspended oils, and active solvents. An incredible visual symphony of organic movement.",
    category: "Abstract",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    uploader: "ArtSims",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=art",
    views: "28K",
    uploadTime: "4 days ago",
    duration: "3:40",
    likes: 987,
    subscribers: "12K subscribers",
    comments: []
  },
  {
    id: 8,
    title: "Designing a Scandinavian Minimal House Interior Layout",
    description: "Walkthrough of a functional, bright, and clean apartment renovation in Copenhagen. Discover design tips regarding space prioritization, natural light capture, and neutral wood textures.",
    category: "Minimalism",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    uploader: "InteriorInspo",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=interior",
    views: "760K",
    uploadTime: "1 week ago",
    duration: "18:22",
    likes: 33450,
    subscribers: "180K subscribers",
    comments: [
      { user: "StudioDesign", text: "The lighting fixtures in the dining room are absolutely stunning.", time: "5 days ago" }
    ]
  }
];

const MOCK_SHORTS = [
  {
    id: 101,
    title: "Developer workflow hack in 5 seconds! 💻",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    likes: "89K",
    comments: "420",
    channel: "DevHacks"
  },
  {
    id: 102,
    title: "Puppy vs Sprinkler! Who wins? 🐶💦",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    likes: "420K",
    comments: "1.2K",
    channel: "CutePups"
  },
  {
    id: 103,
    title: "Insane VFX transition tutorial! ⚡",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    likes: "250K",
    comments: "810",
    channel: "FXArtist"
  },
  {
    id: 104,
    title: "Satisfying colorful paint chromatography loop 🎨",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    likes: "62K",
    comments: "150",
    channel: "FluidDesign"
  }
];

const CATEGORIES = ["All", "Music", "Gaming", "Tech", "Animals", "Abstract", "Minimalism"];

/* ═══════════════════════════════════════════════════════════════
   2. APPLICATION STATE
   ─────────────────────────────────────────────────────────────── */
const state = {
  currentCategory: "All",
  searchQuery:     "",
  isDarkMode:      true,
  videos:          [...MOCK_VIDEOS],
  activeModal:     null,
  activeVideoId:   null,
  likedVideos:     new Set(),
  subscribedChannels: new Set(),
  currentView:     "home", // "home" | "shorts" | "liked" | "library" | "subscriptions"
};

/* ═══════════════════════════════════════════════════════════════
   3. TOAST NOTIFICATION SYSTEM
   ─────────────────────────────────────────────────────────────── */
const TOAST_ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

function showToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");

  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Dismiss notification">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("visible"));
  });

  function dismissToast() {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 350);
  }

  const autoTimeout = setTimeout(dismissToast, duration);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(autoTimeout);
    dismissToast();
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. THEME MANAGER
   ─────────────────────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem("youtube_theme");
  state.isDarkMode = saved !== "light";
  applyTheme();
}

function applyTheme() {
  document.documentElement.classList.toggle("light-mode", !state.isDarkMode);
  const track = document.getElementById("theme-track");
  if (track) track.classList.toggle("active", !state.isDarkMode);
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  localStorage.setItem("youtube_theme", state.isDarkMode ? "dark" : "light");
  applyTheme();
  showToast(`${state.isDarkMode ? "Dark" : "Light"} mode enabled`, "info", 2000);
}

/* ═══════════════════════════════════════════════════════════════
   5. SIDEBAR MANAGER (mobile + view controllers)
   ─────────────────────────────────────────────────────────────── */
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-overlay").classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("visible");
  document.body.style.overflow = "";
}

function selectView(viewName) {
  state.currentView = viewName;
  closeSidebar();

  // Reset active menu items visually
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.classList.remove("active");
  });

  const selectedBtn = document.getElementById(`sidebar-${viewName}`);
  if (selectedBtn) selectedBtn.classList.add("active");

  const sectionTitle = document.getElementById("section-title");
  const categoryBar = document.getElementById("category-bar");

  if (viewName === "home") {
    if (sectionTitle) sectionTitle.textContent = "Discover Videos";
    if (categoryBar) categoryBar.style.display = "flex";
    renderVideoGrid();
  } else if (viewName === "shorts") {
    if (sectionTitle) sectionTitle.textContent = "YouTube Shorts";
    if (categoryBar) categoryBar.style.display = "none";
    renderShortsView();
  } else if (viewName === "liked") {
    if (sectionTitle) sectionTitle.textContent = "Liked Videos";
    if (categoryBar) categoryBar.style.display = "none";
    renderVideoGrid(true); // render only liked
  } else if (viewName === "subscriptions") {
    if (sectionTitle) sectionTitle.textContent = "Subscriptions Feed";
    if (categoryBar) categoryBar.style.display = "none";
    renderVideoGrid(false, true); // render only subscribed channel videos
  } else if (viewName === "library") {
    if (sectionTitle) sectionTitle.textContent = "Your Library";
    if (categoryBar) categoryBar.style.display = "none";
    renderLibraryView();
  }
}

/* ═══════════════════════════════════════════════════════════════
   6. AVATAR DROPDOWN
   ─────────────────────────────────────────────────────────────── */
function toggleAvatarDropdown() {
  const dropdown = document.getElementById("avatar-dropdown");
  const isOpen = dropdown.classList.toggle("open");
  document.getElementById("avatar-btn").setAttribute("aria-expanded", isOpen);
}

function closeAvatarDropdown() {
  const dropdown = document.getElementById("avatar-dropdown");
  if (dropdown) dropdown.classList.remove("open");
  const btn = document.getElementById("avatar-btn");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function handleDocumentClick(e) {
  const avatarWrapper = document.querySelector(".avatar-wrapper");
  if (avatarWrapper && !avatarWrapper.contains(e.target)) {
    closeAvatarDropdown();
  }
}

/* ═══════════════════════════════════════════════════════════════
   7. CATEGORIES & SEARCH CHIPS
   ─────────────────────────────────────────────────────────────── */
function renderCategoryChips() {
  const bar = document.getElementById("category-bar");
  if (!bar) return;

  bar.innerHTML = CATEGORIES.map(cat => `
    <button
      class="chip ${cat === state.currentCategory ? "active" : ""}"
      data-category="${cat}"
      aria-pressed="${cat === state.currentCategory}"
    >${cat}</button>
  `).join("");

  bar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const category = chip.dataset.category;
    state.currentCategory = category;
    bar.querySelectorAll(".chip").forEach(c => {
      c.classList.toggle("active", c.dataset.category === category);
      c.setAttribute("aria-pressed", c.dataset.category === category);
    });
    if (state.currentView !== "home") selectView("home");
    renderVideoGrid();
  });
}

function getFilteredVideos(onlyLiked = false, onlySubscribed = false) {
  let filtered = state.videos;

  if (onlyLiked) {
    filtered = filtered.filter(vid => state.likedVideos.has(vid.id));
  }

  if (onlySubscribed) {
    filtered = filtered.filter(vid => state.subscribedChannels.has(vid.uploader));
  }

  if (state.currentView === "home" && state.currentCategory !== "All") {
    filtered = filtered.filter(vid => vid.category === state.currentCategory);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(vid =>
      vid.title.toLowerCase().includes(q) ||
      vid.description.toLowerCase().includes(q) ||
      vid.uploader.toLowerCase().includes(q) ||
      vid.category.toLowerCase().includes(q)
    );
  }

  return filtered;
}

function initSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    if (state.currentView !== "home" && state.currentView !== "liked" && state.currentView !== "subscriptions") {
      selectView("home");
    }
    if (state.currentView === "home") renderVideoGrid();
    else if (state.currentView === "liked") renderVideoGrid(true);
    else if (state.currentView === "subscriptions") renderVideoGrid(false, true);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. VIDEO GRID RENDERER
   ─────────────────────────────────────────────────────────────── */
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1000)     return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

function renderVideoGrid(onlyLiked = false, onlySubscribed = false) {
  const grid = document.getElementById("image-grid");
  if (!grid) return;

  const filtered = getFilteredVideos(onlyLiked, onlySubscribed);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="56" height="56">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <h3>No videos found</h3>
        <p>Try refining your search keywords or checking other feeds.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((vid, index) => `
    <article
      class="image-card"
      data-id="${vid.id}"
      tabindex="0"
      role="button"
      aria-label="Play video: ${vid.title}"
      style="animation-delay: ${index * 50}ms"
    >
      <div class="card-thumbnail">
        <img src="${vid.thumbnailUrl}" alt="${vid.title}" loading="lazy" />
        <span class="video-duration-badge">${vid.duration}</span>
        <div class="card-overlay" aria-hidden="true">
          <span class="overlay-category">${vid.category}</span>
          <div class="play-hover-circle">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="card-avatar">
          <img src="${vid.uploaderAvatar}" alt="${vid.uploader}" loading="lazy" />
        </div>
        <div class="card-info">
          <p class="card-title">${vid.title}</p>
          <div class="card-meta">
            <span class="card-uploader">${vid.uploader}</span>
            <div class="card-stats">
              <span>${vid.views} views</span>
              <span class="dot">•</span>
              <span>${vid.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".image-card").forEach(card => {
    const openVideo = () => openDetailModal(Number(card.dataset.id));
    card.addEventListener("click", openVideo);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVideo(); }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. LIBRARY & SHORTS VIEWS
   ─────────────────────────────────────────────────────────────── */
function renderLibraryView() {
  const grid = document.getElementById("image-grid");
  if (!grid) return;

  const likedCount = state.likedVideos.size;
  const subCount = state.subscribedChannels.size;
  const totalUploads = state.videos.filter(v => v.uploader === "You").length;

  grid.innerHTML = `
    <div class="library-view-container">
      <div class="library-stats-card">
        <h3>Library Dashboard</h3>
        <p>Manage all your saved tracks, liked content, and channel updates in one place.</p>
        <div class="library-metrics">
          <div class="metric-box">
            <span class="metric-num">${likedCount}</span>
            <span class="metric-label">Liked Videos</span>
          </div>
          <div class="metric-box">
            <span class="metric-num">${subCount}</span>
            <span class="metric-label">Subscriptions</span>
          </div>
          <div class="metric-box">
            <span class="metric-num">${totalUploads}</span>
            <span class="metric-label">Your Uploads</span>
          </div>
        </div>
      </div>

      <h2 class="library-sub-title">Your Uploaded Videos</h2>
      <div class="library-uploads-grid" id="library-uploads-grid"></div>
    </div>
  `;

  // Render user uploads
  const uploadsGrid = document.getElementById("library-uploads-grid");
  const userUploads = state.videos.filter(v => v.uploader === "You");

  if (userUploads.length === 0) {
    uploadsGrid.innerHTML = `<p class="no-uploads-text">You haven't uploaded any videos yet. Click "Upload" above to publish your first video.</p>`;
    return;
  }

  uploadsGrid.innerHTML = userUploads.map(vid => `
    <div class="image-card" data-id="${vid.id}" tabindex="0" role="button">
      <div class="card-thumbnail">
        <img src="${vid.thumbnailUrl}" alt="${vid.title}" />
        <span class="video-duration-badge">${vid.duration}</span>
      </div>
      <div class="card-body">
        <div class="card-info">
          <p class="card-title">${vid.title}</p>
          <p class="card-meta">${vid.views} views • ${vid.uploadTime}</p>
        </div>
      </div>
    </div>
  `).join("");

  uploadsGrid.querySelectorAll(".image-card").forEach(card => {
    card.addEventListener("click", () => openDetailModal(Number(card.dataset.id)));
  });
}

function renderShortsView() {
  const grid = document.getElementById("image-grid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="shorts-container">
      <div class="shorts-wrapper-scroller">
        ${MOCK_SHORTS.map((short, idx) => `
          <div class="short-slide" id="short-slide-${short.id}">
            <div class="short-video-container">
              <video class="short-player" src="${short.url}" loop playsinline ${idx === 0 ? "autoplay" : ""}></video>
              
              <!-- Custom vertical details overlay -->
              <div class="short-overlay-details">
                <p class="short-channel-name">@${short.channel}</p>
                <p class="short-video-title">${short.title}</p>
              </div>

              <!-- Action buttons -->
              <div class="short-sidebar-actions">
                <button class="short-action-btn like" onclick="handleShortLike(this, ${short.id})">
                  <div class="short-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                  </div>
                  <span>${short.likes}</span>
                </button>
                
                <div class="short-action-btn">
                  <div class="short-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                  </div>
                  <span>${short.comments}</span>
                </div>

                <div class="short-action-btn" onclick="handleShare()">
                  <div class="short-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </div>
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const scroller = grid.querySelector(".shorts-wrapper-scroller");
  if (scroller) {
    scroller.addEventListener("scroll", () => {
      const slides = scroller.querySelectorAll(".short-slide");
      slides.forEach(slide => {
        const video = slide.querySelector("video");
        const rect = slide.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();
        if (Math.abs(rect.top - scrollerRect.top) < rect.height / 2) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    });
  }
}

function handleShortLike(btn, id) {
  btn.classList.toggle("liked");
  const iconCircle = btn.querySelector(".short-icon-circle");
  iconCircle.classList.add("like-pop");
  setTimeout(() => iconCircle.classList.remove("like-pop"), 300);
  showToast("Liked Short video!", "success", 2000);
}

/* ═══════════════════════════════════════════════════════════════
   10. DETAIL MODAL & CUSTOM PLAYER
   ─────────────────────────────────────────────────────────────── */
let playerState = {
  isDraggingScrubber: false
};

function openDetailModal(videoId) {
  const vid = state.videos.find(v => v.id === videoId);
  if (!vid) return;

  state.activeModal   = "detail";
  state.activeVideoId = videoId;

  const liked = state.likedVideos.has(videoId);
  const subscribed = state.subscribedChannels.has(vid.uploader);

  const videoElement = document.getElementById("modal-video");
  videoElement.src = vid.url;
  videoElement.playbackRate = 1.0;

  document.getElementById("modal-category-tag").textContent = vid.category;
  document.getElementById("modal-title").textContent = vid.title;
  document.getElementById("modal-description").textContent = vid.description;
  document.getElementById("modal-uploader-avatar").src = vid.uploaderAvatar;
  document.getElementById("modal-uploader-name").textContent = vid.uploader;
  document.getElementById("modal-uploader-subs").textContent = vid.subscribers;
  document.getElementById("modal-views").textContent = `${vid.views} views`;
  document.getElementById("modal-time").textContent = vid.uploadTime;

  const likeBtn = document.getElementById("like-btn");
  likeBtn.classList.toggle("liked", liked);
  document.getElementById("like-count").textContent = formatNumber(vid.likes);

  const subBtn = document.getElementById("subscribe-btn");
  if (subscribed) {
    subBtn.textContent = "Subscribed";
    subBtn.classList.add("subscribed");
  } else {
    subBtn.textContent = "Subscribe";
    subBtn.classList.remove("subscribed");
  }

  renderComments(vid.comments);

  document.getElementById("detail-modal").classList.add("open");
  document.body.style.overflow = "hidden";

  setupCustomPlayer();

  videoElement.play().catch(() => {
    document.getElementById("large-play-overlay").style.display = "flex";
  });
}

function closeDetailModal() {
  const videoElement = document.getElementById("modal-video");
  if (videoElement) {
    videoElement.pause();
    videoElement.src = "";
  }

  document.getElementById("detail-modal").classList.remove("open");
  document.body.style.overflow = "";

  document.getElementById("detail-modal-inner").classList.remove("theater-mode");

  state.activeModal   = null;
  state.activeVideoId = null;
}

function setupCustomPlayer() {
  const video = document.getElementById("modal-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const muteBtn = document.getElementById("mute-btn");
  const volumeIcon = document.getElementById("volume-icon");
  const volumeSlider = document.getElementById("volume-slider");
  const timeCurrent = document.getElementById("time-current");
  const timeDuration = document.getElementById("time-duration");
  
  const progressContainer = document.getElementById("progress-container");
  const progressElapsed = document.getElementById("progress-elapsed");
  const progressBuffered = document.getElementById("progress-buffered");
  const progressScrubber = document.getElementById("progress-scrubber");

  const speedBtn = document.getElementById("speed-btn");
  const speedMenu = document.getElementById("speed-menu");
  const theaterBtn = document.getElementById("theater-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const videoContainer = document.getElementById("video-container");
  const largePlayBtn = document.getElementById("large-play-overlay");

  if (!video) return;

  video.volume = volumeSlider.value;
  video.muted = false;

  function togglePlay() {
    if (video.paused) {
      video.play().then(() => {
        largePlayBtn.style.display = "none";
      }).catch(() => {});
    } else {
      video.pause();
    }
  }

  video.onclick = togglePlay;
  largePlayBtn.onclick = togglePlay;
  playPauseBtn.onclick = togglePlay;

  video.onplay = () => {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    largePlayBtn.style.display = "none";
  };

  video.onpause = () => {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  };

  volumeSlider.oninput = (e) => {
    video.volume = e.target.value;
    video.muted = video.volume === 0;
    updateVolumeUI();
  };

  muteBtn.onclick = () => {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.5;
      volumeSlider.value = 0.5;
    }
    updateVolumeUI();
  };

  function updateVolumeUI() {
    volumeSlider.value = video.muted ? 0 : video.volume;
    if (video.muted || video.volume === 0) {
      volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
    } else {
      volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const formattedSeconds = s < 10 ? `0${s}` : s;
    if (h > 0) {
      const formattedMinutes = m < 10 ? `0${m}` : m;
      return `${h}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${m}:${formattedSeconds}`;
  }

  video.onloadedmetadata = () => {
    timeDuration.textContent = formatTime(video.duration);
    timeCurrent.textContent = formatTime(video.currentTime);
  };

  video.ontimeupdate = () => {
    timeCurrent.textContent = formatTime(video.currentTime);
    if (!playerState.isDraggingScrubber && video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      progressElapsed.style.width = `${percentage}%`;
      progressScrubber.style.left = `${percentage}%`;
    }
    updateBufferedLine();
  };

  function updateBufferedLine() {
    if (video.buffered.length > 0 && video.duration) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percentage = (bufferedEnd / video.duration) * 100;
      progressBuffered.style.width = `${percentage}%`;
    }
  }

  function seekVideo(e) {
    const rect = progressContainer.getBoundingClientRect();
    let posX = (e.clientX - rect.left) / rect.width;
    if (posX < 0) posX = 0;
    if (posX > 1) posX = 1;

    progressElapsed.style.width = `${posX * 100}%`;
    progressScrubber.style.left = `${posX * 100}%`;
    video.currentTime = posX * video.duration;
  }

  progressContainer.onmousedown = (e) => {
    playerState.isDraggingScrubber = true;
    seekVideo(e);
    
    document.onmousemove = (moveEvent) => {
      seekVideo(moveEvent);
    };

    document.onmouseup = () => {
      playerState.isDraggingScrubber = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  theaterBtn.onclick = () => {
    const modalInner = document.getElementById("detail-modal-inner");
    modalInner.classList.toggle("theater-mode");
  };

  speedBtn.onclick = (e) => {
    e.stopPropagation();
    speedMenu.classList.toggle("open");
  };

  document.addEventListener("click", () => {
    if (speedMenu) speedMenu.classList.remove("open");
  });

  speedMenu.querySelectorAll(".speed-option").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const rate = parseFloat(btn.dataset.speed);
      video.playbackRate = rate;
      speedBtn.textContent = btn.textContent;
      speedMenu.querySelectorAll(".speed-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      speedMenu.classList.remove("open");
      showToast(`Playback speed set to ${rate}x`, "info", 1500);
    };
  });
}

/* ═══════════════════════════════════════════════════════════════
   11. INTERACTIVE EVENTS: LIKE & SUBSCRIBE
   ─────────────────────────────────────────────────────────────── */
function handleLike() {
  const imageId = state.activeVideoId;
  if (!imageId) return;

  const vid = state.videos.find(v => v.id === imageId);
  if (!vid) return;

  const likeBtn = document.getElementById("like-btn");

  if (state.likedVideos.has(imageId)) {
    state.likedVideos.delete(imageId);
    vid.likes -= 1;
    likeBtn.classList.remove("liked");
    showToast("Removed from liked videos", "info", 2000);
  } else {
    state.likedVideos.add(imageId);
    vid.likes += 1;
    likeBtn.classList.add("liked");
    likeBtn.querySelector("svg").classList.add("like-pop");
    setTimeout(() => likeBtn.querySelector("svg").classList.remove("like-pop"), 300);
    showToast("Added to Liked videos ❤️", "success", 2000);
  }

  document.getElementById("like-count").textContent = formatNumber(vid.likes);
  if (state.currentView === "liked") renderVideoGrid(true);
}

function handleShare() {
  const imageId = state.activeVideoId || "general";
  const mockUrl = `${window.location.origin}/watch?v=${imageId}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(mockUrl).then(() => {
      showToast("Video link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Link: " + mockUrl, "info");
    });
  } else {
    window.prompt("Share link:", mockUrl);
  }
}

function handleDownload() {
  showToast("Preparing offline MP4 stream package...", "info", 2000);
  setTimeout(() => {
    showToast("Download started successfully! 💾", "success", 2500);
  }, 1000);
}

function toggleSubscribe() {
  const videoId = state.activeVideoId;
  if (!videoId) return;
  const vid = state.videos.find(v => v.id === videoId);
  if (!vid) return;

  const subBtn = document.getElementById("subscribe-btn");
  const isSubscribed = state.subscribedChannels.has(vid.uploader);

  if (isSubscribed) {
    state.subscribedChannels.delete(vid.uploader);
    subBtn.textContent = "Subscribe";
    subBtn.classList.remove("subscribed");
    showToast(`Unsubscribed from ${vid.uploader}`, "info");
  } else {
    state.subscribedChannels.add(vid.uploader);
    subBtn.textContent = "Subscribed";
    subBtn.classList.add("subscribed");
    showToast(`Subscribed to ${vid.uploader}! 🔔`, "success");
  }
}

/* ═══════════════════════════════════════════════════════════════
   12. COMMENT SYSTEM
   ─────────────────────────────────────────────────────────────── */
function renderComments(comments) {
  const list = document.getElementById("comments-list");
  if (!list) return;

  if (comments.length === 0) {
    list.innerHTML = `<p class="text-sm text-muted" style="padding: 0.5rem 0">No comments yet. Be the first to comment!</p>`;
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.user)}"
             alt="${c.user}" loading="lazy" />
      </div>
      <div class="comment-bubble">
        <p class="comment-username">${c.user}</p>
        <p class="comment-text">${escapeHtml(c.text)}</p>
        <p class="comment-time">${c.time}</p>
      </div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function handleAddComment() {
  const input = document.getElementById("comment-input");
  const text = input.value.trim();
  const videoId = state.activeVideoId;

  if (!text) {
    showToast("Write a comment first", "warning", 2000);
    return;
  }

  const vid = state.videos.find(v => v.id === videoId);
  if (!vid) return;

  let username = "You";
  try {
    const user = JSON.parse(sessionStorage.getItem("youtube_user") || "{}");
    username = user.username || "You";
  } catch (_) {}

  const newComment = {
    user: username,
    text: text,
    time: "Just now"
  };
  vid.comments.unshift(newComment);

  input.value = "";
  renderComments(vid.comments);

  const list = document.getElementById("comments-list");
  if (list) list.scrollTop = 0;

  showToast("Comment posted!", "success", 2000);
}

/* ═══════════════════════════════════════════════════════════════
   13. UPLOAD SYSTEM
   ─────────────────────────────────────────────────────────────── */
function openUploadModal() {
  state.activeModal = "upload";
  document.getElementById("upload-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeUploadModal() {
  document.getElementById("upload-modal").classList.remove("open");
  document.body.style.overflow = "";
  state.activeModal = null;
  document.getElementById("upload-form").reset();
  resetDropZone();
}

function resetDropZone() {
  const preview = document.getElementById("drop-preview");
  const dropContent = document.getElementById("drop-content");
  if (preview) { preview.style.display = "none"; preview.src = ""; }
  if (dropContent) dropContent.style.display = "block";
}

function initUploadModal() {
  const dropZone   = document.getElementById("drop-zone");
  const fileInput  = document.getElementById("file-input");
  const preview    = document.getElementById("drop-preview");
  const dropContent= document.getElementById("drop-content");

  if (!dropZone) return;

  dropZone.addEventListener("click", (e) => {
    if (e.target.closest("#drop-preview")) return;
    fileInput.click();
  });

  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) handleFileSelected(file, preview, dropContent);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove("drag-over");
    }
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelected(file, preview, dropContent);
    }
  });

  document.getElementById("upload-form").addEventListener("submit", handleUploadSubmit);
}

function handleFileSelected(file, preview, dropContent) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";
    if (dropContent) dropContent.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function handleUploadSubmit(e) {
  e.preventDefault();

  const title    = document.getElementById("upload-title").value.trim();
  const category = document.getElementById("upload-category").value;
  const desc     = document.getElementById("upload-desc").value.trim();
  const preview  = document.getElementById("drop-preview");

  if (!title) { showToast("Enter a video title", "warning"); return; }
  if (!category) { showToast("Select a category", "warning"); return; }

  let username = "You";
  let avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=you`;
  try {
    const user = JSON.parse(sessionStorage.getItem("youtube_user") || "{}");
    username = user.username || "You";
    avatarUrl = user.avatar || avatarUrl;
  } catch (_) {}

  const mockVideosPaths = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ];
  const chosenVideo = mockVideosPaths[Math.floor(Math.random() * mockVideosPaths.length)];

  const localThumbnailSrc = preview.src && preview.src !== window.location.href
    ? preview.src
    : `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80`;

  const newVideo = {
    id:            Date.now(),
    title,
    description:   desc || "No description provided.",
    category,
    url:           chosenVideo,
    thumbnailUrl:  localThumbnailSrc,
    uploader:      username,
    uploaderAvatar:avatarUrl,
    views:         "0",
    uploadTime:    "Just now",
    duration:      "4:15",
    likes:         0,
    subscribers:   "0 subscribers",
    comments:      []
  };

  state.videos.unshift(newVideo);

  closeUploadModal();
  if (state.currentView !== "home") selectView("home");
  else renderVideoGrid();

  showToast(`"${title}" published successfully! 🚀`, "success");
}

/* ═══════════════════════════════════════════════════════════════
   14. VOICE SEARCH INTEGRATION
   ─────────────────────────────────────────────────────────────── */
function initVoiceSearch() {
  const micBtn = document.getElementById("voice-search-btn");
  const overlay = document.getElementById("voice-overlay");
  const statusText = document.getElementById("voice-status");
  const closeBtn = document.getElementById("voice-close-btn");
  const searchInput = document.getElementById("search-input");

  if (!micBtn || !overlay) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    micBtn.style.display = "none";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    overlay.classList.add("open");
    statusText.textContent = "Listening...";
    recognition.start();
  });

  closeBtn.addEventListener("click", () => {
    recognition.abort();
    overlay.classList.remove("open");
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    statusText.textContent = `Search for: "${transcript}"`;
    searchInput.value = transcript;
    state.searchQuery = transcript;
    
    setTimeout(() => {
      overlay.classList.remove("open");
      if (state.currentView !== "home") selectView("home");
      renderVideoGrid();
      showToast(`Searching for "${transcript}"`, "success", 2000);
    }, 1000);
  };

  recognition.onerror = (e) => {
    statusText.textContent = "Voice search error. Try again.";
    console.error("Speech Recognition Error", e);
    setTimeout(() => overlay.classList.remove("open"), 1500);
  };

  recognition.onspeechend = () => {
    recognition.stop();
  };
}

/* ═══════════════════════════════════════════════════════════════
   15. HYDRATE USER
   ─────────────────────────────────────────────────────────────── */
function hydrateUserUI() {
  let user = { username: "Guest Channel", email: "guest@youtube.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest" };
  try {
    const stored = sessionStorage.getItem("youtube_user");
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  const avatarImg = document.getElementById("header-avatar-img");
  if (avatarImg) avatarImg.src = user.avatar;

  const nameEl  = document.getElementById("dropdown-username");
  const emailEl = document.getElementById("dropdown-email");
  if (nameEl)  nameEl.textContent  = user.username || "Channel Owner";
  if (emailEl) emailEl.textContent = user.email    || "";
}

/* ═══════════════════════════════════════════════════════════════
   16. APPLICATION BOOT
   ─────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  hydrateUserUI();
  initTheme();

  const themeTrack = document.getElementById("theme-track");
  if (themeTrack) themeTrack.addEventListener("click", toggleTheme);

  const hamburgerBtn = document.getElementById("hamburger-btn");
  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);

  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  const avatarBtn = document.getElementById("avatar-btn");
  if (avatarBtn) avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleAvatarDropdown();
  });
  document.addEventListener("click", handleDocumentClick);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    if (typeof logout === "function") logout();
  });

  const viewMap = {
    "sidebar-home": "home",
    "sidebar-shorts": "shorts",
    "sidebar-subscriptions": "subscriptions",
    "sidebar-library": "library",
    "sidebar-liked": "liked"
  };

  Object.keys(viewMap).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        selectView(viewMap[btnId]);
      });
    }
  });

  renderCategoryChips();
  initSearch();
  renderVideoGrid();

  const uploadBtn = document.getElementById("upload-btn");
  if (uploadBtn) uploadBtn.addEventListener("click", openUploadModal);

  const uploadModalBackdrop = document.getElementById("upload-modal");
  if (uploadModalBackdrop) {
    uploadModalBackdrop.addEventListener("click", (e) => {
      if (e.target === uploadModalBackdrop) closeUploadModal();
    });
  }

  const closeUploadBtn = document.getElementById("close-upload-modal");
  if (closeUploadBtn) closeUploadBtn.addEventListener("click", closeUploadModal);

  initUploadModal();

  const detailModalBackdrop = document.getElementById("detail-modal");
  if (detailModalBackdrop) {
    detailModalBackdrop.addEventListener("click", (e) => {
      if (e.target === detailModalBackdrop) closeDetailModal();
    });
  }

  const closeDetailBtn = document.getElementById("close-detail-modal");
  if (closeDetailBtn) closeDetailBtn.addEventListener("click", closeDetailModal);

  const likeBtn     = document.getElementById("like-btn");
  const shareBtn    = document.getElementById("share-btn");
  const downloadBtn = document.getElementById("download-btn");
  const subBtn      = document.getElementById("subscribe-btn");

  if (likeBtn)     likeBtn.addEventListener("click", handleLike);
  if (shareBtn)    shareBtn.addEventListener("click", handleShare);
  if (downloadBtn) downloadBtn.addEventListener("click", handleDownload);
  if (subBtn)      subBtn.addEventListener("click", toggleSubscribe);

  const commentBtn = document.getElementById("comment-submit");
  if (commentBtn) commentBtn.addEventListener("click", handleAddComment);

  const commentInput = document.getElementById("comment-input");
  if (commentInput) {
    commentInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    });
  }

  initVoiceSearch();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.activeModal === "detail") closeDetailModal();
      if (state.activeModal === "upload") closeUploadModal();
      closeAvatarDropdown();
      closeSidebar();
    }
  });

  setTimeout(() => {
    let name = "there";
    try {
      const user = JSON.parse(sessionStorage.getItem("youtube_user") || "{}");
      name = user.username || "there";
    } catch (_) {}
    showToast(`Welcome back, ${name}! 👋`, "success", 3000);
  }, 600);
});
