// src/utils/helpers.js - File in a nested directory structure

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a number as currency (USD).
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Export for use in other modules (Node.js / CommonJS)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { capitalize, formatCurrency };
}
