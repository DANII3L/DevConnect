import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../services/apiService";
import { Loader2 } from "lucide-react";

export function EditProfile() {
  const { user, session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Cargar el perfil actual desde tu backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) return;

      setLoading(true);
      try {
        const response = await ApiService.getProfile(session.access_token);

        if (response.success && response.data) {
          const { full_name, username, bio, avatar_url } = response.data;
          setFullName(full_name || "");
          setUsername(username || "");
          setBio(bio || "");
          setAvatarUrl(avatar_url || "");
        } else {
          setMessage("No se pudo cargar el perfil.");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setMessage("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Guardar cambios
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await ApiService.updateProfile(session.access_token, {
        full_name: fullName,
        username,
        bio,
        avatar_url: avatarUrl,
      });

      console.log("Respuesta del servidor:", response); // Para debug

      // Verifica diferentes estructuras de respuesta posibles
      if (response && (response.success || response.id || response.data)) {
        setMessage("Perfil actualizado correctamente");

        if (response.data) {
          const {
            full_name,
            username: newUsername,
            bio: newBio,
            avatar_url,
          } = response.data;
          setFullName(full_name || "");
          setUsername(newUsername || "");
          setBio(newBio || "");
          setAvatarUrl(avatar_url || "");
        }
      } else {
        setMessage("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Editar Perfil
        </h2>

        {loading && !user ? (
          <p className="text-slate-400 text-center">Cargando...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Biografía</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Foto de perfil (URL)
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/foto.jpg"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="mt-2 w-20 h-20 rounded-full object-cover border border-slate-600"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Guardar cambios"
              )}
            </button>

            {message && (
              <p className="text-center text-slate-300 mt-2">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
