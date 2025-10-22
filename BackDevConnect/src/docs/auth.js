/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: "miPassword123"
 * 
 *     AuthRegister:
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
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: "^[a-zA-Z0-9_]+$"
 *           description: Nombre de usuario único
 *           example: "juanperez"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           format: password
 *           description: Contraseña del usuario (mínimo 8 caracteres)
 *           example: "miPassword123"
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           description: Mensaje de confirmación
 *           example: "Usuario autenticado exitosamente"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             full_name:
 *               type: string
 *               example: "Juan Pérez"
 *             username:
 *               type: string
 *               example: "juanperez"
 *             email:
 *               type: string
 *               format: email
 *               example: "juan@example.com"
 *             avatar_url:
 *               type: string
 *               format: uri
 *               example: "https://ejemplo.com/avatar.jpg"
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         expires_in:
 *           type: string
 *           description: Tiempo de expiración del token
 *           example: "24h"
 * 
 *     AuthError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Mensaje de error específico
 *           example: "Credenciales inválidas"
 *         details:
 *           type: object
 *           description: Detalles adicionales del error
 *           properties:
 *             code:
 *               type: string
 *               example: "INVALID_CREDENTIALS"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00Z"
 * 
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Sesión cerrada exitosamente"
 */

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Operaciones de autenticación y gestión de sesiones
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT para acceder a endpoints protegidos
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *           example:
 *             email: "juan@example.com"
 *             password: "miPassword123"
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Usuario autenticado exitosamente"
 *               user:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 full_name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan@example.com"
 *                 avatar_url: "https://ejemplo.com/avatar.jpg"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               expires_in: "24h"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Email y contraseña son requeridos"
 *               details:
 *                 code: "MISSING_CREDENTIALS"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Credenciales inválidas"
 *               details:
 *                 code: "INVALID_CREDENTIALS"
 *       429:
 *         description: Demasiados intentos de login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Demasiados intentos de login. Intenta nuevamente en 15 minutos"
 *               details:
 *                 code: "TOO_MANY_ATTEMPTS"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 * 
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario en la plataforma
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *           example:
 *             full_name: "Juan Pérez"
 *             username: "juanperez"
 *             email: "juan@example.com"
 *             password: "miPassword123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Usuario registrado exitosamente"
 *               user:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 full_name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan@example.com"
 *                 avatar_url: null
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               expires_in: "24h"
 *       400:
 *         description: Datos de entrada inválidos o usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Los datos del usuario son inválidos"
 *               details:
 *                 code: "VALIDATION_ERROR"
 *                 validation_errors:
 *                   email: "El email ya está registrado"
 *                   username: "El username ya está en uso"
 *                   password: "La contraseña debe tener al menos 8 caracteres"
 *       409:
 *         description: Conflicto - Usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "El usuario ya existe"
 *               details:
 *                 code: "USER_ALREADY_EXISTS"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Cierra la sesión del usuario actual (invalida el token JWT)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *             example:
 *               success: true
 *               message: "Sesión cerrada exitosamente"
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Token inválido o expirado"
 *               details:
 *                 code: "INVALID_TOKEN"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 * 
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     description: Retorna la información del usuario autenticado actual
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               user:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 full_name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan@example.com"
 *                 avatar_url: "https://ejemplo.com/avatar.jpg"
 *                 website: "https://juanperez.dev"
 *                 bio: "Desarrollador Full Stack con 5 años de experiencia"
 *                 created_at: "2024-01-15T10:30:00Z"
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *             example:
 *               success: false
 *               error: "Token inválido o expirado"
 *               details:
 *                 code: "INVALID_TOKEN"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 */
