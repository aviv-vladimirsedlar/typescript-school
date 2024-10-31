import { useSelector } from 'react-redux';

import { RootState } from '../../config/store';

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth.isAuthenticated);
};
