/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del usuario
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         full_name:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez"
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: "juanperez"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "juan@example.com"
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: URL del avatar del usuario
 *           example: "https://ejemplo.com/avatar.jpg"
 *         website:
 *           type: string
 *           format: uri
 *           description: Sitio web personal
 *           example: "https://juanperez.dev"
 *         bio:
 *           type: string
 *           description: Biografía del usuario
 *           maxLength: 500
 *           example: "Desarrollador Full Stack con 5 años de experiencia"
 *         github_url:
 *           type: string
 *           format: uri
 *           description: URL del perfil de GitHub
 *           example: "https://github.com/juanperez"
 *         linkedin_url:
 *           type: string
 *           format: uri
 *           description: URL del perfil de LinkedIn
 *           example: "https://linkedin.com/in/juanperez"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro
 *           example: "2024-01-15T10:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2024-01-20T14:45:00Z"
 * 
 *     UserCreate:
 *       type: object
 *       required:
 *         - full_name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Juan Pérez"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: "^[a-zA-Z0-9_]+$"
 *           example: "juanperez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           format: password
 *           example: "miPassword123"
 *         avatar_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/avatar.jpg"
 *         website:
 *           type: string
 *           format: uri
 *           example: "https://juanperez.dev"
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Desarrollador Full Stack con 5 años de experiencia"
 *         github_url:
 *           type: string
 *           format: uri
 *           example: "https://github.com/juanperez"
 *         linkedin_url:
 *           type: string
 *           format: uri
 *           example: "https://linkedin.com/in/juanperez"
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Juan Carlos Pérez"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: "^[a-zA-Z0-9_]+$"
 *           example: "juancarlos"
 *         avatar_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/nuevo-avatar.jpg"
 *         website:
 *           type: string
 *           format: uri
 *           example: "https://juancarlos.dev"
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Desarrollador Full Stack Senior con 6 años de experiencia"
 *         github_url:
 *           type: string
 *           format: uri
 *           example: "https://github.com/juancarlos"
 *         linkedin_url:
 *           type: string
 *           format: uri
 *           example: "https://linkedin.com/in/juancarlos"
 * 
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         total:
 *           type: integer
 *           description: Número total de usuarios
 *           example: 50
 *         desarrolladores:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
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
 *               example: 5
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         desarrollador:
 *           $ref: '#/components/schemas/User'
 * 
 *     UserError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Mensaje de error específico
 *           example: "El usuario con ID 123 no fue encontrado"
 *         details:
 *           type: object
 *           description: Detalles adicionales del error
 *           properties:
 *             code:
 *               type: string
 *               example: "USER_NOT_FOUND"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00Z"
 *             validation_errors:
 *               type: object
 *               description: Errores de validación específicos
 */

/**
 * @swagger
 * tags:
 *   - name: Desarrolladores
 *     description: Operaciones relacionadas con la gestión de desarrolladores/usuarios
 */

/**
 * @swagger
 * /api/desarrolladores:
 *   get:
 *     summary: Obtener todos los desarrolladores
 *     description: Retorna una lista paginada de todos los desarrolladores registrados en la plataforma
 *     tags: [Desarrolladores]
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
 *         description: Número de desarrolladores por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar desarrolladores por nombre o username
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Filtrar por habilidad o tecnología específica
 *     responses:
 *       200:
 *         description: Lista de desarrolladores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             example:
 *               success: true
 *               total: 50
 *               desarrolladores:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   full_name: "Juan Pérez"
 *                   username: "juanperez"
 *                   email: "juan@example.com"
 *                   avatar_url: "https://ejemplo.com/avatar.jpg"
 *                   website: "https://juanperez.dev"
 *                   bio: "Desarrollador Full Stack con 5 años de experiencia"
 *                   created_at: "2024-01-15T10:30:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total_pages: 5
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
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
 *               $ref: '#/components/schemas/UserError'
 *             example:
 *               success: false
 *               error: "Error interno del servidor"
 *               details:
 *                 code: "INTERNAL_SERVER_ERROR"
 */

/**
 * @swagger
 * /api/desarrolladores/{id}:
 *   get:
 *     summary: Obtener desarrollador por ID
 *     description: Retorna los detalles de un desarrollador específico por su ID
 *     tags: [Desarrolladores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del desarrollador
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Desarrollador encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               desarrollador:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 full_name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan@example.com"
 *                 avatar_url: "https://ejemplo.com/avatar.jpg"
 *                 website: "https://juanperez.dev"
 *                 bio: "Desarrollador Full Stack con 5 años de experiencia"
 *                 github_url: "https://github.com/juanperez"
 *                 linkedin_url: "https://linkedin.com/in/juanperez"
 *                 created_at: "2024-01-15T10:30:00Z"
 *       404:
 *         description: Desarrollador no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *             example:
 *               success: false
 *               error: "El desarrollador con ID 123e4567-e89b-12d3-a456-426614174000 no fue encontrado"
 *               details:
 *                 code: "USER_NOT_FOUND"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 * 
 *   put:
 *     summary: Actualizar desarrollador
 *     description: Actualiza la información de un desarrollador. Requiere autenticación y permisos del usuario.
 *     tags: [Desarrolladores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del desarrollador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           example:
 *             full_name: "Juan Carlos Pérez"
 *             bio: "Desarrollador Full Stack Senior con 6 años de experiencia"
 *             website: "https://juancarlos.dev"
 *             github_url: "https://github.com/juancarlos"
 *     responses:
 *       200:
 *         description: Desarrollador actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *             example:
 *               success: false
 *               error: "Los datos del usuario son inválidos"
 *               details:
 *                 code: "VALIDATION_ERROR"
 *                 validation_errors:
 *                   username: "El username ya está en uso"
 *                   email: "El email ya está registrado"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: Sin permisos para actualizar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 * 
 *   delete:
 *     summary: Eliminar desarrollador
 *     description: Elimina un desarrollador de la plataforma. Requiere autenticación y permisos del usuario.
 *     tags: [Desarrolladores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del desarrollador
 *     responses:
 *       200:
 *         description: Desarrollador eliminado exitosamente
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
 *                   example: "Desarrollador eliminado exitosamente"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: Sin permisos para eliminar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */
