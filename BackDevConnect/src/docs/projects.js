/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - tech_stack
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del proyecto
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           description: Título del proyecto
 *           minLength: 3
 *           maxLength: 100
 *           example: "E-commerce con React"
 *         description:
 *           type: string
 *           description: Descripción detallada del proyecto
 *           minLength: 10
 *           maxLength: 1000
 *           example: "Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL"
 *         demo_url:
 *           type: string
 *           format: uri
 *           description: URL del demo en vivo
 *           example: "https://mi-proyecto-demo.vercel.app"
 *         github_url:
 *           type: string
 *           format: uri
 *           description: URL del repositorio en GitHub
 *           example: "https://github.com/usuario/mi-proyecto"
 *         tech_stack:
 *           type: array
 *           items:
 *             type: string
 *           description: Tecnologías utilizadas en el proyecto
 *           example: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"]
 *         image_url:
 *           type: string
 *           format: uri
 *           description: URL de la imagen del proyecto
 *           example: "https://ejemplo.com/imagen-proyecto.jpg"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-15T10:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2024-01-20T14:45:00Z"
 *         author_id:
 *           type: string
 *           format: uuid
 *           description: ID del autor del proyecto
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     ProjectCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - tech_stack
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "E-commerce con React"
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL"
 *         demo_url:
 *           type: string
 *           format: uri
 *           example: "https://mi-proyecto-demo.vercel.app"
 *         github_url:
 *           type: string
 *           format: uri
 *           example: "https://github.com/usuario/mi-proyecto"
 *         tech_stack:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"]
 *         image_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/imagen-proyecto.jpg"
 * 
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "E-commerce con React - Actualizado"
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "Plataforma de comercio electrónico mejorada con nuevas funcionalidades"
 *         demo_url:
 *           type: string
 *           format: uri
 *           example: "https://mi-proyecto-demo-v2.vercel.app"
 *         github_url:
 *           type: string
 *           format: uri
 *           example: "https://github.com/usuario/mi-proyecto-v2"
 *         tech_stack:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Redis"]
 *         image_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/imagen-proyecto-v2.jpg"
 * 
 *     ProjectListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         total:
 *           type: integer
 *           description: Número total de proyectos
 *           example: 25
 *         proyectos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total_pages:
 *               type: integer
 *               example: 3
 * 
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         proyecto:
 *           $ref: '#/components/schemas/Project'
 * 
 *     ProjectError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Mensaje de error específico
 *           example: "El proyecto con ID 123 no fue encontrado"
 *         details:
 *           type: object
 *           description: Detalles adicionales del error
 *           properties:
 *             code:
 *               type: string
 *               example: "PROJECT_NOT_FOUND"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Proyectos
 *     description: Operaciones relacionadas con la gestión de proyectos
 */

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Obtener todos los proyectos
 *     description: Retorna una lista paginada de todos los proyectos registrados en la plataforma
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de proyectos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar proyectos
 *       - in: query
 *         name: tech
 *         schema:
 *           type: string
 *         description: Filtrar por tecnología específica
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 *             example:
 *               success: true
 *               total: 25
 *               proyectos:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   title: "E-commerce con React"
 *                   description: "Plataforma de comercio electrónico desarrollada con React"
 *                   demo_url: "https://mi-proyecto-demo.vercel.app"
 *                   github_url: "https://github.com/usuario/mi-proyecto"
 *                   tech_stack: ["React", "Node.js", "PostgreSQL"]
 *                   created_at: "2024-01-15T10:30:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total_pages: 3
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *             example:
 *               success: false
 *               error: "Parámetros de paginación inválidos"
 *               details:
 *                 code: "INVALID_PAGINATION"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *             example:
 *               success: false
 *               error: "Error interno del servidor"
 *               details:
 *                 code: "INTERNAL_SERVER_ERROR"
 * 
 *   post:
 *     summary: Crear un nuevo proyecto
 *     description: Crea un nuevo proyecto en la plataforma. Requiere autenticación.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreate'
 *           example:
 *             title: "Mi Nuevo Proyecto"
 *             description: "Descripción detallada de mi proyecto increíble"
 *             demo_url: "https://mi-proyecto-demo.vercel.app"
 *             github_url: "https://github.com/usuario/mi-proyecto"
 *             tech_stack: ["React", "Node.js", "PostgreSQL"]
 *             image_url: "https://ejemplo.com/imagen.jpg"
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *             example:
 *               success: false
 *               error: "Los datos del proyecto son inválidos"
 *               details:
 *                 code: "VALIDATION_ERROR"
 *                 fields:
 *                   title: "El título es requerido"
 *                   tech_stack: "Debe incluir al menos una tecnología"
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *             example:
 *               success: false
 *               error: "Token de autenticación requerido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 */

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     description: Retorna los detalles de un proyecto específico por su ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del proyecto
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Proyecto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *             example:
 *               success: true
 *               proyecto:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 title: "E-commerce con React"
 *                 description: "Plataforma de comercio electrónico desarrollada con React"
 *                 demo_url: "https://mi-proyecto-demo.vercel.app"
 *                 github_url: "https://github.com/usuario/mi-proyecto"
 *                 tech_stack: ["React", "Node.js", "PostgreSQL"]
 *                 created_at: "2024-01-15T10:30:00Z"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *             example:
 *               success: false
 *               error: "El proyecto con ID 123e4567-e89b-12d3-a456-426614174000 no fue encontrado"
 *               details:
 *                 code: "PROJECT_NOT_FOUND"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 * 
 *   put:
 *     summary: Actualizar proyecto
 *     description: Actualiza un proyecto existente. Requiere autenticación y permisos de autor.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *       403:
 *         description: Sin permisos para actualizar este proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 * 
 *   delete:
 *     summary: Eliminar proyecto
 *     description: Elimina un proyecto. Requiere autenticación y permisos de autor.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyecto eliminado exitosamente"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *       403:
 *         description: Sin permisos para eliminar este proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectError'
 */
