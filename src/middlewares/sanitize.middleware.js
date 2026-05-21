const xss = require("xss");

/**
 * Strip keys that start with '$' or contain '.' to prevent NoSQL injection.
 * MongoDB operators like $gt, $ne, $regex etc. are blocked.
 */
const stripDangerousKeys = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripDangerousKeys);

  const cleaned = {};
  for (const key of Object.keys(obj)) {
    // Block keys starting with $ or containing dots (MongoDB operators)
    if (key.startsWith("$") || key.includes(".")) continue;
    cleaned[key] = stripDangerousKeys(obj[key]);
  }
  return cleaned;
};

/**
 * Recursively sanitize all string values in an object to prevent XSS attacks.
 * Strips dangerous HTML/script tags from user input.
 */
const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return xss(value.trim());
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
};

/**
 * Sanitize values of an object in-place.
 * Works with read-only objects like req.query in Express 5.
 */
const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key]; // Remove dangerous keys
    } else {
      obj[key] = sanitizeValue(obj[key]);
    }
  }
};

/**
 * Express middleware that provides multi-layer input sanitization:
 * 1. NoSQL Injection Protection — strips MongoDB operators ($, .) from keys
 * 2. XSS Protection — strips malicious HTML/script content from values
 * 
 * Compatible with Express 4 & 5 (req.query is read-only in Express 5).
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = stripDangerousKeys(req.body);
    req.body = sanitizeValue(req.body);
  }
  sanitizeInPlace(req.query);
  sanitizeInPlace(req.params);
  next();
};

module.exports = sanitizeInput;
