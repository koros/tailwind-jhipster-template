import express, { Application } from 'express';
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

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/management/health', (req, res) => {
  res.json({ status: 'UP' });
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
