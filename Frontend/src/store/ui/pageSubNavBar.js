import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "pageSubNavBar",
  initialState: {
    selection: "home",
  },
  reducers: {
    changeSubNavBar: (pageSubNavBar, action) => {
      pageSubNavBar.selection = action.payload;
    },
  },
});

export const { changeSubNavBar } = slice.actions;

export default slice.reducer;
