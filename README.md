# Project Overview

This repository hosts a full-stack project-management system built on Django REST Framework and a modern React frontend. The backend now speaks JSON through DRF, while the SPA handles all user interactions using Material UI with full RTL support.

The codebase is intentionally split so backend, frontend, and infrastructure can evolve independently yet ship together through Docker.

```
.
├── apps/                     # Django domain apps (projects, registration)
├── carpentary/               # Django project settings & ASGI/Wsgi
├── dependencies/             # Backend runtime assets (requirements, Docker, manage.py)
├── frontend/                 # React + Vite application
└── media/                    # Uploaded assets (ignored in Docker builds)
```

---

## Architecture

- **Backend**: Django 4.2 + Django REST Framework. Provides authentication, project CRUD, file uploads, and bin-packing reports. The code lives under `apps/` with settings in `carpentary/`.
- **Frontend**: React 18 + Vite + Material UI. Implements SPA with protected routes, authentication workflow, real-time form validation, and RTL styling for Persian-speaking operators.
- **Database**: SQLite for lightweight local dev; PostgreSQL 15 when running via Docker Compose. Switch via environment variables.
- **Infrastructure**: Dockerfile and Compose definition under `dependencies/` for reproducible environments.

---

## Quickstart

### Prerequisites

- Python 3.11 (matches the Docker runtime; 3.9 compatible as shipped)
- Node.js ≥ 18 and npm
- Docker + Docker Compose (optional but recommended for consistent local dev)

### 1. Clone & bootstrap

```bash
git clone <repo-url>
cd "Sadegh process"
python -m venv venv && source venv/bin/activate
pip install -r dependencies/requirements.txt
```

### 2. Configure environment

Backend expects standard Django settings (SECRET_KEY, allowed hosts, database credentials). Recommended approach:

1. Copy `dependencies/.env` to `dependencies/.env.local` and adjust secrets.
2. Create `frontend/.env.local` with the API base URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

> The repository-level `.env` file used for Docker Compose is intentionally ignored by tooling; treat it as the canonical source for environment names when running inside containers.

### 3. Database migrations

```bash
cd dependencies
python manage.py migrate
python manage.py createsuperuser
```

Uploads land in `media/` by default; ensure the directory exists and has write permission when running outside Docker.

### 4. Start services (manual)

- **Backend**:
  ```bash
  cd dependencies
  python manage.py runserver 0.0.0.0:8000
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

Frontend runs on `http://localhost:5173` and proxies API calls to the backend URL defined in `VITE_API_URL`.

---

## Docker Workflow

All container assets live in `dependencies/`.

1. Ensure Docker is running.
2. From the `dependencies/` directory:
   ```bash
   docker compose up --build
   ```
3. Services:
   - `web`: Django app served via `python manage.py runserver`.
   - `db`: PostgreSQL 15 (credentials via `.env`).

`entrypoint.sh` applies migrations on boot, so schema stays in sync. Data persists through the named `postgres_data` volume.

**Common overrides**
- Override ports: edit `docker-compose.yml`.
- Change database credentials: update `.env` before the first boot.
- Running management commands inside the container:
  ```bash
  docker compose exec web python manage.py shell
  ```

---

## Testing & Quality

- **Backend tests**
  ```bash
  cd dependencies
  python manage.py test
  ```
- **Frontend tests & linting**
  - (Add scripts in `package.json` when ready.)

Automated formatters are not wired in; follow PEP8 for Python and Prettier guidelines for React.

---

## Feature Highlights

### Backend
- Token-based auth layered on Django sessions.
- Project CRUD, including metadata, images, and bin packing reports.
- Clean separation between serializers, viewsets, and business logic.
- CORS configured to allow the Vite dev server.
- Ready for PostgreSQL with minimal config changes.

### Frontend
- Comprehensive authentication flow (register, login, profile).
- Project listing, detail view, editing, deletion.
- File upload pipeline integrated with Material UI components.
- RTL-first layout and typography.
- API abstraction through `frontend/src/services`.

---

## API Map (selected)

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/profile/`
- `GET /api/projects/`
- `POST /api/projects/`
- `GET /api/projects/{id}/`
- `PUT /api/projects/{id}/`
- `DELETE /api/projects/{id}/`

Swagger/OpenAPI is not yet published; DRF browsable API is available at runtime for quick inspection.

---

## Deployment Notes

- Configure `DJANGO_ALLOWED_HOSTS`, `DJANGO_SECRET_KEY`, and database settings via environment variables.
- For production, swap the runserver command with a WSGI/ASGI server (gunicorn/uvicorn) and front with a reverse proxy. The current Dockerfile is optimized for development simplicity.
- Static files are not collected automatically. If serving over classic Django static hosting, run `python manage.py collectstatic` and mount a volume.

---

## Future Enhancements

- Harden Docker setup for production (multi-stage build, gunicorn, static assets).
- Add CI pipeline for tests and linting.
- Wire up end-to-end tests for critical flows.
- Extend React app with offline caching and improved error boundaries.

---

## Support

Questions or issues? Open a GitHub issue with details about the environment (OS, Python/Node versions, Docker compose logs). Contributions via PRs are welcome—target small, focused changes with accompanying tests whenever possible.
