import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Streaver Challenge API',
      version: '1.0.0',
      description:
        'API documentation for the Streaver Challenge application, managing posts and users.',
    },
    servers: [
      {
        url: '/',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
}

export const getSwaggerSpec = (): Record<string, unknown> => {
  return swaggerJsdoc(options) as Record<string, unknown>
}
