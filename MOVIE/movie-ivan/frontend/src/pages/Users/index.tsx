import React from 'react';

import { MainLayout } from '../../layouts/MainLayout';
import { UserList } from '../../modules/users/UserList';

const Users: React.FC = () => (
  <MainLayout>
    <UserList />
  </MainLayout>
);

export default Users;
