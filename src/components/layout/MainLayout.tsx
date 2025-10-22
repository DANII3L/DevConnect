import { ReactNode } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface MainLayoutProps {
  children: ReactNode;
  onNewProject?: () => void;
}

export function MainLayout({ children, onNewProject }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Navbar onNewProject={onNewProject ?? (() => { console.log('No new project') })} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
