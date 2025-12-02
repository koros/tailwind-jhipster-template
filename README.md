# myTailwindJhipster

This application was generated using JHipster 8.11.0 and customized with a Node.js/Express backend instead of the traditional Java/Spring Boot stack. You can find documentation at [https://www.jhipster.tech/documentation-archive/v8.11.0](https://www.jhipster.tech/documentation-archive/v8.11.0).

## Project Structure

This is a full-stack JavaScript/TypeScript application with a modern tech stack:

**Backend:**

- Node.js with Express.js
- TypeScript
- TypeORM for database management
- PostgreSQL database
- JWT authentication with HttpOnly cookie-based refresh tokens
- ESLint with TypeScript-aware linting

**Frontend:**

- React 18.3
- Redux Toolkit for state management
- Tailwind CSS for styling (migrated from Bootstrap/Reactstrap)
- React Router for navigation
- Axios for HTTP requests
- react-jhipster for internationalization (50+ languages)
- Jest for testing

**Directory Structure:**

```
/client                    - React frontend application
  /app                    - Application components
    /modules              - Feature modules (home, admin, account, etc.)
    /shared               - Shared components and utilities
  /i18n                   - Translation files
/server                   - Node.js/Express backend
  /src
    /config               - Configuration files
    /controllers          - Request handlers
    /entities             - TypeORM entities
    /middleware           - Express middleware
    /routes               - API routes
    /services             - Business logic
    /templates            - Email templates
    /utils                - Utility functions
/docker                   - Docker configurations
/webpack                  - Webpack build configurations
```

Configuration files:

- `.yo-rc.json` - JHipster configuration
- `package.json` - Root dependencies and scripts
- `server/package.json` - Backend dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.mjs` - Frontend ESLint configuration
- `server/eslint.config.mjs` - Backend ESLint configuration

## Development

### Prerequisites

- **Node.js** >= 22.15.0
- **npm** >= 10.x
- **PostgreSQL** >= 12
- **Docker** (optional, for running services in containers)

## Docker

This project ships with a production-ready Docker setup and a lightweight development setup for the database.

### Files

- `docker/Dockerfile`: Multi-stage build that compiles the React frontend and Node.js backend and serves the frontend from the backend container.
- `docker/docker-compose.yml`: Production compose file with the app container and PostgreSQL.
- `docker/docker-compose.dev.yml`: Development compose file for running PostgreSQL only.

### Quick Start (Production)

```bash
# Build and start app + database
npm run docker:up

# Stop and remove containers and volumes
npm run docker:down
```

App runs at `http://localhost:8080`.

### Development (Database Only)

```bash
# Start only the database
npm run docker:dev:up

# Stop and remove DB
npm run docker:dev:down
```

Then run the app locally:

```bash
npm run backend:start   # backend on 8080
npm start               # frontend on 9000
```

### Environment Variables

For production Docker, variables are provided via compose:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (change in production!)
- `PORT` (default 8080)

You can also create `docker/.env` (see `docker/.env.example`).

### Initial Setup

1. **Clone and install root dependencies:**

```bash
npm install
```

2. **Install backend dependencies:**

```bash
cd server
npm install
cd ..
```

3. **Configure environment variables:**

Create or edit `server/.env`:

```env
# Database
DATABASE_URL=postgresql://myTailwindJhipster:password@localhost:5432/myTailwindJhipster

# JWT Secrets (use strong random strings in production)
JWT_SECRET=your-secret-key-min-256-bits
JWT_REFRESH_SECRET=your-refresh-secret-key-min-256-bits

# Email Configuration (optional for development)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@mytailwindjhipster.com
```

4. **Start PostgreSQL database:**

Using Docker (recommended):

```bash
npm run docker:db:up
```

Or use your local PostgreSQL installation.

5. **Run database migrations:**

```bash
npm run migration:run
```

6. **(Optional) Seed database with sample data:**

```bash
npm run server:seed
```

This creates:

- Admin user: `admin` / `admin`
- Regular user: `user` / `user`
- Sample todos for testing

### Running the Application

**Development mode with hot reload:**

```bash
# Terminal 1 - Start the backend (port 8080)
npm run server:dev

# Terminal 2 - Start the frontend dev server (port 9000)
npm start
```

The application will be available at `http://localhost:9000` and will proxy API requests to the backend at `http://localhost:8080`.

**Production build:**

```bash
# Build both frontend and backend
npm run build
npm run server:build

# Start production server
npm run server:start
```

### Available npm Scripts

**Backend Development:**

```bash
npm run server:dev          # Start dev server with hot reload
npm run server:build        # Build TypeScript to JavaScript
npm run server:start        # Start production server
npm run server:seed         # Seed database with sample data
npm run server:lint         # Run ESLint on backend code

# Database migrations
npm run migration:create    # Create empty migration file
npm run migration:generate  # Generate migration from entity changes
npm run migration:run       # Run pending migrations
npm run migration:revert    # Rollback last migration
npm run migration:show      # Show migration status
```

**Frontend Development:**

```bash
npm start                   # Start dev server on port 9000
npm run build               # Build for production
npm run webapp:prod         # Optimized production build
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix ESLint errors
npm test                    # Run Jest tests
npm run test:watch          # Run tests in watch mode
npm run prettier:check      # Check code formatting
npm run prettier:format     # Format all code
```

**Docker:**

```bash
npm run docker:db:up        # Start PostgreSQL in Docker
npm run docker:db:down      # Stop and remove PostgreSQL container
npm run services:up         # Start all required services
```

**Legacy aliases (still available):**

```bash
npm run backend:start       # Alias for server:dev
npm run backend:build       # Alias for server:build
npm run backend:seed        # Alias for server:seed
```

### Tailwind CSS Implementation

This project has been fully migrated from Bootstrap/Reactstrap to **Tailwind CSS v3**.

**Features:**

- ✅ Utility-first CSS approach with Tailwind v3
- ✅ Custom design system with brand colors
- ✅ Responsive design with mobile-first approach
- ✅ RTL (Right-to-Left) support via `postcss-rtlcss`
- ✅ Custom component library for consistent UI
- ✅ Dark mode support ready (Tailwind classes available)

**Custom Colors:**

```js
// tailwind.config.js
colors: {
  brand: {
    DEFAULT: '#533f03',
    light: '#6b5304',
    dark: '#3b2d02'
  },
  navbar: '#353d47',
  accent: '#009cd8'
}
```

**Component Library:**

Custom Tailwind components in `client/app/shared/components/`:

```tsx
import { Button, Badge, Card, Modal, ModalHeader, ModalBody, ModalFooter } from 'app/shared/components';

// Button - 9 variants (primary, secondary, info, success, warning, danger, light, dark, link)
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Badge - 7 color variants
<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>

// Card - Container component
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Modal - Full-featured modal with subcomponents
<Modal isOpen={isOpen} toggle={toggleModal}>
  <ModalHeader toggle={toggleModal}>Modal Title</ModalHeader>
  <ModalBody>
    Modal content here
  </ModalBody>
  <ModalFooter>
    <Button variant="primary" onClick={handleSave}>Save</Button>
    <Button variant="secondary" onClick={toggleModal}>Cancel</Button>
  </ModalFooter>
</Modal>
```

**Router Integration:**

Buttons support React Router's `Link` component:

```tsx
<Button tag={Link} to="/dashboard" variant="info">
  Go to Dashboard
</Button>
```

**RTL Support:**

- Language toggle automatically sets `<html dir="rtl">` or `<html dir="ltr">`
- `postcss-rtlcss` transforms directional utilities (e.g., `ml-4` → `mr-4` in RTL)
- Supports 50+ locales including Arabic (`ar-ly`)

**Migration Status:**

All core application components have been migrated to Tailwind CSS:

- Landing page with hero, sections, pricing, and contact forms
- User management (list, detail, edit forms)
- Todo entities (CRUD operations)
- Authentication (login, register, account management)
- Admin dashboards (health checks, metrics, API docs)

**Development:**

Tailwind's JIT (Just-In-Time) compiler is enabled for instant builds and smaller CSS output. Use any Tailwind utility class and it will be generated on demand.

### Internationalization (i18n)

The application supports **50+ languages** out of the box using `react-jhipster`:

- English (en), Spanish (es), French (fr), German (de)
- Chinese Simplified (zh-cn), Japanese (ja)
- Arabic (ar-ly) with RTL support
- And many more...

**Usage:**

```tsx
import { Translate, translate } from 'react-jhipster';

// For JSX content
<h1><Translate contentKey="home.title" /></h1>

// With interpolation
<p>
  <Translate contentKey="home.welcome" interpolate={{ name: userName }} />
</p>

// For attributes (placeholders, titles, etc.)
<input placeholder={translate('form.email.placeholder')} />
```

**Translation Files:**

Located in `client/i18n/{locale}/` with JSON structure:

```json
{
  "home": {
    "title": "Welcome",
    "welcome": "Hello, {{name}}!"
  }
}
```

The language selector in the header allows users to switch languages instantly.

### Administration Features

The Node.js backend provides essential administration capabilities:

**Available Features:**

- **User Management** - Create, update, delete users and manage authorities (roles)
- **Health Checks** - System health at `/management/health`:
  - Database connectivity status
  - Application status and uptime
  - Detailed component health
- **API Documentation** - Interactive Swagger UI at `/admin/docs`

**Not Available (Spring Boot specific):**

- Metrics dashboard (Spring Actuator)
- Configuration viewer (Spring environment)
- Log level management
- Database console (H2 console)

**Potential Node.js Enhancements:**

- Process metrics (memory, CPU via `process` API)
- Environment inspection (sanitized)
- Winston/Pino log controls
- Query monitoring

### Authentication & Security

**JWT Authentication with Secure Refresh Tokens:**

The application uses a dual-token authentication strategy:

1. **Access Token (short-lived)**

   - JWT stored in memory (or localStorage with "Remember me")
   - Short expiration (15 minutes)
   - Sent via `Authorization: Bearer` header
   - Contains user ID, username, and authorities

2. **Refresh Token (long-lived)**
   - Stored in HttpOnly, SameSite=Strict, Secure cookie
   - Long expiration (7 days, 28 days with "Remember me")
   - Never exposed to JavaScript (XSS protection)
   - Hashed with bcrypt before database storage

**Authentication Flow:**

```bash
# Login
POST /api/authenticate
Body: { username, password, rememberMe }
Response: { id_token }
Cookie: refreshToken (HttpOnly, Secure, SameSite=Strict)

# Refresh Access Token
POST /api/refresh-token
Cookie: refreshToken (sent automatically)
Response: { id_token }
Cookie: New rotated refreshToken

# Logout
POST /api/logout
Effect: Clears cookie and invalidates server-side refresh token
```

**Security Features:**

- ✅ Refresh tokens never exposed to JavaScript (XSS mitigation)
- ✅ Token rotation on every refresh (shrinks replay window)
- ✅ Bcrypt hashing for stored refresh tokens
- ✅ HttpOnly cookies prevent client-side access
- ✅ SameSite=Strict prevents CSRF attacks
- ✅ Secure flag in production (HTTPS only)
- ✅ Multi-tab session support (shared cookie)

**Session Management:**

- Access tokens stored in memory by default
- "Remember me" stores access token in localStorage
- Automatic token refresh before expiration
- Automatic logout on invalid/missing refresh token
- Manual logout clears both tokens

**Password Requirements:**

- Minimum 4 characters (configurable)
- Bcrypt hashing with salt rounds
- Password reset via email (with token expiration)

**Future Enhancements:**

- Refresh token versioning for instant revocation
- IP/User-Agent binding detection
- Sliding session expiry
- Rate limiting on auth endpoints

### Email Service

The backend includes a mail service for sending transactional emails:

**Features:**

- Nodemailer integration with SMTP
- Handlebars templates for HTML emails
- Plain text fallback generation
- Template caching for performance

**Email Templates:**

Located in `server/src/templates/mail/`:

- `activationEmail.html` - Account activation
- `creationEmail.html` - Welcome email for new users
- `passwordResetEmail.html` - Password reset instructions

**Configuration:**

Set environment variables in `server/.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@mytailwindjhipster.com
APPLICATION_NAME=MyTailwindJhipster
APPLICATION_URL=http://localhost:9000
```

**Usage:**

```typescript
import mailService from './services/mail.service';

// Send activation email
await mailService.sendActivationEmail(user);

// Send password reset email
await mailService.sendPasswordResetMail(user);
```

### Code Quality

**ESLint Configuration:**

Both frontend and backend have TypeScript-aware ESLint configurations:

**Frontend** (`eslint.config.mjs`):

- React and JSX rules
- TypeScript type checking
- Import ordering
- Accessibility checks (jsx-a11y)

**Backend** (`server/eslint.config.mjs`):

- TypeScript strict rules
- Naming conventions (camelCase, PascalCase)
- Async/await best practices
- Node.js-specific rules
- Express handler patterns

**Running Linters:**

```bash
# Frontend
npm run lint
npm run lint:fix

# Backend
npm run server:lint
cd server && npm run lint -- --fix
```

**Prettier:**

Code formatting is enforced with Prettier:

```bash
npm run prettier:check      # Check formatting
npm run prettier:format     # Auto-format all files
```

**Git Hooks:**

Husky + lint-staged run automatic checks on commit:

- ESLint on staged files
- Prettier formatting
- TypeScript type checking

### PWA Support

Progressive Web App features are available but disabled by default.

**To Enable:**

Uncomment in `client/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Workbox handles service worker generation with intelligent caching strategies.

## Production Deployment

### Building for Production

**Build both frontend and backend:**

```bash
# Build optimized frontend bundle
npm run webapp:prod

# Build backend TypeScript to JavaScript
npm run server:build
```

The frontend build outputs to `target/classes/static/` and the backend build outputs to `server/dist/`.

**Start production server:**

```bash
cd server
NODE_ENV=production npm start
```

The server will:

- Serve the static frontend from `/`
- Expose API endpoints at `/api/*`
- Run on port 8080 (configurable via `PORT` env variable)

### Environment Variables

Required for production:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT Secrets (use strong random strings!)
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret

# Email
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USER=your-email
MAIL_PASSWORD=your-password
MAIL_FROM=noreply@yourdomain.com

# Application
NODE_ENV=production
PORT=8080
APPLICATION_NAME=MyTailwindJhipster
APPLICATION_URL=https://yourdomain.com
```

### Docker Deployment

**Build Docker image:**

```bash
# Build image
docker build -t mytailwindjhipster:latest .

# Or for ARM64 (Apple Silicon)
docker build --platform linux/arm64 -t mytailwindjhipster:latest .
```

**Run with Docker Compose:**

```bash
# Start all services (app + PostgreSQL)
docker compose -f docker/app.yml up -d

# View logs
docker compose -f docker/app.yml logs -f

# Stop services
docker compose -f docker/app.yml down
```

### Database Migrations

**In production, run migrations before starting:**

```bash
cd server
npm run migration:run
```

**Check migration status:**

```bash
npm run migration:show
```

### Health Checks

Monitor application health:

```bash
curl http://localhost:8080/management/health
```

Response:

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "initialized": true,
        "pingMs": 2,
        "type": "postgres"
      }
    }
  }
}
```

## Testing

### Backend Tests

```bash
cd server
npm test                    # Run all tests
npm test -- --watch         # Run in watch mode
npm test -- --coverage      # Generate coverage report
```

### Frontend Tests

```bash
npm test                    # Run Jest tests
npm run test:watch          # Run in watch mode
npm run test-ci             # Run with CI optimizations
```

Tests are located next to the components they test:

- `*.spec.ts` - Backend unit tests
- `*.spec.tsx` - Frontend component tests

### End-to-End Tests

E2E tests can be added using Cypress or Playwright. Currently not configured.

## Docker Services

### Available Compose Files

Located in `docker/`:

```bash
# PostgreSQL database
docker compose -f docker/postgresql.yml up -d

# All required services
docker compose -f docker/services.yml up -d

# Full application stack (app + services)
docker compose -f docker/app.yml up -d

# Monitoring (Prometheus + Grafana)
docker compose -f docker/monitoring.yml up -d

# SonarQube for code quality
docker compose -f docker/sonar.yml up -d
```

### Common Commands

```bash
# Start services in background
docker compose -f docker/services.yml up -d

# View logs
docker compose -f docker/services.yml logs -f

# Stop services
docker compose -f docker/services.yml down

# Stop and remove volumes
docker compose -f docker/services.yml down -v

# Check running containers
docker ps
```

## Code Quality with SonarQube

Start SonarQube:

```bash
docker compose -f docker/sonar.yml up -d
```

Access at `http://localhost:9001` (default credentials: admin/admin)

Run analysis:

```bash
# Install sonar-scanner globally
npm install -g sonar-scanner

# Run scan
sonar-scanner
```

Configuration in `sonar-project.properties`.

## Troubleshooting

### Common Issues

**Database Connection Failed:**

```bash
# Check if PostgreSQL is running
docker ps

# Start database
npm run docker:db:up

# Check connection in server/.env
DATABASE_URL=postgresql://myTailwindJhipster:password@localhost:5432/myTailwindJhipster
```

**Port Already in Use:**

```bash
# Frontend (default 9000)
# Backend (default 8080)

# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Migration Errors:**

```bash
# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert

# In development, you can drop and recreate
npm run docker:db:down
npm run docker:db:up
npm run migration:run
npm run server:seed
```

**Email Not Sending:**

- Check SMTP credentials in `server/.env`
- For Gmail, use App Password (not account password)
- Verify firewall/network allows SMTP connection

**Build Errors:**

```bash
# Clear caches and reinstall
rm -rf node_modules server/node_modules
rm package-lock.json server/package-lock.json
npm install
cd server && npm install
```

## Technology Stack

**Backend:**

- Node.js 22.15+
- Express.js 4.x
- TypeScript 5.3
- TypeORM 0.3
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- Handlebars (email templates)
- Swagger/OpenAPI

**Frontend:**

- React 18.3
- Redux Toolkit
- React Router 6.x
- TypeScript 5.3
- Tailwind CSS 3.x
- Axios
- react-jhipster (i18n)
- FontAwesome
- dayjs

**Build Tools:**

- Webpack 5
- Babel
- PostCSS (with rtlcss for RTL support)
- ESLint 9
- Prettier
- Husky (git hooks)
- Jest (testing)

**DevOps:**

- Docker & Docker Compose
- SonarQube (code quality)
- Prometheus + Grafana (monitoring)

## Additional Resources

- [JHipster Documentation](https://www.jhipster.tech/documentation-archive/v8.11.0)
- [TypeORM Documentation](https://typeorm.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Express.js Documentation](https://expressjs.com/)

## License

This project is licensed under the UNLICENSED license.
