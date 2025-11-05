import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Code2, Rocket, Users, Sparkles, ArrowRight, Terminal, Zap } from "lucide-react";

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">
                Comparte tus proyectos con la comunidad
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Conecta. Comparte.
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Inspira.
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              La plataforma donde los desarrolladores comparten sus proyectos,
              colaboran y encuentran inspiración en la comunidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link
                    to="/projects"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    Explorar Proyectos
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white rounded-lg font-semibold text-lg transition-all duration-200"
                  >
                    <Rocket className="w-5 h-5" />
                    Crear Proyecto
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Por qué elegir Dev Connect?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Una plataforma diseñada para desarrolladores que quieren compartir
              su trabajo y conectarse con otros creadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Comparte tus Proyectos
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Muestra tus mejores trabajos al mundo. Comparte código, demos y
                experiencias con una comunidad apasionada por el desarrollo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Conecta con Desarrolladores
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Descubre proyectos increíbles, conoce a otros desarrolladores y
                encuentra inspiración para tu próximo proyecto.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Feedback y Colaboración
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Recibe comentarios constructivos, colabora en proyectos y
                aprende de las mejores prácticas de la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/30 text-center">
            <Terminal className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para compartir tu próximo proyecto?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de desarrolladores que ya están compartiendo sus
              proyectos increíbles en Dev Connect.
            </p>
            {!user && (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            {user && (
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Ir a Proyectos
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

