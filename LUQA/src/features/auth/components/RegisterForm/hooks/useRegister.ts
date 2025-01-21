import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerRequest } from "../../../auth.api";
import { loginSuccess } from "../../../auth.slice";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      // Dispatch Redux action on successful registration
      dispatch(loginSuccess({ user: data.user }));
      // Navigate to the home page
      navigate("/");
    },
    onError: (error) => {
      // Handle registration error
      console.error("Registration failed:", error);
    },
  });

  return mutation;
};
