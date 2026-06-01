// script.js - Basic JavaScript content

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded successfully!");

  const button = document.getElementById("greetBtn");
  const resetButton = document.getElementById("resetBtn");
  const output = document.getElementById("output");
  const counter = document.getElementById("counter");

  let clickCount = 0;

  if (button && output) {
    button.addEventListener("click", function () {
      const now = new Date();
      output.textContent =
        "Hello! The current time is " + now.toLocaleTimeString();

      clickCount++;
      if (counter) {
        counter.textContent = "Greeted " + clickCount + " time(s)";
      }
    });
  }

  // Reset feature: clears output and resets the counter
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      clickCount = 0;
      if (output) output.textContent = "";
      if (counter) counter.textContent = "Counter reset!";
    });
  }
});

// A simple reusable function
function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
