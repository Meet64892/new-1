# 📚 Book Management System

A full-stack Book Management System with a **React** (Vite) frontend and a **Java Spring Boot** REST backend. It lets you add, edit, delete, search and track the availability of books in a library collection.

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, Vite, plain CSS (responsive, modern UI)       |
| Backend  | Java 21, Spring Boot 4, Spring Web (MVC), Spring Data JPA, Bean Validation |
| Database | H2 (in-memory, zero-config) — easily swappable          |
| Build    | Maven (wrapper included), npm                           |

## Features

- Create, read, update and delete books (full CRUD)
- Search books by title, author, genre or ISBN
- Track availability status (Available / Borrowed)
- Server-side validation with friendly inline error messages
- Live stats (total / available / borrowed)
- Responsive UI that works on mobile and desktop
- Seed data on first run so the app is usable immediately

## Project Structure

```
.
├── backend/    # Spring Boot REST API (com.bookmanager)
│   └── src/main/java/com/bookmanager
│       ├── controller/   # REST endpoints
│       ├── service/      # Business logic
│       ├── repository/   # Spring Data JPA repository
│       ├── model/        # JPA entity (Book)
│       ├── dto/          # Request DTOs
│       ├── exception/    # Global error handling
│       └── config/       # CORS + seed data
└── frontend/   # React + Vite single-page app
    └── src
        ├── api/          # Fetch-based API client
        └── components/   # BookForm, BookList, Modal
```

## Prerequisites

- **Java 21+**
- **Node.js 18+** and **npm**
- No Maven install needed — the project ships with the Maven wrapper (`mvnw`).

## Getting Started

### 1. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**.

- API base: `http://localhost:8080/api/books`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:bookdb`, user `sa`, empty password)

### 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and proxies `/api` requests to the backend automatically (see `frontend/vite.config.js`), so no CORS configuration is needed during development.

## API Reference

Base path: `/api/books`

| Method   | Path               | Description                                   |
| -------- | ------------------ | --------------------------------------------- |
| `GET`    | `/api/books`       | List all books. Optional `?search=` filter.   |
| `GET`    | `/api/books/{id}`  | Get a single book by id.                      |
| `POST`   | `/api/books`       | Create a book.                                |
| `PUT`    | `/api/books/{id}`  | Update an existing book.                       |
| `DELETE` | `/api/books/{id}`  | Delete a book.                                |

### Book payload

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "publishedYear": 2008,
  "genre": "Software",
  "available": true
}
```

`title` and `author` are required. Validation errors are returned as:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": { "title": "Title is required" }
}
```

## Configuration

### Backend (`backend/src/main/resources/application.properties`)

- `server.port` — API port (default `8080`)
- `app.cors.allowed-origins` — comma-separated origins allowed to call the API
- Swap H2 for another database by editing the `spring.datasource.*` properties and adding the relevant JDBC driver to `pom.xml`.

### Frontend (`frontend/.env`)

Copy `.env.example` to `.env` to override the API base URL:

```
VITE_API_BASE_URL=https://your-backend.example.com
```

Leave it empty to use the dev-server proxy.

## Building for production

```bash
# Backend — produces an executable jar in backend/target
cd backend && ./mvnw clean package

# Frontend — produces static assets in frontend/dist
cd frontend && npm run build
```

## Testing

```bash
cd backend && ./mvnw test
```

The backend includes integration tests covering create, fetch, validation, not-found and delete flows.
