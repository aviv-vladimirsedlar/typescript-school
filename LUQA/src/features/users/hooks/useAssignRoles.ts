import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { updateUser } from "../user.slice";
import { assignRole } from "../users.api";

export const useAssignRoles = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: assignRole,
    onSuccess: (user) => {
      dispatch(updateUser({ user }));
    },
  });
};
