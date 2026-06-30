/**
 * app.js — ViewTube Homepage & SPA Application Logic
 * ════════════════════════════════════════════════════════════════
 * Includes SPA Router, Custom Video Player, Local Storage State,
 * Likes/Subscriptions engine, dynamic Video Uploads, and Comments sorting.
 * ════════════════════════════════════════════════════════════════
 */

"use strict";

// Protect this page — redirect to login if not authenticated
if (typeof requireAuth === "function") requireAuth();

/* ═══════════════════════════════════════════════════════════════
   1. MOCK VIDEO DATASET
   ─────────────────────────────────────────────────────────────── */
const DEFAULT_VIDEOS = [
  {
    id: "v1",
    title: "Misty Mountains at Dawn — 4K Cinematic Ambient",
    description: "A breathtaking panorama of layered mountain peaks emerging from a thick morning mist. Shot at golden hour when the sky turns shades of rose and amber — perfect conditions for ambient drone photography.",
    category: "Nature",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70",
    uploader: "Sierra_Lens",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sierra",
    views: 142034,
    uploadTime: "3 hours ago",
    duration: "0:14",
    likes: 4821,
    dislikes: 12,
    comments: [
      { id: "c1", user: "NatureLover42", text: "Absolutely stunning! The mist is perfect.", time: "2h ago", likes: 24 },
      { id: "c2", user: "WanderlustAlex", text: "Where is this? I need to visit!", time: "1h ago", likes: 8 }
    ]
  },
  {
    id: "v2",
    title: "Tokyo Neon Nights Walkthrough — Street Food and Architecture",
    description: "Wandering through the labyrinthine streets of Shinjuku after midnight, where neon signs and rain-slicked pavement create an otherworldly tableau. Urban exploration at its finest.",
    category: "Technology",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70",
    uploader: "UrbanFrames",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=urban",
    views: 89122,
    uploadTime: "1 day ago",
    duration: "0:15",
    likes: 3104,
    dislikes: 45,
    comments: [
      { id: "c3", user: "CityNightOwl", text: "This captures Tokyo perfectly!", time: "20h ago", likes: 45 }
    ]
  },
  {
    id: "v3",
    title: "Developer Desk Setup — Clean Minimalism & Productivity",
    description: "The beauty of intentional minimalism — a clean desk setup where only the essentials remain. Featuring natural light streaming in from the left which highlights every form.",
    category: "Technology",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=70",
    uploader: "DeskSetupKing",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=desk",
    views: 212580,
    uploadTime: "5 hours ago",
    duration: "0:15",
    likes: 7550,
    dislikes: 90,
    comments: [
      { id: "c4", user: "DevLifestyle", text: "Clean setup goals.", time: "4h ago", likes: 112 },
      { id: "c5", user: "CodeAndCoffee", text: "What mechanical keyboard is that?", time: "3h ago", likes: 4 }
    ]
  },
  {
    id: "v4",
    title: "Golden Retriever Puppy Portrait — Cute Overload",
    description: "A six-week-old golden retriever puppy playing with suspicious confidence in the afternoon sun. Shot with a 50mm prime at f/1.8 for that dreamy, bokeh-heavy background.",
    category: "Animals",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=70",
    uploader: "PawPrints",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pawprints",
    views: 531980,
    uploadTime: "6 hours ago",
    duration: "0:15",
    likes: 18420,
    dislikes: 54,
    comments: [
      { id: "c6", user: "DoggoFanatic", text: "My heart 😭", time: "5h ago", likes: 890 },
      { id: "c7", user: "WoofWoof99", text: "I need one immediately.", time: "4h ago", likes: 12 }
    ]
  },
  {
    id: "v5",
    title: "Abstract Liquid Chromatic Motion Visuals",
    description: "Macro photography of oil and water suspended in a glass, backlit to reveal an otherworldly symphony of colour. Custom chillhop soundtrack to loop forever.",
    category: "Music",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=70",
    uploader: "ChromaticMacro",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chroma",
    views: 67399,
    uploadTime: "2 days ago",
    duration: "0:15",
    likes: 2890,
    dislikes: 10,
    comments: []
  },
  {
    id: "v6",
    title: "Brutalist Berlin Architecture Symmetry",
    description: "Looking straight up through the atrium of a 1970s Brutalist building in Berlin. Hypnotic geometry that rewards patient study.",
    category: "Nature",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=70",
    uploader: "ConcretePoet",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=concrete",
    views: 44021,
    uploadTime: "3 days ago",
    duration: "0:52",
    likes: 1680,
    dislikes: 38,
    comments: [
      { id: "c8", user: "ArchNerd", text: "Brutalism is so underrated.", time: "2d ago", likes: 9 }
    ]
  },
  {
    id: "v7",
    title: "Classic Cinematic Animation — Sintel Narrative Journey",
    description: "Experience the narrative adventure of Sintel on her journey to find her dragon companion. Masterclass in animation.",
    category: "Gaming",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=70",
    uploader: "EpicRenders",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=epic",
    views: 128456,
    uploadTime: "5 days ago",
    duration: "0:10",
    likes: 6734,
    dislikes: 110,
    comments: []
  },
  {
    id: "v8",
    title: "Copenhagen Minimalist Bedroom Interior Styling",
    description: "A stripback bedroom tour in Copenhagen focusing on clean wood tones and warm light. Scandinavian lifestyle inspiration.",
    category: "Cooking",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70",
    uploader: "NordicNest",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nordic",
    views: 76093,
    uploadTime: "1 week ago",
    duration: "12:14",
    likes: 3345,
    dislikes: 21,
    comments: [
      { id: "c9", user: "MinimalMindset", text: "The wood tones are chef's kiss.", time: "5d ago", likes: 33 }
    ]
  }
];

const CATEGORIES = ["All", "Nature", "Technology", "Music", "Gaming", "Animals", "Cooking"];

/* ═══════════════════════════════════════════════════════════════
   2. APPLICATION STATE WITH LOCAL STORAGE PERSISTENCE
   ─────────────────────────────────────────────────────────────── */
const state = {
  videos: [],
  likedVideos: new Set(),
  dislikedVideos: new Set(),
  subscribedChannels: new Set(),
  watchHistory: [],
  watchLater: new Set(),
  currentCategory: "All",
  searchQuery: "",
  isDarkMode: true,
  activeView: "feed", // "feed" | "watch" | "channel" | "subscriptions" | "liked" | "library"
  activeVideoId: null,
  activeChannelName: null,
  commentsSortOrder: "top", // "top" | "newest"
};

/** Load state from localStorage on init */
function loadState() {
  try {
    const rawVideos = localStorage.getItem("viewtube_videos");
    state.videos = rawVideos ? JSON.parse(rawVideos) : [...DEFAULT_VIDEOS];

    const rawLikes = localStorage.getItem("viewtube_liked");
    state.likedVideos = rawLikes ? new Set(JSON.parse(rawLikes)) : new Set();

    const rawDislikes = localStorage.getItem("viewtube_disliked");
    state.dislikedVideos = rawDislikes ? new Set(JSON.parse(rawDislikes)) : new Set();

    const rawSubs = localStorage.getItem("viewtube_subs");
    state.subscribedChannels = rawSubs ? new Set(JSON.parse(rawSubs)) : new Set(["Sierra_Lens"]);

    const rawHistory = localStorage.getItem("viewtube_history");
    state.watchHistory = rawHistory ? JSON.parse(rawHistory) : [];

    const rawLater = localStorage.getItem("viewtube_later");
    state.watchLater = rawLater ? new Set(JSON.parse(rawLater)) : new Set();

    const savedTheme = localStorage.getItem("viewtube_theme");
    state.isDarkMode = savedTheme !== "light";
  } catch (e) {
    console.error("Error loading localStorage state:", e);
    state.videos = [...DEFAULT_VIDEOS];
    state.likedVideos = new Set();
    state.dislikedVideos = new Set();
    state.subscribedChannels = new Set(["Sierra_Lens"]);
    state.watchHistory = [];
    state.watchLater = new Set();
  }
}

/** Save state to localStorage */
function saveState() {
  try {
    localStorage.setItem("viewtube_videos", JSON.stringify(state.videos));
    localStorage.setItem("viewtube_liked", JSON.stringify([...state.likedVideos]));
    localStorage.setItem("viewtube_disliked", JSON.stringify([...state.dislikedVideos]));
    localStorage.setItem("viewtube_subs", JSON.stringify([...state.subscribedChannels]));
    localStorage.setItem("viewtube_history", JSON.stringify(state.watchHistory));
    localStorage.setItem("viewtube_later", JSON.stringify([...state.watchLater]));
  } catch (e) {
    console.error("Error saving state to localStorage:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   3. TOAST NOTIFICATION SYSTEM
   ─────────────────────────────────────────────────────────────── */
const TOAST_ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

function showToast(message, type = "info", duration = 3000) {
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
  document.documentElement.classList.toggle("light-mode", !state.isDarkMode);
  const track = document.getElementById("theme-track");
  if (track) track.classList.toggle("active", !state.isDarkMode);
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  localStorage.setItem("viewtube_theme", state.isDarkMode ? "dark" : "light");
  initTheme();
  showToast(`${state.isDarkMode ? "Dark" : "Light"} mode enabled`, "info", 2000);
}

/* ═══════════════════════════════════════════════════════════════
   5. SIDEBAR drawer
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

/* ═══════════════════════════════════════════════════════════════
   6. SPA ROUTING ENGINE
   ─────────────────────────────────────────────────────────────── */
function parseHash() {
  const hash = window.location.hash || "#feed";
  const [route, queryStr] = hash.split("?");
  const params = {};
  if (queryStr) {
    queryStr.split("&").forEach(part => {
      const [k, v] = part.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v);
    });
  }
  return { route, params };
}

function navigateToRoute() {
  const { route, params } = parseHash();
  
  // Pause main video if transitioning away from watch view
  const mainVideo = document.getElementById("main-video");
  if (mainVideo) {
    mainVideo.pause();
  }

  // Hide all view panels
  document.querySelectorAll(".app-view").forEach(el => el.style.display = "none");
  
  // Reset active menu indicator
  document.querySelectorAll(".sidebar-item").forEach(item => item.classList.remove("active"));

  if (route === "#watch" && params.v) {
    state.activeView = "watch";
    state.activeVideoId = params.v;
    renderWatchPage(params.v);
    document.getElementById("watch-view").style.display = "block";
  } else if (route === "#channel" && params.c) {
    state.activeView = "channel";
    state.activeChannelName = params.c;
    renderChannelPage(params.c);
    document.getElementById("channel-view").style.display = "block";
    highlightSidebarLink("#channel");
  } else if (route === "#subscriptions") {
    state.activeView = "subscriptions";
    renderSubscriptionsPage();
    document.getElementById("subscriptions-view").style.display = "block";
    highlightSidebarLink("#subscriptions");
  } else if (route === "#liked") {
    state.activeView = "liked";
    renderLikedPage();
    document.getElementById("liked-view").style.display = "block";
    highlightSidebarLink("#liked");
  } else if (route === "#library") {
    state.activeView = "library";
    renderLibraryPage();
    document.getElementById("library-view").style.display = "block";
    highlightSidebarLink("#library");
  } else {
    // Default to feed
    state.activeView = "feed";
    document.getElementById("home-view").style.display = "block";
    highlightSidebarLink("#feed");
    renderImageGrid();
  }

  // Auto-close sidebar on mobile after navigations
  if (window.innerWidth <= 640) closeSidebar();
}

function highlightSidebarLink(href) {
  document.querySelectorAll(".sidebar-item").forEach(item => {
    if (item.getAttribute("href") === href) {
      item.classList.add("active");
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   7. RENDER HOMEPAGE GRID & CATEGORY CHIPS
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
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1000)     return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

function renderImageGrid() {
  const grid = document.getElementById("video-grid");
  if (!grid) return;

  let filtered = state.videos;

  if (state.currentCategory !== "All") {
    filtered = filtered.filter(v => v.category === state.currentCategory);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.uploader.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <h3>No videos found</h3>
        <p>Try searching for something else or choosing a different category chip.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((v, index) => `
    <article
      class="image-card"
      data-id="${v.id}"
      tabindex="0"
      role="link"
      style="animation-delay: ${index * 40}ms"
    >
      <div class="card-thumbnail">
        <img src="${v.thumbnailUrl}" alt="${v.title}" loading="lazy" />
        <span class="duration-badge">${v.duration}</span>
        <div class="card-overlay" aria-hidden="true">
          <span class="overlay-category">${v.category}</span>
        </div>
      </div>

      <div class="card-body">
        <a href="#channel?c=${encodeURIComponent(v.uploader)}" class="card-avatar-link">
          <div class="card-avatar">
            <img src="${v.uploaderAvatar}" alt="${v.uploader}" loading="lazy" />
          </div>
        </a>
        <div class="card-info">
          <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
          <div class="card-meta">
            <a href="#channel?c=${encodeURIComponent(v.uploader)}" class="card-uploader">
              ${escapeHtml(v.uploader)}
              <span class="verified-badge" title="Verified Creator">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </span>
            </a>
            <div class="card-stats">
              <span>${formatNumber(v.views)} views</span>
              <span class="dot">•</span>
              <span>${v.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Attach card clicks
  grid.querySelectorAll(".image-card").forEach(card => {
    const vidId = card.dataset.id;
    card.addEventListener("click", (e) => {
      // Don't navigate to watch if avatar link is clicked
      if (e.target.closest(".card-avatar-link") || e.target.closest(".card-uploader")) return;
      window.location.hash = `#watch?v=${vidId}`;
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.hash = `#watch?v=${vidId}`;
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. WATCH VIEW & CUSTOM VIDEO PLAYER LOGIC
   ─────────────────────────────────────────────────────────────── */
let playerControlsBound = false;

function renderWatchPage(videoId) {
  const v = state.videos.find(item => item.id === videoId);
  if (!v) {
    showToast("Video not found!", "error");
    window.location.hash = "#feed";
    return;
  }

  // Increment views
  v.views += 1;
  saveState();

  // Add to history
  state.watchHistory = state.watchHistory.filter(id => id !== videoId);
  state.watchHistory.unshift(videoId);
  saveState();

  // Hydrate text info
  document.getElementById("video-title").textContent = v.title;
  document.getElementById("video-views-count").textContent = `${v.views.toLocaleString()} views`;
  document.getElementById("video-upload-date").textContent = v.uploadTime;
  document.getElementById("video-category-tag").textContent = v.category;
  document.getElementById("video-description-text").textContent = v.description;

  // Hydrate creator details
  document.getElementById("video-channel-name").textContent = v.uploader;
  document.getElementById("video-channel-avatar").src = v.uploaderAvatar;
  document.getElementById("video-channel-link").setAttribute("href", `#channel?c=${encodeURIComponent(v.uploader)}`);

  // Channel subscriber updates
  updateSubscriberUI(v.uploader);

  // Sync likes count
  document.getElementById("video-likes").textContent = formatNumber(v.likes);
  document.getElementById("video-like-btn").classList.toggle("liked", state.likedVideos.has(v.id));

  // Sync watch later button
  document.getElementById("video-watch-later-btn").classList.toggle("liked", state.watchLater.has(v.id));

  // Set video source
  const videoEl = document.getElementById("main-video");
  videoEl.src = v.videoUrl;
  videoEl.load();

  // Dynamic ambient glow
  const glow = document.getElementById("ambient-glow");
  if (glow) {
    glow.style.backgroundImage = `url('${v.thumbnailUrl}')`;
  }

  // Render sidebar recommendations
  renderSidebarRecommendations(v.id);

  // Render comments list
  renderWatchComments(v.comments);

  // Wire up player controls if not done yet
  initVideoPlayerControls();
}

function updateSubscriberUI(uploader) {
  const subBtn = document.getElementById("subscribe-btn");
  const isSubbed = state.subscribedChannels.has(uploader);
  subBtn.classList.toggle("subscribed", isSubbed);
  subBtn.textContent = isSubbed ? "Subscribed" : "Subscribe";

  // Simulate total channel subscribers
  let baseSubs = 120500; // default baseline
  if (uploader === "Sierra_Lens") baseSubs = 142000;
  if (uploader === "UrbanFrames") baseSubs = 89000;
  if (uploader === "DeskSetupKing") baseSubs = 212000;
  if (uploader === "PawPrints") baseSubs = 531000;

  const totalSubs = isSubbed ? baseSubs + 1 : baseSubs;
  document.getElementById("video-sub-count").textContent = `${totalSubs.toLocaleString()} subscribers`;
}

function renderSidebarRecommendations(activeId) {
  const list = document.getElementById("recommended-videos");
  if (!list) return;

  const filtered = state.videos.filter(v => v.id !== activeId);

  list.innerHTML = filtered.map(v => `
    <div class="side-video-card" data-id="${v.id}">
      <div class="side-thumbnail">
        <img src="${v.thumbnailUrl}" alt="${v.title}" loading="lazy" />
        <span class="duration-badge">${v.duration}</span>
      </div>
      <div class="side-info">
        <h4 class="side-title">${escapeHtml(v.title)}</h4>
        <div class="side-meta">
          <span>${escapeHtml(v.uploader)}</span>
          <span>${formatNumber(v.views)} views • ${v.uploadTime}</span>
        </div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".side-video-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.hash = `#watch?v=${card.dataset.id}`;
    });
  });
}

/** Controls Logic for Custom Video Player */
function initVideoPlayerControls() {
  if (playerControlsBound) return;
  playerControlsBound = true;

  const video = document.getElementById("main-video");
  const container = document.getElementById("video-player-container");
  const playBtn = document.getElementById("player-play-btn");
  const muteBtn = document.getElementById("player-mute-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const currentTimeEl = document.getElementById("current-time");
  const durationTimeEl = document.getElementById("duration-time");
  const progressBar = document.getElementById("progress-current");
  const progressBuffered = document.getElementById("progress-buffered");
  const progressScrubber = document.getElementById("progress-scrubber");
  const progressContainer = document.getElementById("progress-container");
  const speedBtn = document.getElementById("player-speed-btn");
  const speedDropdown = document.getElementById("speed-dropdown");
  const theaterBtn = document.getElementById("theater-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const clickOverlay = document.getElementById("video-click-overlay");

  // Play / Pause toggler
  function togglePlay() {
    if (video.paused) {
      video.play();
      showCenterIcon("<svg viewBox='0 0 24 24' width='38' height='38'><path fill='currentColor' d='M8 5v14l11-7z'/></svg>");
    } else {
      video.pause();
      showCenterIcon("<svg viewBox='0 0 24 24' width='38' height='38'><path fill='currentColor' d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/></svg>");
    }
  }

  function showCenterIcon(iconHtml) {
    const centerIcon = document.getElementById("video-center-icon");
    centerIcon.innerHTML = iconHtml;
    clickOverlay.style.opacity = "1";
    setTimeout(() => {
      clickOverlay.style.opacity = "";
    }, 400);
  }

  playBtn.addEventListener("click", togglePlay);
  clickOverlay.addEventListener("click", togglePlay);

  video.addEventListener("play", () => {
    playBtn.querySelector(".play-icon").style.display = "none";
    playBtn.querySelector(".pause-icon").style.display = "block";
  });

  video.addEventListener("pause", () => {
    playBtn.querySelector(".play-icon").style.display = "block";
    playBtn.querySelector(".pause-icon").style.display = "none";
  });

  // Time Updates
  video.addEventListener("timeupdate", () => {
    const current = video.currentTime;
    const dur = video.duration || 0;
    
    // Elapsed duration formatting
    currentTimeEl.textContent = formatTime(current);
    if (!isNaN(dur)) {
      durationTimeEl.textContent = formatTime(dur);
      const pct = (current / dur) * 100;
      progressBar.style.width = `${pct}%`;
      progressScrubber.style.left = `${pct}%`;
    }
  });

  // Buffer details progress
  video.addEventListener("progress", () => {
    const dur = video.duration || 0;
    if (dur > 0 && video.buffered.length > 0) {
      const end = video.buffered.end(video.buffered.length - 1);
      const pct = (end / dur) * 100;
      progressBuffered.style.width = `${pct}%`;
    }
  });

  // Drag scrubber seek bar
  let isSeeking = false;
  
  function seekToPosition(e) {
    const dur = video.duration;
    if (!dur) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampPos = Math.max(0, Math.min(1, pos));
    video.currentTime = clampPos * dur;
  }

  progressContainer.addEventListener("mousedown", (e) => {
    isSeeking = true;
    seekToPosition(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isSeeking) seekToPosition(e);
  });

  document.addEventListener("mouseup", () => {
    isSeeking = false;
  });

  // Volume slider control
  volumeSlider.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    video.volume = val;
    video.muted = val === 0;
    updateVolumeIcon(val, video.muted);
  });

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    updateVolumeIcon(video.volume, video.muted);
  });

  function updateVolumeIcon(vol, isMuted) {
    if (isMuted || vol === 0) {
      muteBtn.querySelector(".volume-high-icon").style.display = "none";
      muteBtn.querySelector(".volume-mute-icon").style.display = "block";
    } else {
      muteBtn.querySelector(".volume-high-icon").style.display = "block";
      muteBtn.querySelector(".volume-mute-icon").style.display = "none";
    }
  }

  // Playback rates
  speedDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const rate = Number(btn.dataset.speed);
      video.playbackRate = rate;
      speedBtn.textContent = rate === 1 ? "Normal" : `${rate}x`;
      speedDropdown.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Theater Mode toggling
  theaterBtn.addEventListener("click", () => {
    container.classList.toggle("theater");
  });

  // Fullscreen trigger
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        showToast("Error enabling fullscreen", "error");
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const isFull = !!document.fullscreenElement;
    fullscreenBtn.querySelector(".fullscreen-enter-icon").style.display = isFull ? "none" : "block";
    fullscreenBtn.querySelector(".fullscreen-exit-icon").style.display = isFull ? "block" : "none";
  });

  // Keyboard shortcut listener (Space for pause, L to seek forward, J to seek backward)
  document.addEventListener("keydown", (e) => {
    if (state.activeView !== "watch") return;
    
    // Ignore keys in active input fields
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      return;
    }

    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "f") {
      e.preventDefault();
      fullscreenBtn.click();
    } else if (e.key === "t") {
      e.preventDefault();
      theaterBtn.click();
    } else if (e.key === "m") {
      e.preventDefault();
      muteBtn.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 5);
      showToast("Seek backward 5s", "info", 1000);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
      showToast("Seek forward 5s", "info", 1000);
    }
  });
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/* ═══════════════════════════════════════════════════════════════
   9. WATCH INTERACTIONS: LIKES, DESCRIPTION BOX, COMMENTS
   ─────────────────────────────────────────────────────────────── */
function initWatchInteractions() {
  // Video Like Button click
  document.getElementById("video-like-btn").addEventListener("click", () => {
    const vidId = state.activeVideoId;
    if (!vidId) return;

    const v = state.videos.find(item => item.id === vidId);
    if (!v) return;

    const likeBtn = document.getElementById("video-like-btn");
    const isLiked = state.likedVideos.has(vidId);

    if (isLiked) {
      state.likedVideos.delete(vidId);
      v.likes -= 1;
      likeBtn.classList.remove("liked");
      showToast("Removed like", "info", 1500);
    } else {
      state.likedVideos.add(vidId);
      v.likes += 1;
      likeBtn.classList.add("liked");
      showToast("Video Liked! 👍", "success", 1500);
    }

    document.getElementById("video-likes").textContent = formatNumber(v.likes);
    saveState();
  });

  // Video Dislike Button
  document.getElementById("video-dislike-btn").addEventListener("click", () => {
    const vidId = state.activeVideoId;
    const dislikeBtn = document.getElementById("video-dislike-btn");
    
    if (state.dislikedVideos.has(vidId)) {
      state.dislikedVideos.delete(vidId);
      dislikeBtn.classList.remove("liked");
    } else {
      state.dislikedVideos.add(vidId);
      dislikeBtn.classList.add("liked");
      // Remove like if it was liked
      if (state.likedVideos.has(vidId)) {
        document.getElementById("video-like-btn").click();
      }
      showToast("Video Disliked!", "info", 1500);
    }
    saveState();
  });

  // Watch Later button
  document.getElementById("video-watch-later-btn").addEventListener("click", () => {
    const vidId = state.activeVideoId;
    if (!vidId) return;

    const btn = document.getElementById("video-watch-later-btn");
    if (state.watchLater.has(vidId)) {
      state.watchLater.delete(vidId);
      btn.classList.remove("liked");
      showToast("Removed from Watch Later queue", "info", 1500);
    } else {
      state.watchLater.add(vidId);
      btn.classList.add("liked");
      showToast("Added to Watch Later queue! 🕒", "success", 1500);
    }
    saveState();
  });

  // Share button copy
  document.getElementById("video-share-btn").addEventListener("click", () => {
    const mockUrl = `${window.location.origin}${window.location.pathname}#watch?v=${state.activeVideoId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mockUrl).then(() => {
        showToast("Video URL copied to clipboard!", "success");
      });
    } else {
      window.prompt("Copy link:", mockUrl);
    }
  });

  // Subscribe Watch button click
  document.getElementById("subscribe-btn").addEventListener("click", () => {
    const v = state.videos.find(item => item.id === state.activeVideoId);
    if (!v) return;

    const isSubbed = state.subscribedChannels.has(v.uploader);
    if (isSubbed) {
      state.subscribedChannels.delete(v.uploader);
      showToast(`Unsubscribed from ${v.uploader}`, "info");
    } else {
      state.subscribedChannels.add(v.uploader);
      showToast(`Subscribed to ${v.uploader}! 🔔`, "success");
    }
    updateSubscriberUI(v.uploader);
    saveState();
  });

  // Collapsible description toggle
  const descBox = document.getElementById("description-box");
  const descToggle = document.getElementById("description-toggle");
  
  descBox.addEventListener("click", () => {
    descBox.classList.toggle("expanded");
    descToggle.textContent = descBox.classList.contains("expanded") ? "Show less" : "Show more";
  });

  // Comment buttons display toggle
  const textInput = document.getElementById("comment-input-textarea");
  const buttonsPanel = document.getElementById("comment-buttons");
  const cancelComment = document.getElementById("comment-cancel");
  const postComment = document.getElementById("comment-submit-btn");

  textInput.addEventListener("focus", () => {
    buttonsPanel.style.display = "flex";
  });

  textInput.addEventListener("input", (e) => {
    const hasText = e.target.value.trim().length > 0;
    postComment.disabled = !hasText;
    postComment.classList.toggle("ready", hasText);
  });

  cancelComment.addEventListener("click", () => {
    textInput.value = "";
    buttonsPanel.style.display = "none";
    postComment.disabled = true;
    postComment.classList.remove("ready");
  });

  postComment.addEventListener("click", () => {
    const val = textInput.value.trim();
    if (!val) return;

    const vid = state.videos.find(item => item.id === state.activeVideoId);
    if (!vid) return;

    let user = { username: "Guest" };
    try {
      user = JSON.parse(sessionStorage.getItem("pictube_user") || '{"username":"Guest"}');
    } catch (_) {}

    const newComment = {
      id: "c" + Date.now(),
      user: user.username || "You",
      text: val,
      time: "Just now",
      likes: 0
    };

    vid.comments.unshift(newComment);
    saveState();

    textInput.value = "";
    postComment.disabled = true;
    postComment.classList.remove("ready");
    buttonsPanel.style.display = "none";

    renderWatchComments(vid.comments);
    showToast("Comment published!", "success");
  });

  // Sort dropdown
  const sortBtn = document.getElementById("sort-btn");
  const sortDropdown = document.getElementById("sort-dropdown");
  
  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    sortDropdown.classList.remove("open");
  });

  sortDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.sort;
      state.commentsSortOrder = mode;
      sortDropdown.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const vid = state.videos.find(item => item.id === state.activeVideoId);
      if (vid) renderWatchComments(vid.comments);
    });
  });
}

function renderWatchComments(comments) {
  const list = document.getElementById("watch-comments-list");
  if (!list) return;

  document.getElementById("comments-count").textContent = `${comments.length} comments`;

  if (comments.length === 0) {
    list.innerHTML = `<p class="text-sm text-muted" style="padding: 1rem 0;">No comments yet. Be the first to start the conversation!</p>`;
    return;
  }

  // Sort logic
  const sorted = [...comments];
  if (state.commentsSortOrder === "top") {
    sorted.sort((a, b) => b.likes - a.likes);
  }

  list.innerHTML = sorted.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.user)}" alt="${c.user}" loading="lazy" />
      </div>
      <div class="comment-bubble">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <p class="comment-username">${escapeHtml(c.user)}</p>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${c.time}</span>
        </div>
        <p class="comment-text">${escapeHtml(c.text)}</p>
        <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.35rem; color: var(--text-secondary); font-size: 0.75rem;">
          <button class="comment-like-btn" data-id="${c.id}" style="display: flex; align-items: center; gap: 0.15rem;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
            <span>${c.likes}</span>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".comment-like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const commId = btn.dataset.id;
      const c = comments.find(item => item.id === commId);
      if (c) {
        c.likes += 1;
        saveState();
        renderWatchComments(comments);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   10. SPA VIEW RENDERERS: CHANNEL, SUBS, LIKED, LIBRARY
   ─────────────────────────────────────────────────────────────── */
function renderChannelPage(channelName) {
  // Sync page metadata
  document.getElementById("channel-header-name").textContent = channelName;
  document.getElementById("channel-header-handle").textContent = `@${channelName.toLowerCase().replace(/\s+/g, "")}`;
  
  const creatorAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(channelName)}`;
  document.getElementById("channel-header-avatar").src = creatorAvatar;

  // Filter channel's specific uploads
  const creatorVideos = state.videos.filter(v => v.uploader === channelName);
  document.getElementById("channel-header-video-count").textContent = `${creatorVideos.length} videos`;
  document.getElementById("channel-about-desc").textContent = `Welcome to the official channel of ${channelName}! Enjoy cinematic travel clips, tutorials, and lifestyle walkthrough loops.`;

  // Render video list
  const grid = document.getElementById("channel-videos-grid");
  if (creatorVideos.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><h3>No uploads yet</h3></div>`;
  } else {
    grid.innerHTML = creatorVideos.map(v => `
      <article class="image-card" data-id="${v.id}">
        <div class="card-thumbnail">
          <img src="${v.thumbnailUrl}" alt="${v.title}" />
          <span class="duration-badge">${v.duration}</span>
        </div>
        <div class="card-body" style="padding: 0.75rem 0.25rem;">
          <div class="card-info">
            <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
            <div class="card-meta">
              <span class="card-stats">${formatNumber(v.views)} views • ${v.uploadTime}</span>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll(".image-card").forEach(card => {
      card.addEventListener("click", () => {
        window.location.hash = `#watch?v=${card.dataset.id}`;
      });
    });
  }

  // Hook Channel page subscribe button
  const subBtn = document.getElementById("channel-page-subscribe-btn");
  const isSubbed = state.subscribedChannels.has(channelName);
  subBtn.classList.toggle("subscribed", isSubbed);
  subBtn.textContent = isSubbed ? "Subscribed" : "Subscribe";

  subBtn.replaceWith(subBtn.cloneNode(true)); // remove previous listeners
  const newSubBtn = document.getElementById("channel-page-subscribe-btn");
  newSubBtn.addEventListener("click", () => {
    if (state.subscribedChannels.has(channelName)) {
      state.subscribedChannels.delete(channelName);
      newSubBtn.textContent = "Subscribe";
      newSubBtn.classList.remove("subscribed");
      showToast(`Unsubscribed from ${channelName}`, "info");
    } else {
      state.subscribedChannels.add(channelName);
      newSubBtn.textContent = "Subscribed";
      newSubBtn.classList.add("subscribed");
      showToast(`Subscribed to ${channelName}! 🔔`, "success");
    }
    saveState();
  });
}

function renderSubscriptionsPage() {
  const grid = document.getElementById("subscriptions-grid");
  if (!grid) return;

  const filtered = state.videos.filter(v => state.subscribedChannels.has(v.uploader));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 4rem 1rem;">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        <h3>Your subscriptions feed is empty</h3>
        <p>Subscribe to channels from the watch pages to see their new releases here!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(v => `
    <article class="image-card" data-id="${v.id}">
      <div class="card-thumbnail">
        <img src="${v.thumbnailUrl}" alt="${v.title}" />
        <span class="duration-badge">${v.duration}</span>
      </div>
      <div class="card-body">
        <div class="card-avatar">
          <img src="${v.uploaderAvatar}" alt="${v.uploader}" />
        </div>
        <div class="card-info">
          <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
          <div class="card-meta">
            <span class="card-uploader">${escapeHtml(v.uploader)}</span>
            <div class="card-stats">
              <span>${formatNumber(v.views)} views • ${v.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".image-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.hash = `#watch?v=${card.dataset.id}`;
    });
  });
}

function renderLikedPage() {
  const grid = document.getElementById("liked-grid");
  if (!grid) return;

  const filtered = state.videos.filter(v => state.likedVideos.has(v.id));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 4rem 1rem;">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <h3>No liked videos yet</h3>
        <p>Videos you like will show up here.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(v => `
    <article class="image-card" data-id="${v.id}">
      <div class="card-thumbnail">
        <img src="${v.thumbnailUrl}" alt="${v.title}" />
        <span class="duration-badge">${v.duration}</span>
      </div>
      <div class="card-body">
        <div class="card-avatar">
          <img src="${v.uploaderAvatar}" alt="${v.uploader}" />
        </div>
        <div class="card-info">
          <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
          <div class="card-meta">
            <span class="card-uploader">${escapeHtml(v.uploader)}</span>
            <div class="card-stats">
              <span>${formatNumber(v.views)} views • ${v.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".image-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.hash = `#watch?v=${card.dataset.id}`;
    });
  });
}

function renderLibraryPage() {
  const historyGrid = document.getElementById("history-grid");
  const laterGrid = document.getElementById("watch-later-grid");

  // Render History
  const historyVideos = state.watchHistory
    .map(id => state.videos.find(v => v.id === id))
    .filter(Boolean);

  if (historyVideos.length === 0) {
    historyGrid.innerHTML = `<p class="text-sm text-muted" style="padding: 1rem 0;">No watch history yet.</p>`;
  } else {
    historyGrid.innerHTML = historyVideos.map(v => `
      <article class="image-card" data-id="${v.id}">
        <div class="card-thumbnail">
          <img src="${v.thumbnailUrl}" alt="${v.title}" />
          <span class="duration-badge">${v.duration}</span>
        </div>
        <div class="card-body" style="padding: 0.75rem 0.25rem;">
          <div class="card-info">
            <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
            <div class="card-meta">
              <span class="card-uploader">${escapeHtml(v.uploader)}</span>
              <span class="card-stats">${formatNumber(v.views)} views</span>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    historyGrid.querySelectorAll(".image-card").forEach(card => {
      card.addEventListener("click", () => {
        window.location.hash = `#watch?v=${card.dataset.id}`;
      });
    });
  }

  // Render Watch Later
  const laterVideos = state.videos.filter(v => state.watchLater.has(v.id));

  if (laterVideos.length === 0) {
    laterGrid.innerHTML = `<p class="text-sm text-muted" style="padding: 1rem 0;">No videos saved to watch later.</p>`;
  } else {
    laterGrid.innerHTML = laterVideos.map(v => `
      <article class="image-card" data-id="${v.id}">
        <div class="card-thumbnail">
          <img src="${v.thumbnailUrl}" alt="${v.title}" />
          <span class="duration-badge">${v.duration}</span>
        </div>
        <div class="card-body" style="padding: 0.75rem 0.25rem;">
          <div class="card-info">
            <a href="#watch?v=${v.id}"><p class="card-title">${escapeHtml(v.title)}</p></a>
            <div class="card-meta">
              <span class="card-uploader">${escapeHtml(v.uploader)}</span>
              <span class="card-stats">${formatNumber(v.views)} views</span>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    laterGrid.querySelectorAll(".image-card").forEach(card => {
      card.addEventListener("click", () => {
        window.location.hash = `#watch?v=${card.dataset.id}`;
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   11. DYNAMIC UPLOADER SYSTEM
   ─────────────────────────────────────────────────────────────── */
function openUploadModal() {
  document.getElementById("upload-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeUploadModal() {
  document.getElementById("upload-modal").classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("upload-form").reset();
  const preview = document.getElementById("drop-preview");
  const dropContent = document.getElementById("drop-content");
  if (preview) { preview.style.display = "none"; preview.src = ""; }
  if (dropContent) dropContent.style.display = "block";
}

function handleUploadFileSelect(file) {
  const preview = document.getElementById("drop-preview");
  const dropContent = document.getElementById("drop-content");
  
  // Set a mock thumbnail for the video card preview
  preview.src = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=70";
  preview.style.display = "block";
  dropContent.style.display = "none";
  showToast(`File selected: ${file.name}`, "info");
}

function initUploadModal() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  if (!dropZone) return;

  dropZone.addEventListener("click", () => fileInput.click());
  
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) handleUploadFileSelect(file);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleUploadFileSelect(file);
  });

  // Handle Form Submission
  document.getElementById("upload-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("upload-title").value.trim();
    const category = document.getElementById("upload-category").value;
    const desc = document.getElementById("upload-desc").value.trim();
    const customUrl = document.getElementById("upload-url").value.trim();

    if (!title) {
      showToast("Title is required", "warning");
      return;
    }

    // Default mock uploader username
    let user = { username: "You", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you" };
    try {
      const stored = sessionStorage.getItem("pictube_user");
      if (stored) user = JSON.parse(stored);
    } catch (_) {}

    const videoUrl = customUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
    
    // Choose a high-quality mockup category-specific splash image if no custom preview
    let thumb = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=70";
    if (category === "Nature") thumb = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=70";
    if (category === "Technology") thumb = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70";
    if (category === "Music") thumb = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=70";

    const newVideo = {
      id: "v_" + Date.now(),
      title: title,
      description: desc || "No description provided.",
      category: category,
      videoUrl: videoUrl,
      thumbnailUrl: thumb,
      uploader: user.username || "You",
      uploaderAvatar: user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      views: 0,
      uploadTime: "Just now",
      duration: "0:15",
      likes: 0,
      dislikes: 0,
      comments: []
    };

    state.videos.unshift(newVideo);
    saveState();

    closeUploadModal();
    
    // Go to feed view
    window.location.hash = "#feed";
    navigateToRoute();
    
    showToast(`"${title}" published successfully! 🚀`, "success");
  });
}

/* ═══════════════════════════════════════════════════════════════
   12. USER UI HYDRATION & SEARCH
   ─────────────────────────────────────────────────────────────── */
function hydrateUserUI() {
  let user = { username: "Guest", email: "guest@viewtube.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest" };
  try {
    const stored = sessionStorage.getItem("pictube_user");
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  const avatarImg = document.getElementById("header-avatar-img");
  if (avatarImg) avatarImg.src = user.avatar;

  const nameEl = document.getElementById("dropdown-username");
  const emailEl = document.getElementById("dropdown-email");
  if (nameEl) nameEl.textContent = user.username;
  if (emailEl) emailEl.textContent = user.email;

  // Sync avatar inside watch comments row
  const commentAvatar = document.getElementById("comment-user-avatar");
  if (commentAvatar) commentAvatar.src = user.avatar;
}

function initSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    if (state.activeView !== "feed") {
      window.location.hash = "#feed";
    }
    renderImageGrid();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ═══════════════════════════════════════════════════════════════
   13. APPLICATION BOOT
   ─────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // ── A. Load data from localstorage ──
  loadState();

  // ── B. Populate user profile ──
  hydrateUserUI();

  // ── C. Apply saved theme ──
  initTheme();

  // ── D. Theme Toggle ──
  const themeTrack = document.getElementById("theme-track");
  if (themeTrack) themeTrack.addEventListener("click", toggleTheme);

  // ── E. Mobile menu togglers ──
  const hamburgerBtn = document.getElementById("hamburger-btn");
  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);

  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  // ── F. Avatar Dropdown click ──
  const avatarBtn = document.getElementById("avatar-btn");
  if (avatarBtn) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById("avatar-dropdown");
      dropdown.classList.toggle("open");
    });
  }
  document.addEventListener("click", () => {
    const dropdown = document.getElementById("avatar-dropdown");
    if (dropdown) dropdown.classList.remove("open");
  });

  // ── G. Logout ──
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (typeof logout === "function") logout();
    });
  }

  // ── H. Category chips bar ──
  renderCategoryChips();
  const bar = document.getElementById("category-bar");
  if (bar) {
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.currentCategory = chip.dataset.category;
      bar.querySelectorAll(".chip").forEach(c => {
        c.classList.toggle("active", c.dataset.category === state.currentCategory);
      });
      renderImageGrid();
    });
  }

  // ── I. Live search ──
  initSearch();

  // ── J. Upload modal events ──
  const uploadBtn = document.getElementById("upload-btn");
  if (uploadBtn) uploadBtn.addEventListener("click", openUploadModal);

  const closeUploadBtn = document.getElementById("close-upload-modal");
  if (closeUploadBtn) closeUploadBtn.addEventListener("click", closeUploadModal);

  const uploadModal = document.getElementById("upload-modal");
  if (uploadModal) {
    uploadModal.addEventListener("click", (e) => {
      if (e.target === uploadModal) closeUploadModal();
    });
  }
  initUploadModal();

  // ── K. Library actions ──
  const clearHistBtn = document.getElementById("clear-history-btn");
  if (clearHistBtn) {
    clearHistBtn.addEventListener("click", () => {
      state.watchHistory = [];
      saveState();
      renderLibraryPage();
      showToast("Watch history cleared", "info");
    });
  }

  // ── L. Escape listener for modals ──
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeUploadModal();
      closeSidebar();
    }
  });

  // ── M. Channel Navigation Tab switches ──
  document.querySelectorAll(".tab-item").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const panel = tab.dataset.tab;
      document.getElementById("channel-panel-videos").style.display = panel === "videos" ? "block" : "none";
      document.getElementById("channel-panel-about").style.display = panel === "about" ? "block" : "none";
    });
  });

  // ── N. Init Watch view UI button events ──
  initWatchInteractions();

  // ── O. Hash SPA routing initial start ──
  window.addEventListener("hashchange", navigateToRoute);
  navigateToRoute();

  // ── P. Welcome notification toast ──
  setTimeout(() => {
    let name = "there";
    try {
      const user = JSON.parse(sessionStorage.getItem("pictube_user") || "{}");
      name = user.username || "there";
    } catch (_) {}
    showToast(`Welcome to ViewTube, ${name}! 🎬`, "success", 2500);
  }, 800);
});
