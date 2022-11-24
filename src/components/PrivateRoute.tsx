import { ReactNode } from 'react';
import { useStore } from '../store';

import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  if (!currentUser)
    return (
      <Navigate
        to={`/sign-in?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
      />
    );

  return <>{children}</>;
};

export default PrivateRoute;
