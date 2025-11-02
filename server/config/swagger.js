const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Manager API',
      version: '1.0.0',
      description: 'A REST API for user management with JWT authentication, built with Express.js and MongoDB'
    },
    servers: [
      {
        url: 'http://localhost:5000/',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID (MongoDB ObjectId)',
              example: '507f1f77bcf86cd799439011',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (unique)',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (min 6 characters, hashed)',
              example: 'password123',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role',
              example: 'user',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
              example: '555-1234',
            },
            address: {
              type: 'string',
              description: 'User street address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              description: 'User city',
              example: 'New York',
            },
            state: {
              type: 'string',
              description: 'User state',
              example: 'NY',
            },
            zipCode: {
              type: 'string',
              description: 'User ZIP code',
              example: '10001',
            },
            joinDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date user joined',
              example: '2024-01-15T10:30:00Z',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              default: 'active',
              description: 'User status',
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was last updated',
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            role: { type: 'string', example: 'user' },
            phone: { type: 'string', example: '555-1234' },
            address: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'New York' },
            state: { type: 'string', example: 'NY' },
            zipCode: { type: 'string', example: '10001' },
            joinDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Audit log ID',
              example: '507f1f77bcf86cd799439011',
            },
            action: {
              type: 'string',
              enum: ['CREATE', 'UPDATE', 'DELETE'],
              description: 'Action performed',
              example: 'CREATE',
            },
            entityType: {
              type: 'string',
              default: 'USER',
              description: 'Type of entity',
              example: 'USER',
            },
            entityId: {
              type: 'string',
              description: 'ID of the affected entity',
              example: '507f1f77bcf86cd799439011',
            },
            details: {
              type: 'object',
              description: 'Additional details about the action',
            },
            userEmail: {
              type: 'string',
              description: 'Email of user who performed the action',
              example: 'admin@example.com',
            },
            userName: {
              type: 'string',
              description: 'Name of user who performed the action',
              example: 'Admin User',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the action occurred',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            phone: { type: 'string', example: '555-1234' },
            address: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'New York' },
            state: { type: 'string', example: 'NY' },
            zipCode: { type: 'string', example: '10001' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/UserResponse' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error information' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and user account management endpoints',
      },
      {
        name: 'Users',
        description: 'User management operations (CRUD)',
      },
      {
        name: 'Audit',
        description: 'Audit log operations for tracking changes',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
