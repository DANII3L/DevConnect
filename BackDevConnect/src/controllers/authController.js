const AuthService = require('../services/authService');
const response = require('../utils/response');
const validation = require('../utils/validation');

class AuthController {
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

    static async refreshToken(req, res) {
        const { refresh_token } = req.body;
        const result = await AuthService.refreshToken(refresh_token);
        
        if (result.success) {
            res.json({
                success: true,
                session: result.session
            });
        } else {
            const statusCode = result.error.includes('requerido') ? 400 : 
                             result.error.includes('inválido') ? 401 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
    }
}

module.exports = AuthController;
