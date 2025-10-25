import { ProjectList } from "../components/Project/ProjectList";
import { MainLayout } from "../components/layout/MainLayout";
import { useState } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <MainLayout onNewProject={() => setShowForm(true)}>
      <ProjectList showForm={showForm} onCloseForm={() => setShowForm(false)} />

      <div className="text-center mt-10">
        <Link
          to="/profile"
          className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
        >
          Gestionar mi Perfil
        </Link>
      </div>
    </MainLayout>
  );
}
