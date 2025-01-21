import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import axiosInstance from "../../../config/api";
import { updateUser } from "../user.slice";

interface RegisterData {
  userId: string;
  roles: string[];
}

// Updated function for assigning roles
const assignRole = async (data: RegisterData) => {
  const response = await axiosInstance.post(
    `/users/${data.userId}/assign-role`,
    { roles: data.roles }
  );
  return response.data;
};

// Custom hook for role assignment
export const useAssinRoles = () => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: assignRole,
    onSuccess: (user) => {
      // Dispatch updated user data to the store
      dispatch(updateUser({ user }));
    },
    onError: (error) => {
      // Handle errors gracefully
      console.error("Error assigning role:", error);
    },
  });

  return mutation;
};
