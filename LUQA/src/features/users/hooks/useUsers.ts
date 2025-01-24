import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../config/store";
import { updateUserList } from "../user.slice";
import { getUsers } from "../users.api";

export const useUsers = () => {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Handle success and error side effects
  useEffect(() => {
    if (data) {
      dispatch(updateUserList(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("User list error:", error);
    }
  }, [error]);

  return {
    data: userData.data,
    meta: userData.meta,
    isLoading: isFetching,
    refetch,
  };
};
