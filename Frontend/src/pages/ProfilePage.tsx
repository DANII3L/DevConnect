import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Sesión del usuario actual
import { supabase } from "../services/supabaseClient"; // Cliente Supabase
import { Loader2, Save, Upload } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  // -------------------- OBTENER PERFIL --------------------
  async function fetchProfile() {
    setLoading(true);
    setError("");

    // Buscamos el perfil del usuario actual
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error al obtener perfil:", error);
      setError(error.message);
    } else if (!data) {
      // Si no existe, lo creamos vacío
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user?.id,
          username: "",
          full_name: "",
          bio: "",
          avatar_url: "",
          website: "",
          linkedin_url: "",
          github_url: "",
        },
      ]);

      if (insertError) setError(insertError.message);
      else
        setProfile({
          id: user?.id,
          username: "",
          full_name: "",
          bio: "",
          avatar_url: "",
          website: "",
          linkedin_url: "",
          github_url: "",
        });
    } else {
      setProfile(data);
    }

    setLoading(false);
  }

  // -------------------- SUBIR FOTO DE PERFIL --------------------
  async function handleAvatarUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Carpeta por usuario
      const filePath = `${user?.id}/${file.name}`;

      // Subimos al bucket “avatars”
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obtenemos la URL pública
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Actualizamos el estado y guardamos la URL
      setProfile((prev: any) => ({ ...prev, avatar_url: avatarUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploading(false);
    }
  }

  // -------------------- GUARDAR PERFIL --------------------
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Actualiza o crea el perfil
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        website: profile.website,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
      })
      .select()
      .single();

    setSaving(false);
    if (error) {
      console.error("Error al guardar perfil:", error);
      setError(error.message);
    } else {
      setProfile(data);
      alert("✅ Perfil actualizado correctamente");
    }
  }

  // -------------------- LOADING --------------------
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Cargando perfil...</span>
      </div>
    );

  // -------------------- FORMULARIO --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center p-6 text-white">
      <form
        onSubmit={handleSave}
        className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Gestión de Perfil
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* FOTO DE PERFIL */}
        <div className="flex flex-col items-center gap-3">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm">
              Sin foto
            </div>
          )}
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-cyan-400 transition">
            <Upload className="w-4 h-4" />
            {uploading ? "Subiendo..." : "Cambiar foto"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* CAMPOS DE PERFIL */}
        <div>
          <label className="block text-slate-300 mb-1">Nombre completo</label>
          <input
            type="text"
            value={profile?.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Nombre de usuario</label>
          <input
            type="text"
            value={profile?.username || ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="@usuario"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Descripción</label>
          <textarea
            value={profile?.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="Cuéntanos algo sobre ti..."
          />
        </div>

        {/* CAMPOS NUEVOS */}
        <div>
          <label className="block text-slate-300 mb-1">Sitio web</label>
          <input
            type="text"
            value={profile?.website || ""}
            onChange={(e) =>
              setProfile({ ...profile, website: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="https://tuweb.com"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">LinkedIn</label>
          <input
            type="text"
            value={profile?.linkedin_url || ""}
            onChange={(e) =>
              setProfile({ ...profile, linkedin_url: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="https://linkedin.com/in/tuusuario"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">GitHub</label>
          <input
            type="text"
            value={profile?.github_url || ""}
            onChange={(e) =>
              setProfile({ ...profile, github_url: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="https://github.com/tuusuario"
          />
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
}
