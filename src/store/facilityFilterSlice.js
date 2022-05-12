import { createSlice } from "@reduxjs/toolkit";
import React from 'react';
import { defaultRegion } from '../near/content';

const facilityFilterSlice = createSlice({
  name: "facilityFilter",
  initialState: {
    filter: {
      facility: null,
      status: null,
      region: defaultRegion,
    }
  },
  reducers: {
    setFacility(state, action) {
      state.filter.facility = action.payload.id;
    },
    setStatus(state, action) {
      state.filter.status = action.payload.id;
    },
    setRegion(state, action) {
      state.filter.region = action.payload.id;
    },
  }
});

export const { setFacility, setStatus, setRegion } = facilityFilterSlice.actions;
export default facilityFilterSlice.reducer;
