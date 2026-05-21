const errorHandler = (err, req, res, next) => {
  //console.error(err);

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  };

  // Extract detailed Mongoose validation errors
  if (err.name === "ValidationError") {
    response.message = "Validation Error";
    response.errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json(response);
  }

  // Invalid ID string
  if (err.name === "CastError") {
    response.message = "Invalid ID format";
    return res.status(400).json(response);
  }

  // Fallback status
  const status = err.statusCode || 500;
  res.status(status).json(response);
};

module.exports = errorHandler;
