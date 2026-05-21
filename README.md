# Contact Management REST API

A highly scalable, clean-architecture RESTful API built with Node.js, Express, and MongoDB. This API is designed to manage contacts with advanced querying capabilities, robust error handling, and solid database modeling.

## 🚀 Features Completed

### Core Requirements
- **RESTful Endpoints:** Complete CRUD operations for contacts.
- **Database Modeling:** Mongoose models with strict data types, enums, and regex validation.
- **Advanced Querying:** Supports Pagination, Sorting, Filtering, and Searching.
- **Centralized Error Handling:** Global exception catcher guaranteeing consistent `{ success: false, message, errors }` JSON formats.

### Nice-to-Have Features Implemented
- **Swagger / OpenAPI:** Interactive UI documentation available at `/api-docs`.
- **API Key Authentication:** All routes protected by `x-api-key`.
- **Soft Delete Integration:** Records are never hard-deleted; tracked via an `is_deleted` boolean.
- **Rate Limiting:** Protects the API from DDoS attacks (100 requests / 15 mins).
- **Request Logging:** Utilizes `Morgan` for detailed development logging.
- **Docker Setup:** Production-ready `Dockerfile` and `docker-compose.yml` for instant deployment.
- **Integration Tests:** Jest and Supertest suite utilizing an in-memory MongoDB structure.
- **Database Seeding:** Included `seed.js` script to instantly inject test profiles.

---

## 🛠️ Steps to Run the Project

### 1. Run with Docker (Recommended)
You can launch the entire stack (Node.js API + MongoDB Database) instantly:
```bash
docker-compose up -d --build
```
The API will be mapped directly to your local port 5000.

### 2. Manual Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-link>
cd backend-assignment
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contact-management
API_KEY=my-super-secret-api-key-123
```

### 4. Seed the Database (Optional but recommended)
Quickly populate the database with diverse test data:
```bash
node src/seed.js
```

### 5. Start the Server
```bash
# Development mode with Nodemon
npm run dev

# Production mode
npm start
```
The API will be available at `http://localhost:5000/api/v1/contacts`

---

## 🧪 Testing

To run the full Jest Integration testing suite on a virtual MongoDB server:
```bash
npm run test
```

---

## 📖 Swagger Documentation

A fully interactive UI to test the API endpoints is available!
Once the server is running, open your browser to:
`http://localhost:5000/api-docs`

*(Important: Since API Key Auth is enabled, click the "Authorize" button in Swagger and type `my-super-secret-api-key-123` to unlock the routes)*

---

## 🧠 Technical Decisions Made

1. **MVC Architecture:** Separated concerns into `models`, `controllers`, `routes`, and `middlewares`. This keeps the API modular, highly maintainable, and easily testable.
2. **Native Mongoose Validation:** Opted to use Mongoose's built-in schema validation (Enums, Match regex) rather than external libraries (like Joi). This reduces package bloat while strictly enforcing data rules at the database level.
3. **Soft Delete Protocol:** Instead of calling `.remove()`, a `findOneAnUpdate` flips an `is_deleted` flag. This preserves analytics and data integrity without breaking GET queries.
4. **Global Error Middleware:** Instead of repetitive `try/catch` response formatting, all thrown errors are forwarded using `next(error)` to a central handler. This ensures structural parity in output to front-end clients.

---

## ⚠️ Known Limitations
- **Database Migrations:** Mongoose relies on schemas, so explicit Up/Down migration scripts were excluded to maintain project simplicity.

---

