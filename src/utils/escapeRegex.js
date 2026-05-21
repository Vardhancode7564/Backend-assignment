/**
 * Escapes special regex characters in a string to prevent
 * ReDoS (Regular Expression Denial of Service) attacks.
 *
 * @param {string} str - The raw user input string
 * @returns {string} - Escaped string safe for use in RegExp
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = escapeRegex;
