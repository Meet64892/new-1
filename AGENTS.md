# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

This repo is a **Book Management System** with two independent apps (not an npm workspace monorepo):

| App | Path | Dev URL |
|-----|------|---------|
| Spring Boot API | `backend/` | http://localhost:8080 |
| React + Vite UI | `frontend/` | http://localhost:5173 |

H2 runs **in-process** inside the backend (`jdbc:h2:mem:bookdb`). There is no Docker Compose or separate database service.

### Running for full-stack manual testing

Start **both** services (two terminals or tmux sessions):

```bash
cd backend && ./mvnw spring-boot:run
```

```bash
cd frontend && npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080` (see `frontend/vite.config.js`), so the UI does not need `VITE_API_BASE_URL` during local dev.

Optional: H2 console at http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:bookdb`, user `sa`, empty password).

### Lint / test / build

See root `README.md` for the canonical commands. Quick reference:

| Task | Command |
|------|---------|
| Backend tests | `cd backend && ./mvnw test` |
| Backend package | `cd backend && ./mvnw clean package` |
| Frontend lint | `cd frontend && npm run lint` |
| Frontend build | `cd frontend && npm run build` |

There is **no** backend lint target in `pom.xml` and **no** frontend unit/E2E test script.

Backend integration tests use `@SpringBootTest` + MockMvc and do **not** require running dev servers.

### Gotchas

- **Java 21** is required (`backend/pom.xml`). The Maven wrapper (`backend/mvnw`) avoids a system Maven install; the first `./mvnw` invocation may download the wrapper distribution and dependencies (can take 15–30s).
- **Seed data** is inserted on backend startup, so a fresh API already lists sample books.
- For browser access from outside the VM, run Vite with `--host 0.0.0.0` if needed: `npm run dev -- --host 0.0.0.0`.
