const AuthService = require('../services/authService');
const response = require('../utils/response');
const validation = require('../utils/validation');

class AuthController {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     tags: [Autenticación]
     *     summary: Registrar nuevo usuario
     *     description: Crea una nueva cuenta de usuario en el sistema
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [full_name, username, email, password]
     *             properties:
     *               full_name:
     *                 type: string
     *                 minLength: 2
     *                 maxLength: 100
     *                 example: "Juan Pérez"
     *               username:
     *                 type: string
     *                 minLength: 3
     *                 maxLength: 30
     *                 pattern: "^[a-zA-Z0-9_]+$"
     *                 example: "juanperez"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "juan@example.com"
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 format: password
     *                 example: "miPassword123"
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       409:
     *         $ref: '#/components/responses/Conflict'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async register(req, res) {
        try {
            const { email, password, full_name, username } = req.body;
            
            validation.required(email, 'Email');
            validation.required(password, 'Contraseña');
            validation.email(email);
            validation.password(password);

            const result = await AuthService.signUp(req.body);
            
            if (result.success) {
                res.status(201).json(response.success(result.user, 'Usuario registrado exitosamente'));
            } else {
                const statusCode = result.error.includes('ya está registrado') ? 409 : 
                                 result.error.includes('requeridos') ? 400 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     tags: [Autenticación]
     *     summary: Iniciar sesión
     *     description: Autentica un usuario y devuelve un token de acceso
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "juan@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "miPassword123"
     *     responses:
     *       200:
     *         description: Login exitoso
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *                     session:
     *                       type: object
     *                       properties:
     *                         access_token:
     *                           type: string
     *                         refresh_token:
     *                           type: string
     *                         expires_at:
     *                           type: string
     *                           format: date-time
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         description: Credenciales inválidas
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            validation.required(email, 'Email');
            validation.required(password, 'Contraseña');

            const result = await AuthService.signIn(req.body);
            
            if (result.success) {
                res.json(response.success({
                    user: result.user,
                    session: result.session
                }, 'Login exitoso'));
            } else {
                const statusCode = result.error.includes('Credenciales') ? 401 : 
                                 result.error.includes('requeridos') ? 400 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }

    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     tags: [Autenticación]
     *     summary: Cerrar sesión
     *     description: Cierra la sesión del usuario actual
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Sesión cerrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async logout(req, res) {
        const result = await AuthService.signOut();
        
        if (result.success) {
            res.json({
                success: true,
                message: result.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     tags: [Autenticación]
     *     summary: Obtener usuario actual
     *     description: Devuelve la información del usuario autenticado
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Información del usuario
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async getCurrentUser(req, res) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const result = await AuthService.getCurrentUser(token);
        
        if (result.success) {
            res.json({
                success: true,
                user: result.user
            });
        } else {
            const statusCode = result.error.includes('requerido') || result.error.includes('inválido') ? 401 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }

    /**
     * @swagger
     * /api/auth/refresh:
     *   post:
     *     tags: [Autenticación]
     *     summary: Renovar token de acceso
     *     description: Renueva el token de acceso usando el refresh token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [refresh_token]
     *             properties:
     *               refresh_token:
     *                 type: string
     *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *     responses:
     *       200:
     *         description: Token renovado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/BaseResponse'
     *                 - type: object
     *                   properties:
     *                     session:
     *                       type: object
     *                       properties:
     *                         access_token:
     *                           type: string
     *                         refresh_token:
     *                           type: string
     *                         expires_at:
     *                           type: string
     *                           format: date-time
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         description: Refresh token inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    static async refreshToken(req, res) {
        try {
            const { refresh_token } = req.body;
            
            validation.required(refresh_token, 'Refresh token');

            const result = await AuthService.refreshToken(refresh_token);
            
            if (result.success) {
                res.json(response.success(result.session, 'Token renovado exitosamente'));
            } else {
                const statusCode = result.error.includes('inválido') ? 401 : 500;
                res.status(statusCode).json(response.error(result.error, statusCode));
            }
        } catch (error) {
            res.status(400).json(response.validation([error.message]));
        }
    }

}

module.exports = AuthController;