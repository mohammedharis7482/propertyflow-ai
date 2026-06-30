# PropertyFlow AI Deployment Guide

## 1. Project Deployment Overview

PropertyFlow AI is a full-stack GCC-focused real estate SaaS product.

Production stack:

- Frontend: Next.js App Router
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT
- Media files: local development media directory; Cloudinary/S3 recommended for Render production uploads
- AI services: backend rule-based AI insights

This guide is planning and preparation only. It does not deploy the project yet.

## 2. Recommended Production Architecture

Recommended first deployment architecture:

- Frontend hosting: Vercel
- Backend hosting: Render Web Service
- Database: Render PostgreSQL
- App server: Gunicorn
- Static files: WhiteNoise
- Frontend domain: existing Vercel domain or custom domain
- Backend API domain: Render backend domain first, custom API domain later

Beginner-friendly first target:

```text
Frontend: Vercel
Backend: Render Web Service
Database: Render PostgreSQL
```

Advanced future production architecture:

- Backend hosting: Ubuntu VPS
- Database: PostgreSQL on the VPS or managed PostgreSQL
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
Frontend calls https://propertyflow-backend.onrender.com/api/v1
↓
Render routes the request to the web service
↓
Gunicorn runs Django
↓
Django queries Render PostgreSQL
↓
Django returns JSON to the frontend
```

## 4. Required Accounts / Services

Required:

- GitHub account/repository
- Vercel account
- Render account
- Domain provider account if using custom domains

Recommended later:

- VPS provider account for advanced self-managed deployment
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

Phase 2: Render PostgreSQL Setup

- Create a Render PostgreSQL database.
- Copy the internal/external `DATABASE_URL`.
- Keep database credentials private.

Phase 3: Render Django Web Service

- Create a Render Web Service from the GitHub repo.
- Set root directory to `propertyflow_backend`.
- Set build command.
- Set start command.
- Add backend environment variables.

Phase 4: Backend Production Verification

- Confirm build succeeds.
- Confirm migrations run.
- Test `/api/v1/health/`.
- Create/admin-check superuser if needed.

Phase 5: Vercel Frontend Connection

- Update `NEXT_PUBLIC_API_URL` in Vercel.
- Redeploy frontend.
- Confirm public pages call Render backend.

Phase 6: Production Testing

- Test auth, dashboards, workflows, admin actions, and AI features.

Phase 7: Custom Domain + SSL

- Keep Vercel frontend domain or configure custom domain.
- Add custom API domain on Render later if needed.
- Render and Vercel provide SSL automatically.

Phase 8: Backup and Maintenance

- Configure Render PostgreSQL backups based on plan.
- Back up media files.
- Monitor logs.
- Update packages carefully.

Advanced future phases:

- Move backend to Ubuntu VPS if needed.
- Add Nginx, systemd, Certbot, and manual PostgreSQL management.

## 6. Backend Production Environment Variables

Backend environment variables on Render:

```env
DEBUG=False
SECRET_KEY=replace-with-strong-secret-key
ALLOWED_HOSTS=propertyflow-backend.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-vercel-url.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-url.vercel.app

DATABASE_URL=postgresql://...

DJANGO_SETTINGS_MODULE=config.settings.production
```

Never commit real production secrets.

## 7. Frontend Production Environment Variables

Vercel environment variable:

```env
NEXT_PUBLIC_API_URL=https://propertyflow-backend.onrender.com/api/v1
```

Local frontend development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## 8. Render Backend Deployment Commands

Render settings:

```text
Root Directory:
propertyflow_backend

Build Command:
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate

Start Command:
gunicorn config.wsgi:application
```

Manual local equivalent:

```bash
cd propertyflow_backend
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=config.settings.production
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application
```

Render runs the build and start commands automatically.

## 9. Render PostgreSQL Plan

Steps:

1. Create a new Render PostgreSQL database.
2. Copy the `DATABASE_URL`.
3. Add it to the Render backend Web Service environment variables.
4. Render will use `dj-database-url` to configure Django PostgreSQL.

The old `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, and `DATABASE_PORT` style still exists as a fallback for non-Render deployments.

## 9A. Beginner Render Deployment Path

1. Push the latest code to GitHub.
2. In Render, create PostgreSQL:
   - Name: `propertyflow-postgres`
   - Database: `propertyflow_db`
   - User: `propertyflow_user`
3. Copy the database `DATABASE_URL`.
4. In Render, create Web Service:
   - Repository: PropertyFlow AI repo
   - Root Directory: `propertyflow_backend`
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn config.wsgi:application`
5. Add environment variables:
   - `DJANGO_SETTINGS_MODULE=config.settings.production`
   - `DEBUG=False`
   - `SECRET_KEY=<Render generated secret>`
   - `ALLOWED_HOSTS=propertyflow-backend.onrender.com`
   - `CORS_ALLOWED_ORIGINS=https://your-vercel-url.vercel.app`
   - `CSRF_TRUSTED_ORIGINS=https://your-vercel-url.vercel.app`
   - `DATABASE_URL=<Render PostgreSQL URL>`
6. Deploy backend.
7. Test:
   - `https://propertyflow-backend.onrender.com/api/v1/health/`
8. In Vercel, update:
   - `NEXT_PUBLIC_API_URL=https://propertyflow-backend.onrender.com/api/v1`
9. Redeploy Vercel frontend.
10. Test public pages, login, dashboards, workflows, admin actions, and AI features.

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

Initial Render plan:

- Static files are handled by WhiteNoise after `collectstatic`.
- Seeded remote image URLs continue to work.
- User-uploaded media should not rely on Render's ephemeral filesystem for long-term production persistence.

Recommended production media plan:

- Move media uploads to Cloudinary or AWS S3.
- Store only URLs in Django.
- Avoid relying on Render disk for long-term uploaded media.

Temporary MVP note:

- If no real production uploads are needed at launch, Render can run the API while existing remote seeded images continue to display.

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
