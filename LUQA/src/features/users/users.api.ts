import axiosInstance from "../../config/api";

import { RoleData } from "./users.types";

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

export const assignRole = async (data: RoleData) => {
  const response = await axiosInstance.post(
    `/users/${data.userId}/assign-role`,
    { roles: data.roles }
  );
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get("/users?limit=100");
  return response.data;
};
