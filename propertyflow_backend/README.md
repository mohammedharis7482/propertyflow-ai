# PropertyFlow AI Backend

Phase 1 backend foundation for PropertyFlow AI.

This backend is intentionally limited to project setup, authentication, role
foundation, reusable common utilities, and a health check endpoint. Property,
agent, inquiry, appointment, analytics, and AI modules will be added in later
phases.

## Stack

- Python
- Django
- Django REST Framework
- SQLite for local development
- PostgreSQL for production deployment
- Simple JWT
- django-cors-headers
- python-decouple

## Setup

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env
```

Local development uses SQLite by default at `db.sqlite3`, so you do not need
PostgreSQL installed on your Mac to run Phase 1. PostgreSQL settings remain in
`config/settings/production.py` and will be configured during deployment.

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

Run the development server:

```bash
python manage.py runserver
```

## Database Notes

Local development:

- Uses SQLite automatically from `config/settings/local.py`
- Database file: `db.sqlite3`
- Works with `python manage.py migrate`, `createsuperuser`, and `runserver`

Production:

- Uses PostgreSQL from `config/settings/production.py`
- Reads database credentials from environment variables
- PostgreSQL will be configured during deployment

## Test Endpoints

Health check:

```bash
curl http://127.0.0.1:8000/api/v1/health/
```

Register:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Mohammed Haris",
    "email": "haris@example.com",
    "phone": "+971500000000",
    "password": "StrongPassword123",
    "role": "USER"
  }'
```

Login:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "haris@example.com",
    "password": "StrongPassword123"
  }'
```

Current user:

```bash
curl http://127.0.0.1:8000/api/v1/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Refresh token:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

Logout:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/logout/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

## API Prefix

All Phase 1 API routes live under:

```text
/api/v1/
```

## Phase 1 Routes

- `GET /api/v1/health/`
- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/token/refresh/`
- `POST /api/v1/auth/logout/`
- `GET /api/v1/auth/me/`
