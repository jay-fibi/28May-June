// helpers.js - Utility functions in a nested directory

/**
 * Format a date to a human-readable string.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

/**
 * Generate a random integer between min and max (inclusive).
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random integer.
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} Capitalized string.
 */
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export functions for use in other modules (if using modules)
// module.exports = { formatDate, randomInt, capitalize };

console.log("helpers.js loaded from src/utils/");
