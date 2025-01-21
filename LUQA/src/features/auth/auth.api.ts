import axiosInstance from "../../config/api";

import { LoginData, RegisterData } from "./auth.types";

export const loginRequest = async (data: LoginData) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};

export const registerRequest = async (data: RegisterData) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};
