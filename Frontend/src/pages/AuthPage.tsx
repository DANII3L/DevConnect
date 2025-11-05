import { Auth } from '../components/Auth';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';

export function AuthPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Renderizar el contenido de fondo (LandingPage) detrás del modal */}
      <div className="absolute inset-0 -z-10">
        <LandingPage />
      </div>
      
      {/* Modal con overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Overlay sutil que permite ver el fondo */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        
        {/* Modal */}
        <div className="relative w-full max-w-md z-10">
          <Auth onClose={handleClose} />
        </div>
      </div>
    </>
  );
}
