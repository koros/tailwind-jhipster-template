# Token Refresh & Migration Implementation

## Overview

Successfully implemented automatic JWT token refresh mechanism and proper TypeORM migrations for production-ready deployments.

## Backend Changes

### 1. Database Migrations Setup

- **Created** `src/main/server/src/config/migration-data-source.ts` - Separate DataSource for migrations CLI
- **Updated** `src/main/server/src/config/database.ts`:
  - Disabled `synchronize` (was dangerous in production)
  - Enabled `migrationsRun: true` for automatic migration execution
  - Pointed to compiled migrations in `dist/migrations/**/*.js`
- **Added migration scripts** to `package.json`:
  - `migration:generate` - Generate migrations from entity changes
  - `migration:create` - Create empty migration file
  - `migration:run` - Execute pending migrations
  - `migration:revert` - Rollback last migration
  - `migration:show` - Show migration status
- **Generated** `InitialSchema` migration capturing current database state

### 2. JWT Token Refresh System

**Configuration** (`src/main/server/src/config/jwt.ts`):

- Access token: 15 minutes (down from 24 hours)
- Refresh token: 7 days (new)
- Separate secrets for access and refresh tokens

**Database** (`src/main/server/src/entities/User.ts`):

- Added `refreshToken` field (text, nullable) to store active refresh tokens

**Auth Service** (`src/main/server/src/services/auth.service.ts`):

- `login()` now returns both `id_token` and `refresh_token`
- New `refreshAccessToken()` method validates refresh token and issues new access token
- New `logout()` method invalidates refresh token in database
- Refresh tokens are validated against database (prevents token reuse after logout)

**Auth Controller** (`src/main/server/src/controllers/auth.controller.ts`):

- Added `refreshToken` endpoint handler
- Added `logout` endpoint handler

**Routes** (`src/main/server/src/routes/auth.routes.ts`):

- `POST /api/refresh-token` - Exchange refresh token for new access token
- `POST /api/logout` - Invalidate refresh token

## Frontend Changes

### 3. Axios Interceptor with Automatic Refresh

**Updated** `src/main/webapp/app/config/axios-interceptor.ts`:

**Features**:

- Automatically detects 401 errors from expired access tokens
- Calls `/api/refresh-token` endpoint with stored refresh token
- Queues failed requests during token refresh (prevents race conditions)
- Retries original request with new access token
- Falls back to logout if refresh token is invalid/expired

**Flow**:

1. API request fails with 401
2. Interceptor checks if refresh is already in progress
3. If yes: queues the request
4. If no: starts refresh process
5. Gets new access token from refresh endpoint
6. Updates stored token
7. Retries original request
8. Processes queued requests

### 4. Authentication State Management

**Updated** `src/main/webapp/app/shared/reducers/authentication.ts`:

- Added `REFRESH_TOKEN_KEY` constant
- `login()` stores both access and refresh tokens
- `clearAuthToken()` clears both tokens
- Respects `rememberMe` flag for localStorage vs sessionStorage

## Environment Variables

Add to `server/.env`:

```bash
JWT_EXPIRATION=900                    # 15 minutes
JWT_REFRESH_EXPIRATION=604800         # 7 days
JWT_REFRESH_SECRET=your-secure-refresh-secret-change-in-production
```

## API Response Changes

### Login Response (POST /api/authenticate)

**Before**:

```json
{
  "id_token": "eyJhbGc..."
}
```

**After**:

```json
{
  "id_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

## How It Works

### Normal Operation

1. User logs in → receives access token (15min) + refresh token (7 days)
2. Both tokens stored in browser storage
3. Access token sent with every API request
4. After 15 minutes, access token expires

### Token Refresh Flow

1. API request returns 401 Unauthorized
2. Axios interceptor intercepts the error
3. Sends refresh token to `/api/refresh-token`
4. Backend validates refresh token against database
5. Issues new access token
6. Updates token in storage
7. Retries original failed request
8. User experiences no interruption

### Logout Flow

1. User clicks logout
2. Frontend calls `POST /api/logout` with access token
3. Backend nullifies refresh token in database
4. Frontend clears both tokens from storage
5. User redirected to login

## Security Benefits

1. **Short-lived access tokens** (15min) - Reduced window for token theft
2. **Database validation** - Refresh tokens checked against DB, can be revoked
3. **Logout invalidation** - Refresh token cleared from DB on logout
4. **No token in URL** - Tokens only in headers and storage
5. **Separate secrets** - Access and refresh tokens use different keys

## Migration Commands

```bash
# Show migration status
npm run migration:show

# Run pending migrations
npm run migration:run

# Rollback last migration
npm run migration:revert

# Generate migration from entity changes
npm run migration:generate src/migrations/MigrationName

# Create empty migration
npx typeorm-ts-node-commonjs migration:create src/migrations/MigrationName
```

## Testing

### Test Token Refresh

1. Login to get tokens
2. Wait 16 minutes (or manually expire access token)
3. Make any API request
4. Request should succeed automatically (token refreshed in background)

### Test Logout

1. Login
2. Logout
3. Try to use old refresh token
4. Should fail with 401

## Production Deployment

1. Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
2. Run migrations: `npm run migration:run`
3. Build backend: `npm run build`
4. Start server: `npm start`
5. Migrations will auto-run on startup (`migrationsRun: true`)

## Dependencies Added

- `ts-node` (dev) - Required for TypeORM migrations CLI

## Files Modified

- src/main/server/src/config/database.ts
- src/main/server/src/config/jwt.ts
- src/main/server/src/entities/User.ts
- src/main/server/src/services/auth.service.ts
- src/main/server/src/controllers/auth.controller.ts
- src/main/server/src/routes/auth.routes.ts
- src/main/server/package.json
- src/main/webapp/app/config/axios-interceptor.ts
- src/main/webapp/app/shared/reducers/authentication.ts

## Files Created

- src/main/server/src/config/migration-data-source.ts
- src/main/server/src/migrations/1763987331984-InitialSchema.ts
- src/main/server/src/migrations/ (directory)

## Next Steps (Optional Enhancements)

1. Add sliding window refresh (refresh token on each use)
2. Add token expiry warning to UI
3. Add refresh token rotation (new refresh token on each refresh)
4. Add device/session management (multiple refresh tokens per user)
5. Add rate limiting on refresh endpoint
6. Add monitoring/logging for token refresh events
