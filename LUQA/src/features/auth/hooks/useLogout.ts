import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../config/api";
import { logoutSuccess } from "../auth.slice";

const logoutRequest = async () => {
  const response = await axiosInstance.delete("/users/logout");
  return response.data;
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(logoutSuccess());
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending, // Correct loading state for v5
    error: mutation.error, // Optional error handling
  };
};
