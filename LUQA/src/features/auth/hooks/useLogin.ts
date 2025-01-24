import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../auth.api";
import { loginSuccess } from "../auth.slice";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user })); // Dispatch Redux action
      navigate("/"); // Navigate to the home page
    },
    onError: (error) => {
      console.error("Login failed:", error); // Handle error
    },
  });
  console.log(mutation);

  return mutation;
};
