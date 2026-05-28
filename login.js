// login.js - Client-side behavior for the simple login screen

document.addEventListener('DOMContentLoaded', function () {
    console.log('Login page loaded successfully.');
    setupLoginForm();
});

/**
 * Wire up the login form submit handler.
 */
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('rememberMe');

    if (!form || !emailInput || !passwordInput || !rememberMeInput) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeInput.checked;

        const validationError = validateLoginForm(email, password);

        if (validationError) {
            showLoginMessage(validationError, 'error');
            return;
        }

        // Demo only: no real authentication is performed because there is no backend.
        console.log('Demo login submitted:', { email, rememberMe });
        showLoginMessage('Login successful! This is a front-end demo.', 'success');
        form.reset();
    });
}

/**
 * Validate the login form values.
 * @param {string} email - User email address.
 * @param {string} password - User password.
 * @returns {string} An error message, or an empty string when valid.
 */
function validateLoginForm(email, password) {
    if (!email) {
        return 'Please enter your email address.';
    }

    if (!isValidEmail(email)) {
        return 'Please enter a valid email address.';
    }

    if (!password) {
        return 'Please enter your password.';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
    }

    return '';
}

/**
 * Check if an email value has a basic valid format.
 * @param {string} email - Email value to check.
 * @returns {boolean} Whether the email format is valid.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show a login status message on the page.
 * @param {string} message - Message to display.
 * @param {'error' | 'success'} type - Message type.
 */
function showLoginMessage(message, type) {
    const messageEl = document.getElementById('loginMessage');

    if (!messageEl) {
        return;
    }

    messageEl.textContent = message;
    messageEl.className = `login-message ${type}`;
}