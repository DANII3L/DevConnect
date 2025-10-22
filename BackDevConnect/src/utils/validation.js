const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`${fieldName} es requerido`);
    }
    return true;
  },

  array: (value, fieldName) => {
    if (!Array.isArray(value)) {
      throw new Error(`${fieldName} debe ser un array`);
    }
    return true;
  },

  url: (url, fieldName) => {
    if (url && !/^https?:\/\/.+/.test(url)) {
      throw new Error(`${fieldName} debe ser una URL válida`);
    }
    return true;
  }
};

module.exports = validation;
