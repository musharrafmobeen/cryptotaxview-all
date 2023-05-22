import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "currency",
  initialState: {
    selection: "coinbase",
  },
  reducers: {
    currencySelectionChanged: (currency, action) => {
      currency.selection = action.payload;
    },
  },
});

export const { currencySelectionChanged } = slice.actions;

export default slice.reducer;
