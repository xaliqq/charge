/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IAuth } from '@/models/user';

const initialState: IAuth = {
  data: {
    email: '',
    firstname: '',
    id: '',
    isBlocked: false,
    lastname: '',
    phoneNumber: '',
    role: '',
    token: '',
    username: ''
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
