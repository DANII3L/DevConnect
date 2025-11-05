import {
  User as UserIcon,
  Mail,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";

export interface ProfileFormFieldsProps {
  // Valores
  fullName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  website: string;
  githubUrl: string;
  linkedinUrl: string;
  email?: string;
  role?: "user" | "admin";
  showRoleSelector?: boolean;
  
  // Setters
  setFullName: (value: string) => void;
  setUsername: (value: string) => void;
  setBio: (value: string) => void;
  setAvatarUrl: (value: string) => void;
  setWebsite: (value: string) => void;
  setGithubUrl: (value: string) => void;
  setLinkedinUrl: (value: string) => void;
  setRole?: (value: "user" | "admin") => void;
  
  // Modo edición
  isEditing?: boolean;
  
  // Email (solo lectura)
  showEmail?: boolean;
}

export function ProfileFormFields({
  fullName,
  username,
  bio,
  avatarUrl,
  website,
  githubUrl,
  linkedinUrl,
  email,
  role,
  showRoleSelector = false,
  setFullName,
  setUsername,
  setBio,
  setAvatarUrl,
  setWebsite,
  setGithubUrl,
  setLinkedinUrl,
  setRole,
  isEditing = true,
  showEmail = false,
}: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Sección: Información Personal */}
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-700">
          Información Personal
        </h3>

        {/* Email (solo lectura) */}
        {showEmail && (
          <div>
            <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
              <Mail className="w-4 h-4" />
              Correo Electrónico
            </label>
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {email || "No disponible"}
            </div>
            <p className="text-slate-500 text-xs mt-1">
              El email no se puede modificar
            </p>
          </div>
        )}

        {/* Nombre completo */}
        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Nombre completo
          </label>
          {isEditing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {fullName || "No especificado"}
            </div>
          )}
        </div>

        {/* Usuario */}
        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Nombre de usuario
          </label>
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {username ? `@${username}` : "No especificado"}
            </div>
          )}
        </div>

        {/* Biografía */}
        <div>
          <label className="block text-slate-300 mb-2 font-medium">
            Biografía
          </label>
          {isEditing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Cuéntanos sobre ti..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-slate-500 text-xs mt-1">
                {bio.length} caracteres
              </p>
            </>
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300 min-h-[100px]">
              {bio || "No has agregado una biografía aún"}
            </div>
          )}
        </div>
      </div>

      {/* Sección: Enlaces y Contacto */}
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-700">
          Enlaces y Contacto
        </h3>

        {/* Sitio web */}
        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
            <Globe className="w-4 h-4" />
            Sitio web
          </label>
          {isEditing ? (
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tusitio.com"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {website}
                </a>
              ) : (
                "No especificado"
              )}
            </div>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
            <Github className="w-4 h-4" />
            GitHub
          </label>
          {isEditing ? (
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/tu_usuario"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {githubUrl}
                </a>
              ) : (
                "No especificado"
              )}
            </div>
          )}
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </label>
          {isEditing ? (
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/tu_perfil"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300">
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {linkedinUrl}
                </a>
              ) : (
                "No especificado"
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección: Configuración de Perfil (solo en modo edición) */}
      {isEditing && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-700">
            Configuración de Perfil
          </h3>

          {/* Avatar URL */}
          <div>
            <label className="block text-slate-300 mb-2 font-medium">
              Foto de perfil (URL)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://ejemplo.com/foto.jpg"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {avatarUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt="avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-600 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-slate-400 text-sm">Vista previa</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selector de Rol (solo para admin editando usuarios) */}
      {showRoleSelector && isEditing && setRole && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-700">
            Permisos
          </h3>
          <div>
            <label className="block text-slate-300 mb-2 font-medium">
              Rol del usuario
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value as "user" | "admin")}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <UserIcon className="w-4 h-4 text-blue-400" />
                <span className="text-white">Usuario</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value as "user" | "admin")}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-white">Administrador</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

