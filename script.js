// script.js - Basic JavaScript file
// Created as part of the file creation exercise

// Greet the user on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello! The page has loaded successfully.');
    greetUser('Jay');
    setupButton();
});

/**
 * Display a greeting message on the page.
 * @param {string} name - The name of the user to greet.
 */
function greetUser(name) {
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        greetingEl.textContent = `Hello, ${name}! Welcome to the demo page.`;
    }
}

/**
 * Wire up the click handler for the demo button.
 */
function setupButton() {
    const btn = document.getElementById('clickBtn');
    let count = 0;
    if (btn) {
        btn.addEventListener('click', () => {
            count += 1;
            btn.textContent = `Clicked ${count} time${count === 1 ? '' : 's'}`;
        });
    }
}
