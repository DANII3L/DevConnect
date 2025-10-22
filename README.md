# DevConnect

Una plataforma para que desarrolladores compartan sus proyectos y conecten con la comunidad.

## 🚀 Proyectos

### Backend (BackDevConnect)
API REST desarrollada con Node.js y Express que maneja la autenticación y gestión de proyectos.

**Tecnologías:**
- Node.js + Express
- Supabase (Base de datos y autenticación)
- Swagger (Documentación API)

**Características:**
- Autenticación JWT
- CRUD de proyectos
- Gestión de usuarios
- API documentada

### Frontend (DevConnect)
Aplicación web desarrollada con React y TypeScript para la interfaz de usuario.

**Tecnologías:**
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase Client

**Características:**
- Autenticación de usuarios
- Lista de proyectos
- Formularios de creación/edición
- Diseño responsivo

## 📝 Variables de Entorno

### Backend
```env
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
PORT=3000
```

### Frontend
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Uso

1. Configura las variables de entorno
2. Inicia el backend: `npm start` (puerto 3000)
3. Inicia el frontend: `npm run dev` (puerto 5173)
4. Accede a la aplicación en `http://localhost:5173`

## 📚 API

La documentación de la API está disponible en `http://localhost:3000/api-docs`