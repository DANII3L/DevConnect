import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAdminUserEdit } from "../hooks/useAdminUserEdit";
import { Loader2, ArrowLeft, Trash2, Shield, Save, X as XIcon } from "lucide-react";
import { ProfileFormFields } from "../components/Profile/ProfileFormFields";

export function AdminUserEdit() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar que el usuario actual es admin
  if (user?.role !== "admin") {
    navigate("/profile");
    return null;
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">ID de usuario no proporcionado</p>
        </div>
      </div>
    );
  }

  const {
    userData,
    loading,
    saving,
    message,
    fullName,
    setFullName,
    username,
    setUsername,
    bio,
    setBio,
    avatarUrl,
    setAvatarUrl,
    website,
    setWebsite,
    githubUrl,
    setGithubUrl,
    linkedinUrl,
    setLinkedinUrl,
    role,
    setRole,
    handleUpdate,
    handleDelete,
  } = useAdminUserEdit({ userId });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Usuario no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/community")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al panel de administración
        </button>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Editar Usuario</h2>
          </div>

          <form onSubmit={async (e) => {
            const success = await handleUpdate(e);
            if (success) {
              setTimeout(() => navigate("/community"), 1500);
            }
          }} className="space-y-6">
            {/* Usar el componente reutilizable de formulario de perfil */}
            <ProfileFormFields
              fullName={fullName}
              username={username}
              bio={bio}
              avatarUrl={avatarUrl}
              website={website}
              githubUrl={githubUrl}
              linkedinUrl={linkedinUrl}
              email={userData?.email}
              role={role}
              showRoleSelector={true}
              setFullName={setFullName}
              setUsername={setUsername}
              setBio={setBio}
              setAvatarUrl={setAvatarUrl}
              setWebsite={setWebsite}
              setGithubUrl={setGithubUrl}
              setLinkedinUrl={setLinkedinUrl}
              setRole={setRole}
              isEditing={true}
              showEmail={true}
            />

            {/* Botones de acción */}
            <div className="flex gap-3 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => navigate("/community")}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XIcon className="w-5 h-5" />
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar cambios</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const success = await handleDelete();
                  if (success) {
                    setTimeout(() => navigate("/community"), 1500);
                  }
                }}
                disabled={saving}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            </div>

            {/* Mensaje de estado */}
            {message && (
              <div
                className={`text-center py-3 px-4 rounded-lg mt-4 ${
                  message.includes("Error")
                    ? "bg-red-500/10 border border-red-500/50 text-red-400"
                    : "bg-green-500/10 border border-green-500/50 text-green-400"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}