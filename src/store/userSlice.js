import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      accountId: null,
      // tokenBalance: null
    }
  },
  reducers: {
    setUserAccountId(state, action) {
      state.user.accountId = action.payload.account;
    },
    // setUserBalance(state, action) {
    //   state.user.tokenBalance = action.payload.balance;
    // },
  }
});

export const { setUserAccountId, /* setUserBalance */ } = userSlice.actions;
export default userSlice.reducer;