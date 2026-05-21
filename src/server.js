require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact.route");
const errorHandler = require("./middlewares/errorHandler");
const requireApiKey = require("./middlewares/auth.middleware");
const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request Logging
app.use(morgan("dev"));

// Swagger Documentation Route (Public)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate Limiting (Limit to 100 requests per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// Protect API with API Key (except docs)
app.use("/api/v1/", requireApiKey);
app.use("/api/v1/contacts", contactRoutes);

// Throw 404 for unknown routes
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// Universal Error Handling Middleware
app.use(errorHandler);

// Only listen if not running via Supertest
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  });
}

module.exports = app;
