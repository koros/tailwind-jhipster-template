import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import userRoutes from './routes/user.routes';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middleware/error.middleware';
import { openApiSpec } from './config/openapi.config';
import { AppDataSource } from './config/database';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:9000',
    credentials: true,
    exposedHeaders: ['X-Total-Count', 'Authorization'],
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cookie parsing (for refresh token HttpOnly cookie)
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint with basic process and DB metrics
app.get('/management/health', async (req, res) => {
  const mem = process.memoryUsage();
  const toMb = (b: number) => Math.round((b / (1024 * 1024)) * 10) / 10;

  const components: any = {
    process: {
      status: 'UP',
      details: {
        pid: process.pid,
        nodeVersion: process.version,
        uptimeMs: Math.round(process.uptime() * 1000),
        rssMb: toMb(mem.rss),
        heapUsedMb: toMb(mem.heapUsed),
        heapTotalMb: toMb(mem.heapTotal),
        externalMb: toMb(mem.external || 0),
        arrayBuffersMb: toMb((mem as any).arrayBuffers || 0),
      },
    },
  };

  // Optional DB ping if TypeORM is initialized
  let dbStatus: 'UP' | 'DOWN' | 'UNKNOWN' = 'UNKNOWN';
  try {
    const initialized = AppDataSource?.isInitialized;
    const start = Date.now();
    if (initialized) {
      await AppDataSource.query('SELECT 1');
      const pingMs = Date.now() - start;
      dbStatus = 'UP';
      let host: string | undefined;
      let port: number | string | undefined;
      let database: string | undefined;
      const type: string | undefined = (AppDataSource.options as any)?.type;
      const url: string | undefined = (AppDataSource.options as any)?.url;
      try {
        if (url) {
          const u = new URL(url);
          host = u.hostname;
          port = u.port;
          database = u.pathname?.replace(/^\//, '') || undefined;
        }
      } catch {}
      components.db = { status: 'UP', details: { initialized, pingMs, type, host, port, database } };
    } else {
      dbStatus = 'DOWN';
      components.db = { status: 'DOWN', details: { initialized: false, error: 'DataSource not initialized' } };
    }
  } catch (e: any) {
    dbStatus = 'DOWN';
    components.db = { status: 'DOWN', details: { error: e?.message || 'DB ping failed' } };
  }

  const statuses = Object.values(components).map((c: any) => c.status);
  const overall = statuses.every(s => s === 'UP') ? 'UP' : 'DOWN';

  res.json({ status: overall, components });
});

app.get('/management/info', (req, res) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  res.json({
    app: {
      name: 'my-tailwind-jhipster',
      version: '1.0.0',
      description: 'JHipster application with Node.js backend',
    },
    activeProfiles: isDevelopment ? ['dev', 'api-docs'] : ['prod'],
    'display-ribbon-on-profiles': isDevelopment ? 'dev' : '',
  });
});

// OpenAPI documentation endpoint
app.get('/v3/api-docs', (req, res) => {
  res.json(openApiSpec);
});

// OpenAPI documentation endpoint with group parameter
app.get('/v3/api-docs/:group', (req, res) => {
  // For now, return the same spec regardless of group
  // In the future, you could have different specs for different groups
  res.json(openApiSpec);
});

// JHipster OpenAPI groups endpoint for Swagger UI
app.get('/management/jhiopenapigroups', (req, res) => {
  res.json([
    {
      group: 'default',
      description: 'default',
    },
  ]);
});

// API routes
app.use('/api', authRoutes);
app.use('/api', accountRoutes);
app.use('/api/admin', userRoutes);
app.use('/api', todoRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
