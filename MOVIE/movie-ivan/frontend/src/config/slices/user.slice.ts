import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Pagination } from '../../common/types/pagination.types';
import { User } from '../../common/types/user.types';

interface UserState {
  data: User[];
  meta?: Pagination;
}

const initialState: UserState = {
  data: [],
  meta: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserList(state, action: PayloadAction<UserState>) {
      state.data = action.payload.data;
      state.meta = action.payload.meta;
    },
    updateUser(state, action: PayloadAction<{ user: User }>) {
      let { data } = state;
      data = data.map((user) => {
        if (user.id === action.payload.user.id) {
          return action.payload.user;
        }
        return user;
      });
      state.data = data;
    },
  },
});

export const { updateUserList, updateUser } = userSlice.actions;
export default userSlice.reducer;
