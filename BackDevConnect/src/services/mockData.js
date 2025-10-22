// BackDevConnect/src/services/mockData.js
// Datos de ejemplo para cuando Supabase no esté configurado

const mockProjects = [
    {
        id: "1",
        title: "E-commerce Platform",
        description: "Plataforma de comercio electrónico desarrollada con React y Node.js",
        demo_url: "https://demo-ecommerce.com",
        github_url: "https://github.com/usuario/ecommerce",
        tech_stack: ["React", "Node.js", "MongoDB", "Stripe"],
        image_url: "https://via.placeholder.com/400x300",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-20T14:45:00Z",
        profiles: {
            id: "user-1",
            full_name: "Daniel M",
            username: "danielm",
            avatar_url: "https://via.placeholder.com/50x50"
        }
    },
    {
        id: "2",
        title: "Task Manager App",
        description: "Aplicación para gestión de tareas con Vue.js y Express",
        demo_url: "https://taskmanager-demo.com",
        github_url: "https://github.com/usuario/taskmanager",
        tech_stack: ["Vue.js", "Express", "SQLite", "JWT"],
        image_url: "https://via.placeholder.com/400x300",
        created_at: "2024-01-10T09:15:00Z",
        updated_at: "2024-01-18T16:20:00Z",
        profiles: {
            id: "user-2",
            full_name: "María García",
            username: "mariag",
            avatar_url: "https://via.placeholder.com/50x50"
        }
    },
    {
        id: "3",
        title: "Weather Dashboard",
        description: "Dashboard del clima con datos en tiempo real usando APIs externas",
        demo_url: "https://weather-dashboard.com",
        github_url: "https://github.com/usuario/weather-dashboard",
        tech_stack: ["React", "TypeScript", "Chart.js", "OpenWeather API"],
        image_url: "https://via.placeholder.com/400x300",
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-01-12T13:30:00Z",
        profiles: {
            id: "user-3",
            full_name: "Carlos López",
            username: "carlosl",
            avatar_url: "https://via.placeholder.com/50x50"
        }
    }
];

const mockUsers = [
    {
        id: "user-1",
        full_name: "Daniel M",
        username: "danielm",
        avatar_url: "https://via.placeholder.com/50x50",
        website: "https://danielm.dev",
        bio: "Desarrollador Full Stack apasionado por crear soluciones innovadoras",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-20T14:45:00Z"
    },
    {
        id: "user-2",
        full_name: "María García",
        username: "mariag",
        avatar_url: "https://via.placeholder.com/50x50",
        website: "https://mariag.dev",
        bio: "Frontend Developer especializada en React y Vue.js",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-18T16:20:00Z"
    },
    {
        id: "user-3",
        full_name: "Carlos López",
        username: "carlosl",
        avatar_url: "https://via.placeholder.com/50x50",
        website: "https://carlosl.dev",
        bio: "Backend Developer con experiencia en Node.js y Python",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-12T13:30:00Z"
    }
];

module.exports = {
    mockProjects,
    mockUsers
};
