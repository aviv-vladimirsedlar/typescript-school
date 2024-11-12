import { useState } from 'react';

import { useAssinRoles } from '../../../common/hooks/useAssinRoles';
import { useUsers } from '../../../common/hooks/useUsers';

export const useHook = () => {
  const { data, isLoading: isLoadingList } = useUsers();

  const { mutate: assingRoles } = useAssinRoles();

  const [assignUserId, setAssignUserId] = useState<string | null>(null);

  const handleAssignAuthor = (userId: string) => async () => {
    setAssignUserId(userId);
    await assingRoles({ userId, roles: ['author'] });
    setAssignUserId(null);
  };

  return { assignUserId, data, handleAssignAuthor, isLoadingList };
};
