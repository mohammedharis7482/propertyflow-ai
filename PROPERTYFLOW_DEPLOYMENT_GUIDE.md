# PropertyFlow AI Deployment Guide

## 1. Project Deployment Overview

PropertyFlow AI is a full-stack GCC-focused real estate SaaS product.

Production stack:

- Frontend: Next.js App Router
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT
- Media files: local VPS media directory initially
- AI services: backend rule-based AI insights

This guide is planning and preparation only. It does not deploy the project yet.

## 2. Recommended Production Architecture

Recommended first production architecture:

- Frontend hosting: Vercel
- Backend hosting: Ubuntu VPS
- Database: PostgreSQL on the VPS initially
- Web server: Nginx
- App server: Gunicorn
- Frontend domain: `propertyflowai.com`
- Backend API domain: `api.propertyflowai.com`

Future scaling options:

- Move PostgreSQL to managed database service.
- Move media files to Cloudinary, AWS S3, or another object storage provider.
- Add Redis/Celery for background jobs.
- Add monitoring and error tracking.

## 3. Request Flow

Production request flow:

```text
User opens propertyflowai.com
↓
Vercel serves the Next.js frontend
↓
Frontend calls https://api.propertyflowai.com/api/v1
↓
Nginx receives the backend request
↓
Nginx proxies to Gunicorn
↓
Gunicorn runs Django
↓
Django queries PostgreSQL
↓
Django returns JSON to the frontend
```

## 4. Required Accounts / Services

Required:

- GitHub account/repository
- Vercel account
- VPS provider account
- Domain provider account

Recommended later:

- Cloudinary or AWS S3 for media files
- Email provider for transactional email
- Monitoring/logging provider
- Error tracking provider

## 5. Deployment Phases

Phase 1: Production Preparation

- Confirm local build passes.
- Confirm backend check passes.
- Prepare production environment variables.
- Confirm `.env` files are not committed.
- Confirm production settings use PostgreSQL.

Phase 2: VPS Setup

- Create Ubuntu VPS.
- Add SSH access.
- Update server packages.
- Install Python, PostgreSQL, Nginx, Git, and system dependencies.
- Create app directory.

Phase 3: PostgreSQL Setup

- Create database.
- Create database user.
- Grant privileges.
- Add database credentials to backend `.env`.

Phase 4: Django Backend Deployment

- Clone repository.
- Create virtual environment.
- Install requirements.
- Configure `.env`.
- Run migrations.
- Collect static files.
- Create superuser.
- Test Gunicorn manually.

Phase 5: Nginx + Gunicorn Setup

- Create Gunicorn systemd service.
- Configure Nginx reverse proxy.
- Serve static files.
- Serve media files.
- Proxy API requests to Gunicorn.

Phase 6: Domain + SSL

- Point `api.propertyflowai.com` to VPS IP.
- Install Certbot.
- Issue SSL certificate.
- Confirm HTTPS works.
- Enable auto-renewal.

Phase 7: Vercel Frontend Deployment

- Import GitHub repo into Vercel.
- Set frontend environment variables.
- Deploy frontend.
- Point frontend domain to Vercel.

Phase 8: Production Testing

- Test public pages.
- Test auth.
- Test dashboards.
- Test workflows.
- Test admin actions.
- Test AI features.
- Test mobile.

Phase 9: Backup and Maintenance

- Configure PostgreSQL backups.
- Back up media files.
- Monitor logs.
- Update packages carefully.

## 6. Backend Production Environment Variables

Backend `.env` on VPS:

```env
DEBUG=False
SECRET_KEY=replace-with-strong-secret-key
ALLOWED_HOSTS=api.propertyflowai.com
CSRF_TRUSTED_ORIGINS=https://api.propertyflowai.com,https://propertyflowai.com,https://www.propertyflowai.com
CORS_ALLOWED_ORIGINS=https://propertyflowai.com,https://www.propertyflowai.com

DATABASE_NAME=propertyflow_db
DATABASE_USER=propertyflow_user
DATABASE_PASSWORD=replace-with-strong-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

DJANGO_SETTINGS_MODULE=config.settings.production
```

Never commit real production secrets.

## 7. Frontend Production Environment Variables

Vercel environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.propertyflowai.com/api/v1
```

Local frontend development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## 8. Backend Deployment Commands

Future backend deployment commands:

```bash
git clone <repo-url>
cd propertyflow-ai/propertyflow_backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env with production values

export DJANGO_SETTINGS_MODULE=config.settings.production

python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser

gunicorn config.wsgi:application
```

Production Gunicorn should run through systemd, not manually.

## 9. PostgreSQL Plan

Example PostgreSQL setup:

```sql
CREATE DATABASE propertyflow_db;
CREATE USER propertyflow_user WITH PASSWORD 'replace-with-strong-password';
ALTER ROLE propertyflow_user SET client_encoding TO 'utf8';
ALTER ROLE propertyflow_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE propertyflow_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE propertyflow_db TO propertyflow_user;
```

Then configure Django:

```env
DATABASE_NAME=propertyflow_db
DATABASE_USER=propertyflow_user
DATABASE_PASSWORD=replace-with-strong-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

## 10. Nginx Plan

Nginx responsibilities:

- Receive HTTPS requests for `api.propertyflowai.com`.
- Reverse proxy requests to Gunicorn.
- Serve `/static/` from Django `STATIC_ROOT`.
- Serve `/media/` from Django `MEDIA_ROOT`.

Conceptual Nginx flow:

```text
api.propertyflowai.com
↓
Nginx
↓
Gunicorn unix socket or localhost port
↓
Django
```

Static/media plan:

```text
/static/ -> propertyflow_backend/staticfiles/
/media/  -> propertyflow_backend/media/
```

## 11. SSL Plan

Use Certbot:

- Install Certbot and Nginx plugin.
- Request SSL for `api.propertyflowai.com`.
- Confirm HTTPS works.
- Confirm HTTP redirects to HTTPS.
- Confirm auto-renewal timer is active.

Example:

```bash
sudo certbot --nginx -d api.propertyflowai.com
sudo certbot renew --dry-run
```

## 12. Vercel Plan

Frontend deployment steps:

1. Push latest code to GitHub.
2. Import repository in Vercel.
3. Set project root to the frontend root if required.
4. Add environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.propertyflowai.com/api/v1
```

5. Deploy.
6. Configure `propertyflowai.com` and `www.propertyflowai.com`.
7. Test frontend calling backend API.

## 13. Media File Plan

Initial production plan:

- Store media files in VPS `MEDIA_ROOT`.
- Nginx serves `/media/`.
- Back up media directory regularly.

Future recommended plan:

- Move media uploads to Cloudinary or AWS S3.
- Store only URLs in Django.
- Avoid relying on VPS disk for long-term uploaded media.

## 14. Security Checklist

Before production:

- `DEBUG=False`
- Strong `SECRET_KEY`
- `.env` not committed
- `ALLOWED_HOSTS` set correctly
- `CORS_ALLOWED_ORIGINS` set correctly
- `CSRF_TRUSTED_ORIGINS` set correctly
- Strong PostgreSQL password
- Admin test credentials changed
- HTTPS enabled
- Secure cookies enabled
- HSTS enabled after HTTPS is verified
- Gunicorn runs as non-root user
- Database is not publicly exposed
- Server firewall allows only SSH, HTTP, and HTTPS

## 15. Final Production Test Checklist

Public:

- Home page loads
- Properties page loads
- Property detail page loads
- Agents page loads
- Agent detail page loads
- Insights/about/contact pages load
- Images load
- Mobile responsive layout works

Auth:

- Register works
- Login works
- Logout works
- Wrong role redirects correctly

User:

- User dashboard loads
- Save property works
- Remove saved property works
- Inquiry creation works
- Appointment booking works
- Appointment cancel works
- AI recommendations load

Agent:

- Agent dashboard loads
- Inquiries load
- Inquiry status update works
- Appointments load
- Appointment status update works
- AI lead priority works
- Listing quality display works

Admin:

- Admin dashboard loads
- Users list loads
- Agents list loads
- Properties list loads
- Inquiries list loads
- Appointments list loads
- Audit logs load
- Admin approvals work
- Admin notification sending works
- AI market signals load

System:

- Media files load
- Static files load
- No major browser console errors
- No CORS errors
- No mixed-content warnings
- Mobile layout works

## 16. Rollback Plan

Rollback strategy:

- Keep previous working git commit hash.
- Back up PostgreSQL before deploy.
- Back up media files before deploy.
- If deployment fails, pull previous commit.
- Reinstall dependencies if needed.
- Re-run migrations only if safe.
- Restart Gunicorn and Nginx.

Example:

```bash
git checkout <previous-good-commit>
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
sudo systemctl restart propertyflow
sudo systemctl restart nginx
```

## 17. Backup Plan

PostgreSQL backup:

```bash
pg_dump propertyflow_db > propertyflow_backup_YYYY_MM_DD.sql
```

Media backup:

```bash
tar -czf propertyflow_media_YYYY_MM_DD.tar.gz media/
```

Environment backup:

- Keep production `.env` in a secure password manager.
- Do not store secrets in GitHub.
- Restrict server access.

## 18. Maintenance Notes

Regular maintenance:

- Update server packages carefully.
- Monitor Nginx logs.
- Monitor Gunicorn/Django logs.
- Restart Gunicorn after backend deploys.
- Run SSL renewal dry-run periodically.
- Back up database regularly.
- Back up media files regularly.
- Rotate admin credentials when needed.
- Review audit logs.
- Monitor disk usage.

Useful commands:

```bash
sudo systemctl status nginx
sudo systemctl status propertyflow
sudo journalctl -u propertyflow -f
sudo nginx -t
sudo systemctl restart propertyflow
sudo systemctl restart nginx
```

