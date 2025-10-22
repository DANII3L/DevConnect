import { Code2, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Dev Connect</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Una plataforma para que desarrolladores compartan sus proyectos increíbles con la comunidad.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Enlaces</h3>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Sobre nosotros
              </a>
              <a 
                href="#" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Contacto
              </a>
              <a 
                href="#" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Términos de servicio
              </a>
              <a 
                href="#" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Política de privacidad
              </a>
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Síguenos</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Dev Connect. Todos los derechos reservados.
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-red-500" /> para la comunidad.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
