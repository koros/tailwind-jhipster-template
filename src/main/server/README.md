# My Tailwind JHipster - Node.js Backend

Node.js/Express backend with TypeORM for My Tailwind JHipster application.

## Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 4.18
- **ORM**: TypeORM 0.3 with PostgreSQL
- **Authentication**: JWT with bcryptjs
- **Language**: TypeScript 5.3

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- Environment variables configured in `.env`

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with:

```env
PORT=8080
NODE_ENV=development

# PostgreSQL connection
DATABASE_URL=postgresql://myapp:@localhost:5432/myapp

# JWT configuration
JWT_SECRET=your-base64-encoded-secret
JWT_EXPIRATION=86400

# CORS
CORS_ORIGIN=http://localhost:9000
```

## Database Setup

1. Start PostgreSQL:

```bash
docker compose -f ../src/main/docker/postgresql.yml up -d
```

2. The database schema is managed by TypeORM. Entities will sync automatically in development mode.

3. Seed initial users (admin/admin and user/user):

```bash
npm run seed
```

## Development

Start the development server with hot-reload:

```bash
npm run dev
```

The server will run on http://localhost:8080

## Production Build

Build TypeScript to JavaScript:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/authenticate` - Login
- `POST /api/register` - Register new user
- `GET /api/activate?key={key}` - Activate account

### Account Management (requires authentication)

- `GET /api/account` - Get current user
- `POST /api/account` - Update current user
- `POST /api/account/change-password` - Change password
- `POST /api/account/reset-password/init` - Request password reset
- `POST /api/account/reset-password/finish` - Complete password reset

### User Management (requires admin role)

- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/:login` - Get user by login
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:login` - Update user
- `DELETE /api/admin/users/:login` - Delete user
- `GET /api/admin/users/authorities` - List available roles

### Todo Management (requires authentication)

- `GET /api/todos` - List todos (paginated)
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Health Check

- `GET /management/health` - Health status
- `GET /management/info` - Application info

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration (database, JWT)
│   ├── controllers/     # HTTP request handlers
│   ├── entities/        # TypeORM entity models
│   ├── middleware/      # Express middleware (auth, errors)
│   ├── routes/          # Express routes
│   ├── scripts/         # Utility scripts (seeding)
│   ├── services/        # Business logic
│   ├── app.ts          # Express app setup
│   └── index.ts        # Server entry point
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Default Users

After running `npm run seed`:

- **Admin**: admin / admin (ROLE_ADMIN, ROLE_USER)
- **User**: user / user (ROLE_USER)

## Notes

- TypeORM synchronization is enabled in development only
- JWT tokens expire after 24 hours by default
- CORS is configured for frontend at http://localhost:9000
- All API responses use JSON format
- Pagination uses query parameters: `?page=0&size=20&sort=id,asc`
