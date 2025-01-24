import React from "react";

import { MainLayout } from "../common/layouts/MainLayout";
import { UserList } from "../features/users/components/UserList/UserList";

const Users: React.FC = () => (
  <MainLayout>
    <UserList />
  </MainLayout>
);

export default Users;
