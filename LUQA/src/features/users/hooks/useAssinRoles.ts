import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

import axiosInstance from "../../../config/api";
import { updateUser } from "../user.slice";

interface RegisterData {
  userId: string;
  roles: string[];
}

const assingrRole = async (data: RegisterData) => {
  const response = await axiosInstance.post(
    `/users/${data.userId}/assign-role`,
    { roles: data.roles }
  );
  return response.data;
};

export const useAssinRoles = () => {
  const dispatch = useDispatch();

  return useMutation(assingrRole, {
    onSuccess: (user) => {
      dispatch(updateUser({ user }));
    },
  });
};
