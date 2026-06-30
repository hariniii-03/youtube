/**
 * auth.js — PicTube Authentication Logic
 * ----------------------------------------
 * Handles all login-related behavior:
 *   - Front-end form validation (email format, password length)
 *   - Simulated login (any valid-looking credentials succeed)
 *   - Session storage to track login state
 *   - Redirect after successful login
 *   - Guard: blocks access to homepage if not logged in
 */

// ─────────────────────────────────────────────
// 1. SESSION GUARD — call this on every protected page
//    If the user isn't logged in, redirect them to login.html
// ─────────────────────────────────────────────
function requireAuth() {
  const user = sessionStorage.getItem("pictube_user");
  if (!user) {
    // Not logged in — send to login page
    window.location.href = "login.html";
  }
}

// ─────────────────────────────────────────────
// 2. GET CURRENT USER — returns the stored user object or null
// ─────────────────────────────────────────────
function getCurrentUser() {
  const raw = sessionStorage.getItem("pictube_user");
  return raw ? JSON.parse(raw) : null;
}

// ─────────────────────────────────────────────
// 3. LOGOUT — clears the session and redirects to login
// ─────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem("pictube_user");
  window.location.href = "login.html";
}

// ─────────────────────────────────────────────
// 4. EMAIL VALIDATOR — simple regex check
// ─────────────────────────────────────────────
function isValidEmail(email) {
  // Standard email pattern: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ─────────────────────────────────────────────
// 5. SHOW FIELD ERROR — injects an error message below an input
// ─────────────────────────────────────────────
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  // Find or create the error span next to this field
  let errorEl = field.parentElement.querySelector(".field-error");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.className = "field-error";
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
  field.classList.add("input-error"); // red border
}

// ─────────────────────────────────────────────
// 6. CLEAR FIELD ERROR — removes error state from an input
// ─────────────────────────────────────────────
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = field.parentElement.querySelector(".field-error");
  if (errorEl) errorEl.textContent = "";
  field.classList.remove("input-error");
}

// ─────────────────────────────────────────────
// 7. TOAST — lightweight notification for login page
//    (The full toast system lives in app.js; this is a minimal version)
// ─────────────────────────────────────────────
function showAuthToast(message, type = "success") {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `auth-toast auth-toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("auth-toast--visible"));

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("auth-toast--visible");
    setTimeout(() => toast.remove(), 400); // wait for fade-out transition
  }, 3000);
}

// ─────────────────────────────────────────────
// 8. HANDLE LOGIN FORM SUBMISSION
// ─────────────────────────────────────────────
function handleLoginSubmit(e) {
  e.preventDefault(); // stop the form from reloading the page

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let valid = true;

  // --- Validate Email ---
  clearFieldError("email");
  if (!email) {
    showFieldError("email", "Email or username is required.");
    valid = false;
  } else if (email.includes("@") && !isValidEmail(email)) {
    // Only check email format if the user typed an "@" (otherwise treat as username)
    showFieldError("email", "Please enter a valid email address.");
    valid = false;
  }

  // --- Validate Password ---
  clearFieldError("password");
  if (!password) {
    showFieldError("password", "Password is required.");
    valid = false;
  } else if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters.");
    valid = false;
  }

  if (!valid) return; // stop here if validation failed

  // --- Simulate Login Success ---
  // In a real app you'd send a fetch() request to a backend here.
  // For this demo, any valid-looking credentials are accepted.

  // Disable button and show loading state
  const submitBtn = document.getElementById("login-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";

  // Simulate network delay (800ms)
  setTimeout(() => {
    // Build a mock user object
    const mockUser = {
      username: email.split("@")[0] || email, // use part before @ as display name
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      loggedInAt: new Date().toISOString(),
    };

    // Save to sessionStorage (cleared when the browser tab is closed)
    sessionStorage.setItem("pictube_user", JSON.stringify(mockUser));

    // Show success toast, then redirect
    showAuthToast("Login successful! Redirecting…", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  }, 800);
}

// ─────────────────────────────────────────────
// 9. TOGGLE PASSWORD VISIBILITY
// ─────────────────────────────────────────────
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    // Eye-slash SVG
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
  } else {
    passwordInput.type = "password";
    // Eye SVG
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
  }
}

// ─────────────────────────────────────────────
// 10. BOOT — runs when the login page's DOM is ready
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // If the user is already logged in, skip the login page
  if (sessionStorage.getItem("pictube_user")) {
    window.location.href = "index.html";
    return;
  }

  // Wire up the form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Wire up the show/hide password button
  const toggleBtn = document.getElementById("toggle-password");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", togglePasswordVisibility);
  }

  // Clear error on input change so the user gets live feedback
  ["email", "password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearFieldError(id));
  });
});
