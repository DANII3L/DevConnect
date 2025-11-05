import { useState, useRef, useEffect } from "react";
import { Code2, User, Menu, X, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={user ? "/projects" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Dev Connect
              </h1>
              <p className="text-xs text-slate-400">
                Comparte proyectos
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Link a Proyectos */}
                <Link
                  to="/projects"
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Proyectos
                </Link>

                {/* Link a Comunidad */}
                <Link
                  to="/community"
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Comunidad
                </Link>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name || user.email}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white font-medium hidden lg:block max-w-[150px] truncate">
                      {user.full_name || user.email?.split("@")[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown Content */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm font-medium text-white truncate">
                          {user.full_name || "Usuario"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </Link>

                            <Link
                              to="/profile"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Configuración
                            </Link>
                      </div>

                      <div className="border-t border-slate-700 py-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            {user ? (
              <div className="space-y-2">
                    <Link
                      to="/projects"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Proyectos
                    </Link>
                    <Link
                      to="/community"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Comunidad
                    </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Mi Perfil
                </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Configuración
                    </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium text-center"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
