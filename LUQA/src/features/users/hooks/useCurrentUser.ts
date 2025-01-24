import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../config/store";
import { loginSuccess } from "../../auth/auth.slice";
import { getCurrentUser } from "../users.api";

export const useCurrentUser = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const isAdmin = useMemo(
    () =>
      currentUser?.roles?.some((userRole) => userRole.role.name === "admin"),
    [currentUser]
  );
  const isAuthor = useMemo(
    () =>
      currentUser?.roles?.some((userRole) => userRole.role.name === "author"),
    [currentUser]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: isAuthenticated,
  });

  // Use a side effect to dispatch actions based on query results
  useEffect(() => {
    if (data) {
      dispatch(loginSuccess({ user: data }));
    }
  }, [data, dispatch]);

  // Handle errors separately
  useEffect(() => {
    if (error) {
      console.error("Login error:", error);
    }
  }, [error]);

  return { currentUser, isAdmin, isAuthor, isLoading };
};
