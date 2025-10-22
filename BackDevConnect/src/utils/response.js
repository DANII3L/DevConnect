const response = {
  success: (data, message = 'Operación exitosa') => ({
    success: true,
    message,
    data
  }),

  error: (message, statusCode = 500) => ({
    success: false,
    error: message,
    statusCode
  }),

  validation: (errors) => ({
    success: false,
    error: 'Datos de validación inválidos',
    details: errors
  }),

  notFound: (resource = 'Recurso') => ({
    success: false,
    error: `${resource} no encontrado`
  }),

  unauthorized: (message = 'No autorizado') => ({
    success: false,
    error: message
  }),

  forbidden: (message = 'No tienes permisos para realizar esta acción') => ({
    success: false,
    error: message
  })
};

module.exports = response;
