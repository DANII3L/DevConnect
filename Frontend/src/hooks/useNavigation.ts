import { useNavigate, useLocation } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => navigate('/');
  const goToAuth = () => navigate('/auth');
  const goToNotFound = () => navigate('/404');
  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  const isCurrentPath = (path: string) => location.pathname === path;
  const isHome = () => isCurrentPath('/');
  const isAuth = () => isCurrentPath('/auth');

  return {
    navigate,
    location,
    goToHome,
    goToAuth,
    goToNotFound,
    goBack,
    goForward,
    isCurrentPath,
    isHome,
    isAuth,
  };
}
