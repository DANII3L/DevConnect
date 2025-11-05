import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface UseNewProjectFormReturn {
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}

/**
 * Hook para manejar el estado del formulario de nuevo proyecto
 * Escucha eventos del Navbar y estado de navegación
 */
export function useNewProjectForm(): UseNewProjectFormReturn {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  // Leer el estado de navegación para mostrar el formulario
  useEffect(() => {
    if (location.state?.showNewProjectForm) {
      setShowForm(true);
      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Escuchar el evento personalizado para abrir el formulario desde el Navbar
  useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true);
    };

    window.addEventListener("openNewProjectForm", handleOpenForm);
    return () => {
      window.removeEventListener("openNewProjectForm", handleOpenForm);
    };
  }, []);

  return {
    showForm,
    setShowForm,
  };
}

