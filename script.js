const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMessage = document.getElementById("successMessage");

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

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  successMessage.textContent = "";

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

  if (isValid) {
    // Simulate a successful login
    successMessage.textContent = "Login successful! Welcome back.";
    loginForm.reset();
  }
});

// Clear errors as the user types
emailInput.addEventListener("input", () => clearError(emailInput, emailError));
passwordInput.addEventListener("input", () => clearError(passwordInput, passwordError));
