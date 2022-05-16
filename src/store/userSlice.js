import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    account: {
      id: null,
      isManager: false,
      performer: null

    }
  },
  reducers: {
    setUserAccountId(state, action) {
      state.account.id = action.payload.id;
    },
    setUserPerformer(state, action) {
      state.account.performer = action.payload.performer;
    },
    setUserIsManager(state, action) {
      state.account.isManager = action.payload.status;
    },
  }
});

export const { setUserAccountId, setUserPerformer, setUserIsManager } = userSlice.actions;
export default userSlice.reducer;