/**
 * app.js — PicTube Homepage Application Logic
 * ════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 *   1.  Mock Image Dataset (8 sample images)
 *   2.  Application State
 *   3.  Toast Notification System
 *   4.  Theme Manager (Dark / Light toggle)
 *   5.  Sidebar Manager (open/close on mobile)
 *   6.  Avatar Dropdown Manager
 *   7.  Category Chips & Filtering
 *   8.  Search Filtering
 *   9.  Image Grid Renderer
 *  10.  Image Detail Modal
 *  11.  Like / Share / Download Interactions
 *  12.  Comment System
 *  13.  Upload Modal
 *  14.  Header User Hydration
 *  15.  Application Boot
 * ════════════════════════════════════════════════════════════════
 */

"use strict"; // Enable strict mode for cleaner error messages

// Protect this page — redirect to login if not authenticated
// requireAuth() and getCurrentUser() are defined in auth.js
if (typeof requireAuth === "function") requireAuth();


/* ═══════════════════════════════════════════════════════════════
   1. MOCK IMAGE DATASET
   Each object represents one image card on the homepage.
   In a real app this data would come from a REST API / database.
   Using Unsplash "source" URLs so we get real photos reliably.
   ─────────────────────────────────────────────────────────────── */
const MOCK_IMAGES = [
  {
    id: 1,
    title: "Misty Mountains at Dawn",
    description:
      "A breathtaking panorama of layered mountain peaks emerging from a thick morning mist. Shot at golden hour when the sky turns shades of rose and amber — perfect conditions for long-exposure landscape photography.",
    category: "Nature",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70",
    uploader: "Sierra_Lens",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sierra",
    views: "142K",
    uploadTime: "3 hours ago",
    likes: 4821,
    comments: [
      { user: "NatureLover42", text: "Absolutely stunning! The mist is perfect.", time: "2h ago" },
      { user: "WanderlustAlex", text: "Where is this? I need to visit!", time: "1h ago" }
    ]
  },
  {
    id: 2,
    title: "Tokyo Neon Nights",
    description:
      "Wandering through the labyrinthine streets of Shinjuku after midnight, where neon signs and rain-slicked pavement create an otherworldly tableau. Urban photography meets long-exposure light trails.",
    category: "Architecture",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70",
    uploader: "UrbanFrames",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=urban",
    views: "89K",
    uploadTime: "1 day ago",
    likes: 3104,
    comments: [
      { user: "CityNightOwl", text: "This captures Tokyo perfectly!", time: "20h ago" }
    ]
  },
  {
    id: 3,
    title: "MacBook Pro Minimal Workspace",
    description:
      "The beauty of intentional minimalism — a clean desk setup where only the essentials remain. Natural light streaming in from the left creates soft shadows that accentuate every geometric form.",
    category: "Technology",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=70",
    uploader: "DeskSetupKing",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=desk",
    views: "212K",
    uploadTime: "5 hours ago",
    likes: 7550,
    comments: [
      { user: "DevLifestyle", text: "Clean setup goals.", time: "4h ago" },
      { user: "CodeAndCoffee", text: "What keyboard is that?", time: "3h ago" }
    ]
  },
  {
    id: 4,
    title: "Abstract Liquid Chromatic",
    description:
      "Macro photography of oil and water suspended in a glass, backlit to reveal an otherworldly symphony of colour. Every frame is unique — no two shots are ever the same.",
    category: "Abstract",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=70",
    uploader: "ChromaticMacro",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chroma",
    views: "67K",
    uploadTime: "2 days ago",
    likes: 2890,
    comments: []
  },
  {
    id: 5,
    title: "Golden Retriever Puppy Portrait",
    description:
      "A six-week-old golden retriever posing with suspicious confidence in the afternoon sun. Shot with a 50mm prime at f/1.8 for that dreamy, bokeh-heavy background that makes the eyes pop.",
    category: "Animals",
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=70",
    uploader: "PawPrints",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pawprints",
    views: "531K",
    uploadTime: "6 hours ago",
    likes: 18420,
    comments: [
      { user: "DoggoFanatic", text: "My heart 😭", time: "5h ago" },
      { user: "WoofWoof99", text: "I need one immediately.", time: "4h ago" },
      { user: "FluffLover", text: "Those eyes!! Pure soul.", time: "2h ago" }
    ]
  },
  {
    id: 6,
    title: "Brutalist Berlin Architecture",
    description:
      "Looking straight up through the atrium of a 1970s Brutalist government building in Berlin. The raw concrete geometry creates a hypnotic symmetry that rewards patient study.",
    category: "Architecture",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=70",
    uploader: "ConcretePoet",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=concrete",
    views: "44K",
    uploadTime: "3 days ago",
    likes: 1680,
    comments: [
      { user: "ArchNerd", text: "Brutalism is so underrated.", time: "2d ago" }
    ]
  },
  {
    id: 7,
    title: "Frozen Leaf in Winter Ice",
    description:
      "A single maple leaf suspended in translucent ice, captured at the edge of a frozen pond in northern Canada. Temperature was -18°C — photographing with bare hands lasted about 90 seconds.",
    category: "Nature",
    url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=70",
    uploader: "FrostFrames",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frost",
    views: "28K",
    uploadTime: "4 days ago",
    likes: 987,
    comments: []
  },
  {
    id: 8,
    title: "Scandinavian Minimal Interior",
    description:
      "The bedroom of a Copenhagen apartment stripped back to its pure Scandinavian essence — white walls, warm wood tones, a single pendant lamp. Less is indeed more.",
    category: "Minimalism",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70",
    uploader: "NordicNest",
    uploaderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nordic",
    views: "76K",
    uploadTime: "1 week ago",
    likes: 3345,
    comments: [
      { user: "MinimalMindset", text: "The lamp placement is chef's kiss.", time: "5d ago" }
    ]
  }
];

/* All available category filters */
const CATEGORIES = ["All", "Nature", "Technology", "Architecture", "Minimalism", "Animals", "Abstract"];


/* ═══════════════════════════════════════════════════════════════
   2. APPLICATION STATE
   Centralising mutable state makes it easy to track what's active.
   ─────────────────────────────────────────────────────────────── */
const state = {
  currentCategory: "All",     // which category chip is selected
  searchQuery:     "",         // current search string
  isDarkMode:      true,       // theme flag (dark by default)
  images:          [...MOCK_IMAGES], // local copy (we'll add to this on upload)
  activeModal:     null,       // which modal is open (null | "detail" | "upload")
  activeImageId:   null,       // id of the image open in the detail modal
  likedImages:     new Set(),  // tracks which image IDs the user has liked
};


/* ═══════════════════════════════════════════════════════════════
   3. TOAST NOTIFICATION SYSTEM
   showToast(message, type) — creates a snackbar in the bottom-right.
   type can be: "success" | "error" | "info" | "warning"
   ─────────────────────────────────────────────────────────────── */

// SVG icons for each toast type
const TOAST_ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

/**
 * showToast — displays a temporary notification snackbar.
 * @param {string} message - Text to display
 * @param {string} [type="info"] - "success" | "error" | "info" | "warning"
 * @param {number} [duration=3500] - How long to show in ms
 */
function showToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Create the toast element
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

  // Trigger the CSS fade-in (needs one frame delay so transition fires)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("visible"));
  });

  // Function to dismiss this particular toast
  function dismissToast() {
    toast.classList.remove("visible");
    // Wait for fade-out transition to finish before removing from DOM
    setTimeout(() => toast.remove(), 350);
  }

  // Auto-dismiss after duration
  const autoTimeout = setTimeout(dismissToast, duration);

  // Manual dismiss via the × button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(autoTimeout);
    dismissToast();
  });
}


/* ═══════════════════════════════════════════════════════════════
   4. THEME MANAGER
   Reads/writes localStorage so the choice persists across visits.
   ─────────────────────────────────────────────────────────────── */

function initTheme() {
  // Read saved preference; default to dark
  const saved = localStorage.getItem("pictube_theme");
  state.isDarkMode = saved !== "light"; // if "light" saved, light mode; otherwise dark
  applyTheme();
}

function applyTheme() {
  // Toggle the class on <html> — CSS variables switch automatically
  document.documentElement.classList.toggle("light-mode", !state.isDarkMode);

  // Sync the toggle track UI
  const track = document.getElementById("theme-track");
  if (track) track.classList.toggle("active", !state.isDarkMode);
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  localStorage.setItem("pictube_theme", state.isDarkMode ? "dark" : "light");
  applyTheme();
  showToast(`${state.isDarkMode ? "Dark" : "Light"} mode enabled`, "info", 2000);
}


/* ═══════════════════════════════════════════════════════════════
   5. SIDEBAR MANAGER
   On mobile, the sidebar slides in from the left.
   ─────────────────────────────────────────────────────────────── */

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-overlay").classList.add("visible");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("visible");
  document.body.style.overflow = "";
}


/* ═══════════════════════════════════════════════════════════════
   6. AVATAR DROPDOWN MANAGER
   ─────────────────────────────────────────────────────────────── */

function toggleAvatarDropdown() {
  const dropdown = document.getElementById("avatar-dropdown");
  const isOpen = dropdown.classList.toggle("open");
  // Update accessibility attribute
  document.getElementById("avatar-btn").setAttribute("aria-expanded", isOpen);
}

function closeAvatarDropdown() {
  const dropdown = document.getElementById("avatar-dropdown");
  dropdown.classList.remove("open");
  document.getElementById("avatar-btn").setAttribute("aria-expanded", "false");
}

// Close dropdown when clicking anywhere outside
function handleDocumentClick(e) {
  const avatarWrapper = document.querySelector(".avatar-wrapper");
  if (avatarWrapper && !avatarWrapper.contains(e.target)) {
    closeAvatarDropdown();
  }
}


/* ═══════════════════════════════════════════════════════════════
   7. CATEGORY CHIPS & FILTERING
   ─────────────────────────────────────────────────────────────── */

/**
 * renderCategoryChips — builds the chip bar from the CATEGORIES array
 */
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

  // Delegate click events on the container (more efficient than per-chip listeners)
  bar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const category = chip.dataset.category;
    state.currentCategory = category;
    // Update active chip visuals
    bar.querySelectorAll(".chip").forEach(c => {
      c.classList.toggle("active", c.dataset.category === category);
      c.setAttribute("aria-pressed", c.dataset.category === category);
    });
    renderImageGrid();
  });
}

/**
 * getFilteredImages — applies category and search filters to state.images
 * @returns {Array} filtered image objects
 */
function getFilteredImages() {
  let filtered = state.images;

  // Category filter
  if (state.currentCategory !== "All") {
    filtered = filtered.filter(img => img.category === state.currentCategory);
  }

  // Search filter (case-insensitive match on title, description, uploader)
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(img =>
      img.title.toLowerCase().includes(q) ||
      img.description.toLowerCase().includes(q) ||
      img.uploader.toLowerCase().includes(q) ||
      img.category.toLowerCase().includes(q)
    );
  }

  return filtered;
}


/* ═══════════════════════════════════════════════════════════════
   8. SEARCH FILTERING
   ─────────────────────────────────────────────────────────────── */

function initSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  // Use 'input' event so filtering is live as the user types
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderImageGrid();
  });

  // Allow pressing Enter to trigger search (purely cosmetic here since we filter live)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}


/* ═══════════════════════════════════════════════════════════════
   9. IMAGE GRID RENDERER
   Rebuilds the grid DOM from state.images each time filters change.
   ─────────────────────────────────────────────────────────────── */

/**
 * Formats a large number into a short form (e.g. 1200 → "1.2K")
 */
function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

/**
 * renderImageGrid — main rendering function for the card grid.
 * Reads state.images and current filters, then writes to the DOM.
 */
function renderImageGrid() {
  const grid = document.getElementById("image-grid");
  if (!grid) return;

  const filtered = getFilteredImages();

  if (filtered.length === 0) {
    // Show an empty state illustration
    grid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <h3>No images found</h3>
        <p>Try adjusting your search or selecting a different category.</p>
      </div>
    `;
    return;
  }

  // Build HTML for every card
  // Note: we use innerHTML for performance (batched DOM write)
  grid.innerHTML = filtered.map((img, index) => `
    <article
      class="image-card"
      data-id="${img.id}"
      tabindex="0"
      role="button"
      aria-label="View image: ${img.title}"
      style="animation-delay: ${index * 50}ms"
    >
      <!-- Thumbnail with hover overlay -->
      <div class="card-thumbnail">
        <img
          src="${img.thumbnailUrl}"
          alt="${img.title}"
          loading="lazy"
        />
        <div class="card-overlay" aria-hidden="true">
          <span class="overlay-category">${img.category}</span>
        </div>
      </div>

      <!-- Card body: avatar + info -->
      <div class="card-body">
        <div class="card-avatar">
          <img src="${img.uploaderAvatar}" alt="${img.uploader}" loading="lazy" />
        </div>
        <div class="card-info">
          <p class="card-title">${img.title}</p>
          <div class="card-meta">
            <span class="card-uploader">${img.uploader}</span>
            <div class="card-stats">
              <span>${img.views} views</span>
              <span class="dot">•</span>
              <span>${img.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Attach click (and keyboard) event listeners to each card
  grid.querySelectorAll(".image-card").forEach(card => {
    const openDetail = () => openDetailModal(Number(card.dataset.id));
    card.addEventListener("click", openDetail);
    // Keyboard accessibility: open on Enter or Space
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(); }
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   10. IMAGE DETAIL MODAL
   ─────────────────────────────────────────────────────────────── */

function openDetailModal(imageId) {
  const img = state.images.find(i => i.id === imageId);
  if (!img) return;

  state.activeModal   = "detail";
  state.activeImageId = imageId;

  const liked = state.likedImages.has(imageId);

  // Populate all modal fields
  document.getElementById("modal-image").src = img.url;
  document.getElementById("modal-image").alt = img.title;
  document.getElementById("modal-category-tag").textContent = img.category;
  document.getElementById("modal-title").textContent = img.title;
  document.getElementById("modal-description").textContent = img.description;
  document.getElementById("modal-uploader-avatar").src = img.uploaderAvatar;
  document.getElementById("modal-uploader-name").textContent = img.uploader;
  document.getElementById("modal-views").textContent = `${img.views} views`;
  document.getElementById("modal-time").textContent = img.uploadTime;

  // Like button
  const likeBtn = document.getElementById("like-btn");
  likeBtn.classList.toggle("liked", liked);
  document.getElementById("like-count").textContent = formatNumber(img.likes);

  // Render existing comments
  renderComments(img.comments);

  // Show the backdrop
  document.getElementById("detail-modal").classList.add("open");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeDetailModal() {
  document.getElementById("detail-modal").classList.remove("open");
  document.body.style.overflow = "";
  state.activeModal   = null;
  state.activeImageId = null;
}


/* ═══════════════════════════════════════════════════════════════
   11. LIKE / SHARE / DOWNLOAD INTERACTIONS
   ─────────────────────────────────────────────────────────────── */

function handleLike() {
  const imageId = state.activeImageId;
  if (!imageId) return;

  const img = state.images.find(i => i.id === imageId);
  if (!img) return;

  const likeBtn = document.getElementById("like-btn");

  if (state.likedImages.has(imageId)) {
    // Unlike
    state.likedImages.delete(imageId);
    img.likes -= 1;
    likeBtn.classList.remove("liked");
    showToast("Removed from liked images", "info", 2000);
  } else {
    // Like
    state.likedImages.add(imageId);
    img.likes += 1;
    likeBtn.classList.add("liked");
    // Trigger the pop animation
    likeBtn.querySelector("svg").classList.add("like-pop");
    setTimeout(() => likeBtn.querySelector("svg").classList.remove("like-pop"), 300);
    showToast("Added to liked images ❤️", "success", 2000);
  }

  // Update displayed count
  document.getElementById("like-count").textContent = formatNumber(img.likes);
}

function handleShare() {
  // Build a mock shareable URL
  const imageId = state.activeImageId;
  const mockUrl = `${window.location.origin}/image/${imageId}`;

  // Use the Clipboard API if available; fall back to prompt
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(mockUrl).then(() => {
      showToast("Link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Couldn't copy link automatically", "warning");
    });
  } else {
    // Fallback: prompt the user to copy manually
    window.prompt("Copy this link:", mockUrl);
    showToast("Link ready to share!", "info");
  }
}

function handleDownload() {
  const img = state.images.find(i => i.id === state.activeImageId);
  if (!img) return;

  // Create a temporary <a> element and programmatically "click" it to trigger download
  // Note: download attribute only works for same-origin URLs in most browsers;
  // for cross-origin (Unsplash) it will open in a new tab instead.
  const link = document.createElement("a");
  link.href    = img.url;
  link.download = `${img.title.replace(/\s+/g, "_")}.jpg`;
  link.target  = "_blank";  // open in new tab for cross-origin
  link.rel     = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Image download started!", "success");
}


/* ═══════════════════════════════════════════════════════════════
   12. COMMENT SYSTEM
   ─────────────────────────────────────────────────────────────── */

/**
 * renderComments — populates the comments list in the modal
 * @param {Array} comments - array of {user, text, time} objects
 */
function renderComments(comments) {
  const list = document.getElementById("comments-list");
  if (!list) return;

  if (comments.length === 0) {
    list.innerHTML = `<p class="text-sm text-muted" style="padding: 0.5rem 0">No comments yet. Be the first!</p>`;
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

/**
 * escapeHtml — prevents XSS by converting dangerous characters to entities.
 * Always sanitise user-supplied text before injecting into innerHTML!
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * handleAddComment — adds a new comment to the active image and re-renders the list
 */
function handleAddComment() {
  const input   = document.getElementById("comment-input");
  const text    = input.value.trim();
  const imageId = state.activeImageId;

  if (!text) {
    showToast("Please type a comment first", "warning", 2000);
    return;
  }

  const img = state.images.find(i => i.id === imageId);
  if (!img) return;

  // Get the logged-in user's name
  let username = "You";
  try {
    const user = JSON.parse(sessionStorage.getItem("pictube_user") || "{}");
    username = user.username || "You";
  } catch (_) {}

  // Add the new comment to the front of the array (newest first)
  const newComment = {
    user: username,
    text: text,
    time: "Just now"
  };
  img.comments.unshift(newComment);

  // Clear the input and re-render
  input.value = "";
  renderComments(img.comments);

  // Scroll the comments list to the top to show the new comment
  const list = document.getElementById("comments-list");
  if (list) list.scrollTop = 0;

  showToast("Comment posted!", "success", 2000);
}


/* ═══════════════════════════════════════════════════════════════
   13. UPLOAD MODAL
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
  // Reset the form
  document.getElementById("upload-form").reset();
  resetDropZone();
}

function resetDropZone() {
  const preview = document.getElementById("drop-preview");
  const dropContent = document.getElementById("drop-content");
  if (preview) { preview.style.display = "none"; preview.src = ""; }
  if (dropContent) dropContent.style.display = "block";
}

/**
 * initUploadModal — wires up drag-and-drop, file browser, and form submission
 */
function initUploadModal() {
  const dropZone   = document.getElementById("drop-zone");
  const fileInput  = document.getElementById("file-input");
  const preview    = document.getElementById("drop-preview");
  const dropContent= document.getElementById("drop-content");

  if (!dropZone) return;

  // Click on zone → open file browser
  dropZone.addEventListener("click", (e) => {
    if (e.target.closest("#drop-preview")) return; // don't re-open if clicking preview
    fileInput.click();
  });

  // Keyboard accessibility for the drop zone
  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });

  // File selected via browser
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) handleFileSelected(file, preview, dropContent);
  });

  // Drag over zone
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // required to allow drop
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove("drag-over");
    }
  });

  // File dropped
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelected(file, preview, dropContent);
    } else {
      showToast("Please drop an image file", "error");
    }
  });

  // Form submission
  document.getElementById("upload-form").addEventListener("submit", handleUploadSubmit);
}

/**
 * handleFileSelected — shows a preview of the selected file in the drop zone
 */
function handleFileSelected(file, preview, dropContent) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";
    if (dropContent) dropContent.style.display = "none";
  };
  reader.readAsDataURL(file); // encode file as base64 data URL for preview
}

/**
 * handleUploadSubmit — creates a new image card from the form data
 */
function handleUploadSubmit(e) {
  e.preventDefault();

  const title    = document.getElementById("upload-title").value.trim();
  const category = document.getElementById("upload-category").value;
  const desc     = document.getElementById("upload-desc").value.trim();
  const preview  = document.getElementById("drop-preview");

  // Validation
  if (!title) { showToast("Please enter a title", "warning"); return; }
  if (!category) { showToast("Please select a category", "warning"); return; }

  // Get current user
  let username    = "You";
  let avatarUrl   = `https://api.dicebear.com/7.x/avataaars/svg?seed=you`;
  try {
    const user = JSON.parse(sessionStorage.getItem("pictube_user") || "{}");
    username  = user.username || "You";
    avatarUrl = user.avatar  || avatarUrl;
  } catch (_) {}

  // Use the local preview if available, else a placeholder from Unsplash
  const localImageSrc = preview.src && preview.src !== window.location.href
    ? preview.src
    : `https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80`;

  // Build new image object
  const newImage = {
    id:            Date.now(), // unique id based on timestamp
    title,
    description:   desc || "No description provided.",
    category,
    url:           localImageSrc,
    thumbnailUrl:  localImageSrc,
    uploader:      username,
    uploaderAvatar:avatarUrl,
    views:         "0",
    uploadTime:    "Just now",
    likes:         0,
    comments:      []
  };

  // Prepend to the images array (shows at top of grid)
  state.images.unshift(newImage);

  closeUploadModal();
  renderImageGrid();
  showToast(`"${title}" uploaded successfully! 🎉`, "success");
}


/* ═══════════════════════════════════════════════════════════════
   14. HEADER USER HYDRATION
   Fills in the user's name and avatar from sessionStorage.
   ─────────────────────────────────────────────────────────────── */

function hydrateUserUI() {
  let user = { username: "Guest", email: "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest" };
  try {
    const stored = sessionStorage.getItem("pictube_user");
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  // Avatar button image
  const avatarImg = document.getElementById("header-avatar-img");
  if (avatarImg) avatarImg.src = user.avatar;

  // Dropdown user info
  const nameEl  = document.getElementById("dropdown-username");
  const emailEl = document.getElementById("dropdown-email");
  if (nameEl)  nameEl.textContent  = user.username || "User";
  if (emailEl) emailEl.textContent = user.email    || "";
}


/* ═══════════════════════════════════════════════════════════════
   15. APPLICATION BOOT
   Runs once after the DOM is fully parsed and ready.
   ─────────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  // ── A. Populate user info in header ──
  hydrateUserUI();

  // ── B. Apply saved theme ──
  initTheme();

  // ── C. Theme toggle ──
  const themeTrack = document.getElementById("theme-track");
  if (themeTrack) themeTrack.addEventListener("click", toggleTheme);

  // ── D. Hamburger sidebar toggle (mobile only) ──
  const hamburgerBtn = document.getElementById("hamburger-btn");
  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);

  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  // ── E. Avatar dropdown ──
  const avatarBtn = document.getElementById("avatar-btn");
  if (avatarBtn) avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent document click from immediately closing it
    toggleAvatarDropdown();
  });
  document.addEventListener("click", handleDocumentClick);

  // ── F. Logout ──
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    if (typeof logout === "function") logout();
  });

  // ── G. Category chips ──
  renderCategoryChips();

  // ── H. Search ──
  initSearch();

  // ── I. Image grid ──
  renderImageGrid();

  // ── J. Sidebar item active state (just visual for this demo) ──
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", function () {
      document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
      this.classList.add("active");
      // On mobile, close the sidebar after selection
      if (window.innerWidth <= 640) closeSidebar();
    });
  });

  // ── K. Upload button ──
  const uploadBtn = document.getElementById("upload-btn");
  if (uploadBtn) uploadBtn.addEventListener("click", openUploadModal);

  // ── L. Upload modal close ──
  const uploadModalBackdrop = document.getElementById("upload-modal");
  if (uploadModalBackdrop) {
    // Click on the dark backdrop (but NOT the modal itself) closes it
    uploadModalBackdrop.addEventListener("click", (e) => {
      if (e.target === uploadModalBackdrop) closeUploadModal();
    });
  }

  const closeUploadBtn = document.getElementById("close-upload-modal");
  if (closeUploadBtn) closeUploadBtn.addEventListener("click", closeUploadModal);

  initUploadModal();

  // ── M. Detail modal close ──
  const detailModalBackdrop = document.getElementById("detail-modal");
  if (detailModalBackdrop) {
    detailModalBackdrop.addEventListener("click", (e) => {
      if (e.target === detailModalBackdrop) closeDetailModal();
    });
  }

  const closeDetailBtn = document.getElementById("close-detail-modal");
  if (closeDetailBtn) closeDetailBtn.addEventListener("click", closeDetailModal);

  // ── N. Like / Share / Download buttons ──
  const likeBtn     = document.getElementById("like-btn");
  const shareBtn    = document.getElementById("share-btn");
  const downloadBtn = document.getElementById("download-btn");
  if (likeBtn)     likeBtn.addEventListener("click", handleLike);
  if (shareBtn)    shareBtn.addEventListener("click", handleShare);
  if (downloadBtn) downloadBtn.addEventListener("click", handleDownload);

  // ── O. Add comment button ──
  const commentBtn = document.getElementById("comment-submit");
  if (commentBtn) commentBtn.addEventListener("click", handleAddComment);

  // Also allow pressing Enter in comment input (Shift+Enter for new line)
  const commentInput = document.getElementById("comment-input");
  if (commentInput) {
    commentInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    });
  }

  // ── P. Keyboard: close modals with Escape ──
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.activeModal === "detail") closeDetailModal();
      if (state.activeModal === "upload") closeUploadModal();
      closeAvatarDropdown();
      if (window.innerWidth <= 640) closeSidebar();
    }
  });

  // ── Q. Welcome toast ──
  setTimeout(() => {
    let name = "there";
    try {
      const user = JSON.parse(sessionStorage.getItem("pictube_user") || "{}");
      name = user.username || "there";
    } catch (_) {}
    showToast(`Welcome back, ${name}! 👋`, "success", 3000);
  }, 600);

});
