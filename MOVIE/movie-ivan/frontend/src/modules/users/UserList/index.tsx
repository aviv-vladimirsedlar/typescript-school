import React, { useState } from 'react';

import Button from '../../../common/components/Button';
import { useAssinRoles } from '../../../common/hooks/useAssinRoles';
import { useCurrentUser } from '../../../common/hooks/useCurrentUser';
import { useUsers } from '../../../common/hooks/useUsers';

export const UserList = () => {
  const { data, isLoading: isLoadingList } = useUsers();
  const { isAdmin } = useCurrentUser();

  const { mutate: assingRoles } = useAssinRoles();

  const [assignUserId, setAssignUserId] = useState<string | null>(null);

  const handleAssignAuthor = (userId: string) => async () => {
    setAssignUserId(userId);
    await assingRoles({ userId, roles: ['author'] });
    setAssignUserId(null);
  };

  if (isLoadingList) {
    return <div className="container p-10 text-center">Loading...</div>;
  }
  if (!data.length) {
    return <div className="container p-10 text-center">No data</div>;
  }
  return (
    <div className="relative overflow-x-auto py-12">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Roles
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((user) => {
            const roles = user.roles?.map((userRole) => userRole.role.name).join(', ');
            const isAuthor = user.roles?.some((userRole) => userRole.role.name === 'author');
            return (
              <tr
                key={user.id}
                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
              >
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{roles}</td>
                <td className="px-2 py-4">
                  {isAdmin && !isAuthor && (
                    <Button className="w-[120px] px-2 py-1 font-bold" onClick={handleAssignAuthor(user.id)}>
                      {assignUserId === user.id ? '...' : 'Assign author '}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
