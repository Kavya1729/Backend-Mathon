# 📘 Chapter Performance Dashboard - Backend API

A RESTful API-based backend for a **Chapter Performance Dashboard**, designed to simulate real-world backend engineering use-cases, including API design, data filtering, Redis caching, rate limiting, and performance optimization.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Redis** (for Caching & Rate Limiting)
- **Multer** (for JSON file upload)
- **Render/Railway** (Deployment Platform)

---

## 📂 Features Implemented

### ✅ RESTful API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/chapters` | Get all chapters with filters, pagination, and Redis caching |
| `GET`  | `/api/v1/chapters/:id` | Get a specific chapter by ID |
| `POST` | `/api/v1/chapters` | Upload chapters via JSON file (admin-only access) |

---

### 📁 Chapter Upload

- Uploading chapters is **admin-restricted**.
- Accepts a `.json` file via multipart form-data.
- Validates each chapter against Mongoose schema.
- On error:
  - Inserts valid chapters.
  - Returns list of invalid chapters with reasons.
- Cache invalidation on chapter addition.

---

### 🔍 Filtering & Pagination (`GET /api/v1/chapters`)

Supports filters via query params:
- `class`
- `unit`
- `status`
- `weakChapters`
- `subject`

Pagination parameters:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)

Returns:
- `data`: Filtered chapters
- `totalChapters`: Total chapters available for the query

---

### 🧠 Redis Caching

- `GET /api/v1/chapters` responses are cached in Redis for **1 hour**.
- Cache is **invalidated** when a new chapter is added via `POST /api/v1/chapters`.

---

### 🛡️ Rate Limiting

- Allows **30 requests/minute per IP**.
- Rate-limiting logic is backed by **Redis**.

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
REDIS_URL=redis://localhost:6379
ADMIN_TOKEN=your_admin_token
