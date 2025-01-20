import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../config/api";
import { loginSuccess } from "../auth.slice";

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const registerRequest = async (data: RegisterData) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation(registerRequest, {
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user }));
      navigate("/");
    },
  });
};
