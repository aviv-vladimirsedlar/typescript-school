import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "../../../config/api";
import { RootState } from "../../../config/store";
import { updateUserList } from "../user.slice";

const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users?limit=100");
    return response.data;
  } catch (error) {
    console.error("User list error:", error); // Handle the error here
    throw error; // Ensure the error is still thrown for React Query to handle
  }
};

export const useUsers = () => {
  const userData = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const { isLoading, refetch } = useQuery({
    queryKey: ["getUsers"], // Use array format for the query key
    queryFn: async () => {
      const data = await getUsers();
      dispatch(updateUserList(data)); // Handle dispatch logic here
      return data;
    },
    retry: false, // Avoid retrying on failure, adjust based on your needs
  });

  return { data: userData.data, meta: userData.meta, isLoading, refetch };
};
