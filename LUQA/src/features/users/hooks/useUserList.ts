import { useState } from "react";

import { useAssignRoles } from "./useAssignRoles";
import { useUsers } from "./useUsers";

export const useUserList = () => {
  const { data, isLoading: isLoadingList } = useUsers();

  const { mutate: assignRoles } = useAssignRoles();

  const [assignUserId, setAssignUserId] = useState<string | null>(null);

  const handleAssignAuthor = (userId: string) => async () => {
    setAssignUserId(userId);
    await assignRoles({ userId, roles: ["author"] });
    setAssignUserId(null);
  };

  return { assignUserId, data, handleAssignAuthor, isLoadingList };
};
