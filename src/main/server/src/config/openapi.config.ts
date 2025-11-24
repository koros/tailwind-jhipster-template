export const openApiSpec = {
  openapi: '3.0.1',
  info: {
    title: 'My Tailwind Jhipster API',
    description: 'JHipster application with Node.js backend',
    version: '1.0.0',
    contact: {},
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'authentication', description: 'Authentication endpoints' },
    { name: 'account', description: 'Account management endpoints' },
    { name: 'user-management', description: 'User administration endpoints' },
    { name: 'todo', description: 'Todo CRUD operations' },
  ],
  paths: {
    '/api/authenticate': {
      post: {
        tags: ['authentication'],
        summary: 'Authenticate user',
        operationId: 'authenticate',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  rememberMe: { type: 'boolean' },
                },
                required: ['username', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id_token: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/account': {
      get: {
        tags: ['account'],
        summary: 'Get current user account',
        operationId: 'getAccount',
        security: [{ bearer: [] }],
        responses: {
          '200': {
            description: 'User account details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
      post: {
        tags: ['account'],
        summary: 'Update user account',
        operationId: 'updateAccount',
        security: [{ bearer: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        responses: {
          '200': { description: 'Account updated successfully' },
        },
      },
    },
    '/api/todos': {
      get: {
        tags: ['todo'],
        summary: 'Get all todos',
        operationId: 'getTodos',
        security: [{ bearer: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'size', in: 'query', schema: { type: 'integer' } },
          { name: 'sort', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of todos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Todo' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['todo'],
        summary: 'Create a new todo',
        operationId: 'createTodo',
        security: [{ bearer: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Todo' },
            },
          },
        },
        responses: {
          '201': { description: 'Todo created' },
        },
      },
    },
    '/api/todos/{id}': {
      get: {
        tags: ['todo'],
        summary: 'Get todo by ID',
        operationId: 'getTodo',
        security: [{ bearer: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'Todo details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Todo' },
              },
            },
          },
        },
      },
      put: {
        tags: ['todo'],
        summary: 'Update a todo',
        operationId: 'updateTodo',
        security: [{ bearer: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Todo' },
            },
          },
        },
        responses: {
          '200': { description: 'Todo updated' },
        },
      },
      delete: {
        tags: ['todo'],
        summary: 'Delete a todo',
        operationId: 'deleteTodo',
        security: [{ bearer: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Todo deleted' },
        },
      },
    },
    '/api/admin/users': {
      get: {
        tags: ['user-management'],
        summary: 'Get all users',
        operationId: 'getUsers',
        security: [{ bearer: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'size', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          login: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          activated: { type: 'boolean' },
          langKey: { type: 'string' },
          imageUrl: { type: 'string' },
          authorities: { type: 'string' },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          dueDate: { type: 'string', format: 'date-time' },
          completed: { type: 'boolean' },
          createdDate: { type: 'string', format: 'date-time' },
          lastModifiedDate: { type: 'string', format: 'date-time' },
        },
      },
    },
    securitySchemes: {
      bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
