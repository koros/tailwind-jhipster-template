# Docker Configuration

This directory contains Docker configuration files for running the application in different environments.

## Files

**Production (Separate Containers):**

- **Dockerfile.frontend** - Nginx serving React build
- **Dockerfile.backend** - Node.js/Express API
- **docker-compose.prod.yml** - Production setup (Nginx + Backend + Database)
- **nginx.conf** - Nginx config for static files + reverse proxy

**Development/Simple:**

- **Dockerfile** - Combined frontend + backend (simpler, not recommended for production)
- **docker-compose.yml** - Single container setup
- **docker-compose.dev.yml** - Database only for local development

## Production Setup (Recommended)

The production setup uses 3 separate containers:

1. **Nginx** - Serves frontend static files and reverse proxies `/api` requests to backend
2. **Backend** - Node.js/Express API server
3. **Database** - PostgreSQL

### Advantages

- ✅ Independent scaling (scale API separately from frontend)
- ✅ Deploy frontend/backend independently
- ✅ Better isolation and fault tolerance
- ✅ Efficient static file serving with Nginx
- ✅ No CORS issues (same-origin routing via Nginx)

### Usage

```bash
# Build and start all services
docker compose -f ./docker/docker-compose.prod.yml up --build

# Or use the shortcut
cd docker && docker compose -f docker-compose.prod.yml up --build

# Stop and remove
docker compose -f ./docker/docker-compose.prod.yml down -v
```

Access the app at **http://localhost** (port 80)

### Architecture

```
Browser (http://localhost)
         ↓
    Nginx:80
    ├── / → serves React static files
    ├── /api → proxy to backend:8080
    ├── /management → proxy to backend:8080
    └── /v3/api-docs → proxy to backend:8080
         ↓
   Backend:8080 (internal)
         ↓
    PostgreSQL:5432
```

## Development (Database Only)

For local development, run only the PostgreSQL database in Docker while running the frontend and backend locally:

```bash
# Start database
docker compose -f ./docker/docker-compose.dev.yml up -d

# Stop and remove database
docker compose -f ./docker/docker-compose.dev.yml down -v
```

Then run your application locally:

```bash
# Terminal 1 - Backend
npm run backend:start

# Terminal 2 - Frontend
npm start
```

## Simple Single Container Setup

For demos or very small deployments:

```bash
# Build and start (frontend + backend in one container)
docker compose -f ./docker/docker-compose.yml up --build

# Stop
docker compose -f ./docker/docker-compose.yml down -v
```

Access at **http://localhost:8080**

⚠️ **Not recommended for production** - harder to scale and maintain.

## Environment Variables

Create `docker/.env` file with your configuration:

```bash
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@example.com

# JWT Secrets (use strong random values!)
JWT_SECRET=your-long-random-secret-key-min-256-bits
JWT_REFRESH_SECRET=your-refresh-secret-key-min-256-bits
```

## Security Notes

⚠️ **Important for Production:**

1. Change default database credentials in compose files
2. Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` values
3. Use `.env` file for sensitive variables (already in `.gitignore`)
4. Configure firewall rules appropriately
5. Use HTTPS in production (add SSL/TLS to Nginx)
6. Review and harden Nginx security headers

## Troubleshooting

**Database connection issues:**

```bash
# Check container health
docker compose -f ./docker/docker-compose.prod.yml ps

# View logs
docker compose -f ./docker/docker-compose.prod.yml logs backend
docker compose -f ./docker/docker-compose.prod.yml logs db
```

**Nginx routing issues:**

```bash
# Check nginx logs
docker compose -f ./docker/docker-compose.prod.yml logs nginx

# Test backend health directly
docker exec <backend-container> wget -qO- http://localhost:8080/management/health
```

**Build issues:**

```bash
# Clean rebuild
docker compose -f ./docker/docker-compose.prod.yml build --no-cache
docker system prune -a
```

**Port conflicts:**

- Production (Nginx): Change port 80 to something else in `docker-compose.prod.yml`
- Simple setup: Change port 8080 in `docker-compose.yml`
- Database: Change port 5432 if needed

## Performance Tips

1. **Enable HTTP/2** in Nginx for better performance
2. **Add CDN** for static assets in production
3. **Configure Nginx caching** for API responses if appropriate
4. **Use multi-stage builds** (already implemented) to minimize image sizes
5. **Set resource limits** in compose files for production
