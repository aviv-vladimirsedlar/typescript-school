import { useSelector } from "react-redux";

import { RootState } from "../../../config/store";

export const useAuth = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });

  return { isAuthenticated, user };
};
