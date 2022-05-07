import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice';
import facilityFilterSlice from './facilityFilterSlice';

export default configureStore({
  reducer: {
    facility: facilityFilterSlice,
    user: userSlice,
  }
});