const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const profileRoutes = require('./routes/profiles');
const swaggerSpecs = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./utils/errors');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BackDevConnect API Documentation'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling
app.use('*', notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BackDevConnect running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}`);
    console.log(`🔍 Docs: http://localhost:${PORT}/api-docs`);
});
