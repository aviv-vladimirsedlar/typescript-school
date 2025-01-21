import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "../../../config/api";
import { RootState } from "../../../config/store";
import { loginSuccess } from "../auth.slice";

const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

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
    queryKey: ["currentUser"], // Use array syntax for query keys
    queryFn: async () => {
      const user = await getCurrentUser();
      // Handle onSuccess logic here
      dispatch(loginSuccess({ user }));
      return user;
    },
    retry: false,
    enabled: isAuthenticated,
  });

  // Handle errors directly
  if (error) {
    console.error("Login error:", error);
  }

  return { currentUser: data, isAdmin, isAuthor, isLoading };
};
