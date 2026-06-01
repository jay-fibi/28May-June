// script.js - Basic JavaScript file
console.log("Hello from script.js!");

// A simple greeting function
function greet(name) {
    return `Hello, ${name}! Welcome to the project.`;
}

// Function to update the greeting on the page
function displayGreeting() {
    const nameInput = document.getElementById("nameInput");
    const greetingDisplay = document.getElementById("greeting");
    const name = nameInput.value.trim() || "Guest";
    greetingDisplay.textContent = greet(name);
}

// Add event listener when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");
    const greetBtn = document.getElementById("greetBtn");
    if (greetBtn) {
        greetBtn.addEventListener("click", displayGreeting);
    }
});
