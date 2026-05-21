const requireApiKey = (req, res, next) => {
  // Extract API key from headers
  const apiKey = req.header("x-api-key");

  // Define the expected key (In production, this should come from process.env)
  const validKey = process.env.API_KEY || "my-super-secret-api-key-123";

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing API Key",
      errors: [],
    });
  }

  next();
};

module.exports = requireApiKey;
