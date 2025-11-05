/**
 * Utilidades de validación
 * Centraliza la lógica de validación para reutilización
 */

import { VALIDATION } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida un email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('El correo electrónico es requerido');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('El formato del correo electrónico no es válido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida una contraseña
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('La contraseña es requerida');
  } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(
      `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida un nombre de usuario
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username) {
    errors.push('El nombre de usuario es requerido');
  } else {
    if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
      errors.push(
        `El nombre de usuario debe tener al menos ${VALIDATION.USERNAME_MIN_LENGTH} caracteres`
      );
    }
    if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
      errors.push(
        `El nombre de usuario no puede tener más de ${VALIDATION.USERNAME_MAX_LENGTH} caracteres`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida un formulario de autenticación
 */
export function validateAuthForm(
  email: string,
  password: string,
  username?: string,
  fullName?: string
): ValidationResult {
  const errors: string[] = [];

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (username) {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.push(...usernameValidation.errors);
    }
  }

  if (fullName && fullName.trim().length < 2) {
    errors.push('El nombre completo debe tener al menos 2 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida un formulario de proyecto
 */
export function validateProjectForm(
  title: string,
  description: string,
  techStack: string[]
): ValidationResult {
  const errors: string[] = [];

  if (!title || title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }

  if (!description || description.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  if (!techStack || techStack.length === 0) {
    errors.push('Debes agregar al menos una tecnología');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida una URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

