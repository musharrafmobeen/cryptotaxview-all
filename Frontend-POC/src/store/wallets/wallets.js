import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./../api";
import configData from "./.././../config.json";

const baseUrl = configData.url.baseURL;
const coinbaseEndPoint = configData.url.coinBaseUrl;
const getWalletsUrl = configData.url.getWallets;

const url = `${baseUrl}${coinbaseEndPoint}${getWalletsUrl}`;

const slice = createSlice({
  name: "wallets",
  initialState: {
    list: [],
    loading: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    walletsRequested: (wallets, action) => {
      wallets.isError = false;
      wallets.errorMessage = "";
      wallets.loading = true;
    },
    walletsReceived: (wallets, action) => {
      wallets.list = action.payload.wallet;
      wallets.isError = false;
      wallets.errorMessage = "";
      wallets.loading = false;
    },
    walletsRequestFailed: (wallets, action) => {
      wallets.isError = true;
      wallets.errorMessage = action.payload.message;
      wallets.loading = false;
    },
  },
});

const {
  walletsRequested,
  walletsReceived,
  walletsRequestFailed
} = slice.actions;

export const loadWallets = () =>
  apiCallBegan({
    url,
    onStart: walletsRequested.type,
    onSuccess: walletsReceived.type,
    onError: walletsRequestFailed.type,
  });

export default slice.reducer;
