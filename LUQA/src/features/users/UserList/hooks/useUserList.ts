import { useState } from "react";

import { useAssinRoles } from "../../hooks/useAssinRoles";
import { useUsers } from "../../hooks/useUsers";

export const useUserList = () => {
  const { data, isLoading: isLoadingList } = useUsers();

  const { mutate: assingRoles } = useAssinRoles();

  const [assignUserId, setAssignUserId] = useState<string | null>(null);

  const handleAssignAuthor = (userId: string) => async () => {
    setAssignUserId(userId);
    await assingRoles({ userId, roles: ["author"] });
    setAssignUserId(null);
  };

  return { assignUserId, data, handleAssignAuthor, isLoadingList };
};
