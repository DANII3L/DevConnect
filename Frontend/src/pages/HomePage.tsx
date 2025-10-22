import { ProjectList } from '../components/Projects/ProjectList';
import { MainLayout } from '../components/layout/MainLayout';
import { useState } from 'react';

export function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <MainLayout onNewProject={() => setShowForm(true)}>
      <ProjectList showForm={showForm} onCloseForm={() => setShowForm(false)} />
    </MainLayout>
  );
}
