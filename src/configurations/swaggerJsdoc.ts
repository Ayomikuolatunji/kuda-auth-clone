import swaggerJsdoc from "swagger-jsdoc"

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth API',
            version: '1.0.0',
            description: 'Authentication API Documentation',
        },
    },
    apis: ['path/to/your/routes/file.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
