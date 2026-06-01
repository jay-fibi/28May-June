// ===== Element references =====
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");
const rememberCheckbox = document.getElementById("remember");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const toast = document.getElementById("toast");

// Strength meter
const strengthMeter = document.getElementById("strengthMeter");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");

const STORAGE_KEYS = {
  theme: "login-theme",
  email: "login-remembered-email",
};

// ===== Validation helpers =====
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function setError(input, errorEl, message) {
  input.classList.add("invalid");
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove("invalid");
  errorEl.textContent = "";
}

// ===== Toast =====
let toastTimer;
function showToast(message, type = "success") {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = "toast show" + (type === "error" ? " error" : "");
  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 3500);
}

// ===== Password visibility toggle =====
togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.querySelector("span").textContent = isHidden ? "🙈" : "👁️";
  const label = isHidden ? "Hide password" : "Show password";
  togglePassword.setAttribute("aria-label", label);
  togglePassword.setAttribute("title", label);
});

// ===== Password strength meter =====
function evaluateStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–5
}

function updateStrength() {
  const value = passwordInput.value;
  if (value.length === 0) {
    strengthMeter.classList.remove("visible");
    strengthFill.style.width = "0";
    strengthLabel.textContent = "";
    return;
  }

  strengthMeter.classList.add("visible");
  const score = evaluateStrength(value);

  const levels = [
    { width: "20%", color: "#e53e3e", label: "Weak" },
    { width: "40%", color: "#dd6b20", label: "Fair" },
    { width: "60%", color: "#d69e2e", label: "Okay" },
    { width: "80%", color: "#38a169", label: "Good" },
    { width: "100%", color: "#2f855a", label: "Strong" },
  ];

  const level = levels[Math.min(score, levels.length) - 1] || levels[0];
  strengthFill.style.width = level.width;
  strengthFill.style.background = level.color;
  strengthLabel.textContent = level.label;
  strengthLabel.style.color = level.color;
}

// ===== Theme handling =====
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
});

// ===== Form submission =====
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let isValid = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate email
  if (email === "") {
    setError(emailInput, emailError, "Email is required.");
    isValid = false;
  } else if (!validateEmail(email)) {
    setError(emailInput, emailError, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Validate password
  if (password === "") {
    setError(passwordInput, passwordError, "Password is required.");
    isValid = false;
  } else if (password.length < 6) {
    setError(passwordInput, passwordError, "Password must be at least 6 characters.");
    isValid = false;
  } else {
    clearError(passwordInput, passwordError);
  }

  if (!isValid) {
    showToast("Please fix the errors and try again.", "error");
    return;
  }

  // Persist (or clear) remembered email
  if (rememberCheckbox.checked) {
    localStorage.setItem(STORAGE_KEYS.email, email);
  } else {
    localStorage.removeItem(STORAGE_KEYS.email);
  }

  // Simulate an async sign-in request with a loading state
  loginButton.classList.add("loading");
  loginButton.disabled = true;
  loginButton.querySelector(".button-text").textContent = "Signing in...";

  setTimeout(() => {
    loginButton.classList.remove("loading");
    loginButton.disabled = false;
    loginButton.querySelector(".button-text").textContent = "Sign In";

    showToast("Login successful! Welcome back. 🎉", "success");

    // Reset only the password; keep email if "remember me" is on
    passwordInput.value = "";
    updateStrength();
    if (!rememberCheckbox.checked) {
      emailInput.value = "";
    }
  }, 1400);
});

// ===== Live feedback =====
emailInput.addEventListener("input", () => clearError(emailInput, emailError));
passwordInput.addEventListener("input", () => {
  clearError(passwordInput, passwordError);
  updateStrength();
});

// ===== Initialise from saved preferences =====
(function init() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  const savedEmail = localStorage.getItem(STORAGE_KEYS.email);
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
})();
