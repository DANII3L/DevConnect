import { useAuth } from "../contexts/AuthContext";
import { useProfileForm } from "../hooks/useProfileForm";
import { ProfileFormFields } from "../components/Profile/ProfileFormFields";
import {
  User as UserIcon,
  Edit,
  Loader2,
  Save,
  X as XIcon,
} from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();
  const {
    profileData,
    loading,
    error,
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
    isEditing,
    saving,
    message,
    handleEdit,
    handleCancel,
    handleSave,
  } = useProfileForm();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-md">
          <p className="text-red-400">{error || "No se pudo cargar el perfil"}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
          {/* Header con foto de perfil grande */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 border-b border-slate-700">
            <div className="flex flex-col items-center text-center mb-6">
              {/* Foto de perfil grande */}
              <div className="relative mb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || username || "Avatar"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-4 border-slate-700 shadow-xl">
                    <UserIcon className="w-16 h-16 text-white" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg border-2 border-slate-800">
                    <Edit className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Nombre y username */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  {fullName || username || "Mi Perfil"}
                </h2>
                {username && (
                  <p className="text-slate-400 text-lg">@{username}</p>
                )}
              </div>
            </div>

            {/* Botón Editar */}
            <div className="flex justify-center">
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  <Edit className="w-5 h-5" />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6">

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Usar el componente reutilizable de formulario de perfil */}
                <ProfileFormFields
                  fullName={fullName}
                  username={username}
                  bio={bio}
                  avatarUrl={avatarUrl}
                  website={website}
                  githubUrl={githubUrl}
                  linkedinUrl={linkedinUrl}
                  email={user?.email}
                  setFullName={setFullName}
                  setUsername={setUsername}
                  setBio={setBio}
                  setAvatarUrl={setAvatarUrl}
                  setWebsite={setWebsite}
                  setGithubUrl={setGithubUrl}
                  setLinkedinUrl={setLinkedinUrl}
                  isEditing={isEditing}
                  showEmail={true}
                />

                {/* Botones de acción */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                )}

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}