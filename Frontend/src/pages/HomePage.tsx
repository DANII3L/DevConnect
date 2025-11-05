import { ProjectList } from "../components/Project/ProjectList";
import { useNewProjectForm } from "../hooks/useNewProjectForm";

export function HomePage() {
  const { showForm, setShowForm } = useNewProjectForm();

  return (
    <ProjectList showForm={showForm} onCloseForm={() => setShowForm(false)} />
  );
}
