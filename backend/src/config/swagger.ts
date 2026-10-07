import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Professional Portfolio CMS REST API',
    version: '1.0.0',
    description: 'Production-ready REST API for personal portfolio website and admin content management platform.',
    contact: {
      name: 'Debkanta Dey',
      email: 'alex@alexmorgan.dev',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Admin login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@alexmorgan.dev' },
                  password: { type: 'string', example: 'AdminPassword123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully with JWT' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get currently authenticated user',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/profile': {
      get: {
        summary: 'Get public developer profile',
        tags: ['Profile'],
        responses: {
          200: { description: 'Profile data' },
        },
      },
      put: {
        summary: 'Update profile (Admin only)',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Updated profile' },
        },
      },
    },
    '/skills': {
      get: {
        summary: 'List skills',
        tags: ['Skills'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'List of skills' },
        },
      },
      post: {
        summary: 'Create skill (Admin only)',
        tags: ['Skills'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Skill created' },
        },
      },
    },
    '/projects': {
      get: {
        summary: 'List projects',
        tags: ['Projects'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'projectType', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of projects' },
        },
      },
      post: {
        summary: 'Create project (Admin only)',
        tags: ['Projects'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Project created' },
        },
      },
    },
    '/projects/slug/{slug}': {
      get: {
        summary: 'Get project case study by slug',
        tags: ['Projects'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Project details and case study' },
          404: { description: 'Project not found' },
        },
      },
    },
    '/experiences': {
      get: {
        summary: 'List work experiences',
        tags: ['Experience'],
        responses: {
          200: { description: 'List of work experiences' },
        },
      },
    },
    '/career': {
      get: {
        summary: 'List open career opportunities with apply links',
        tags: ['Career'],
        responses: {
          200: { description: 'Career opportunities' },
        },
      },
    },
    '/contact': {
      post: {
        summary: 'Submit a contact message (Public)',
        tags: ['Contact'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  subject: { type: 'string' },
                  message: { type: 'string' },
                  honeypot: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Message sent successfully' },
        },
      },
      get: {
        summary: 'Get contact messages (Admin only)',
        tags: ['Contact'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of contact messages' },
        },
      },
    },
    '/upload': {
      post: {
        summary: 'Upload an image or PDF resume (Admin only)',
        tags: ['Upload'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'File uploaded' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};
