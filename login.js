// login.js - Client-side handling for the login page
console.log("Hello from login.js!");

// Validate the form fields. Returns an array of error messages.
function validateLogin(username, password) {
    const errors = [];

    if (!username) {
        errors.push("Username or email is required.");
    }

    if (!password) {
        errors.push("Password is required.");
    } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
    }

    return errors;
}

// Show a message to the user (type can be "error" or "success").
function showMessage(text, type) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = "message " + type;
}

// Handle the login form submission.
function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Reset previous invalid states
    usernameInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");

    const errors = validateLogin(username, password);

    if (errors.length > 0) {
        if (!username) usernameInput.classList.add("invalid");
        if (!password || password.length < 6) passwordInput.classList.add("invalid");
        showMessage(errors[0], "error");
        return;
    }

    // NOTE: This is a front-end demo only. Replace this block with a real
    // request to your backend authentication endpoint.
    showMessage(`Welcome, ${username}! Login successful (demo).`, "success");
}

// Wire up the form once the DOM is ready.
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});
