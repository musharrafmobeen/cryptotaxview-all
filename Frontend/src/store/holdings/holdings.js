import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import configData from "../../config.json";

const baseUrl = configData.url.baseURL;
const baseUrlHoldings = baseUrl + "/exchanges-wrapper/holdings";

const initialState = {
  data: [],
  isError: false,
  errorMessage: "",
  isLoading: false,
  isLoadingStates: {
    binance: false,
    coinspot: false,
    swyftx: false,
    coinbase: false,
  },
  refreshHoldings: false,
};

const slice = createSlice({
  name: "holdings",
  initialState,
  reducers: {
    binanceHoldingsRequestSuccess: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      for (let i = 0; i < action.payload.info.balances.length; i++) {
        if (
          action.payload.info.balances[i].locked > 0 ||
          action.payload.info.balances[i].free > 0 ||
          action.payload.info.balances[i].borrowed > 0
        )
          holdings.data.push({
            ...action.payload.info.balances[i],
            exchange: "binance",
            borrowed: 0,
          });
      }
      holdings.isLoadingStates.binance = false;
      if (
        !holdings.isLoadingStates.binance &&
        !holdings.isLoadingStates.coinbase &&
        !holdings.isLoadingStates.coinspot &&
        !holdings.isLoadingStates.swyftx
      )
        holdings.isLoading = false;
    },
    coinbaseHoldingsRequestSuccess: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      for (let i = 0; i < action.payload.info.balances.length; i++) {
        if (
          action.payload.info.balances[i].locked > 0 ||
          action.payload.info.balances[i].free > 0 ||
          action.payload.info.balances[i].borrowed > 0
        )
          holdings.data.push({
            ...action.payload.info.balances[i],
            exchange: "coinbase",
            borrowed: 0,
          });
      }
      holdings.isLoadingStates.coinbase = false;
      if (
        !holdings.isLoadingStates.binance &&
        !holdings.isLoadingStates.coinbase &&
        !holdings.isLoadingStates.coinspot &&
        !holdings.isLoadingStates.swyftx
      )
        holdings.isLoading = false;
    },
    swyftxHoldingsRequestSuccess: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      for (let i = 0; i < action.payload.info.balances.length; i++) {
        if (
          action.payload.info.balances[i].locked > 0 ||
          action.payload.info.balances[i].free > 0 ||
          action.payload.info.balances[i].borrowed > 0
        )
          holdings.data.push({
            ...action.payload.info.balances[i],
            exchange: "swyftx",
            borrowed: 0,
          });
      }
      holdings.isLoadingStates.swyftx = false;
      if (
        !holdings.isLoadingStates.binance &&
        !holdings.isLoadingStates.coinbase &&
        !holdings.isLoadingStates.coinspot &&
        !holdings.isLoadingStates.swyftx
      )
        holdings.isLoading = false;
    },
    coinspotHoldingsRequestSuccess: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      for (let i = 0; i < action.payload.info.balances.length; i++) {
        if (
          action.payload.info.balances[i].locked > 0 ||
          action.payload.info.balances[i].free > 0 ||
          action.payload.info.balances[i].borrowed > 0
        )
          holdings.data.push({
            ...action.payload.info.balances[i],
            exchange: "coinspot",
            borrowed: 0,
          });
      }
      holdings.isLoadingStates.coinspot = false;
      if (
        !holdings.isLoadingStates.binance &&
        !holdings.isLoadingStates.coinbase &&
        !holdings.isLoadingStates.coinspot &&
        !holdings.isLoadingStates.swyftx
      )
        holdings.isLoading = false;
    },
    binanceHoldingsRequestStart: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      holdings.isLoadingStates.binance = true;
      holdings.isLoading = true;
      holdings.refreshHoldings = false;
    },
    coinspotHoldingsRequestStart: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      holdings.isLoadingStates.coinspot = true;
      holdings.isLoading = true;
      holdings.refreshHoldings = false;
    },
    swyftxHoldingsRequestStart: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      holdings.isLoadingStates.swyftx = true;
      holdings.isLoading = true;
      holdings.refreshHoldings = false;
    },
    coinbaseHoldingsRequestStart: (holdings, action) => {
      holdings.isError = false;
      holdings.errorMessage = "";
      holdings.isLoadingStates.coinbase = true;
      holdings.isLoading = true;
      holdings.refreshHoldings = false;
    },
    holdingsRequestFailed: (holdings, action) => {
      holdings.isError = true;
      holdings.errorMessage = action.payload.message;
      holdings.isLoading = false;
    },
    setRefreshHoldings: (state, payload) => {
      state.refreshHoldings = true;
    },
    clearHoldingsData: (state, payload) => {
      state.data = [];
    },
  },
});

export const {
  binanceHoldingsRequestStart,
  coinbaseHoldingsRequestStart,
  swyftxHoldingsRequestStart,
  coinspotHoldingsRequestStart,
  holdingsRequestFailed,
  binanceHoldingsRequestSuccess,
  coinbaseHoldingsRequestSuccess,
  swyftxHoldingsRequestSuccess,
  coinspotHoldingsRequestSuccess,
  setRefreshHoldings,
  clearHoldingsData,
} = slice.actions;

export const getBinanceHoldings = () =>
  apiCallBegan({
    url: baseUrlHoldings + "/binance",
    method: "get",
    onStart: binanceHoldingsRequestStart,
    onSuccess: binanceHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });
export const getBinanceHoldingsProfessional = (email) =>
  apiCallBegan({
    url: baseUrlHoldings + "/binance/" + email,
    method: "get",
    onStart: binanceHoldingsRequestStart,
    onSuccess: binanceHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getCoinbaseHoldings = () =>
  apiCallBegan({
    url: baseUrlHoldings + "/coinbase",
    method: "get",
    onStart: coinbaseHoldingsRequestStart,
    onSuccess: coinbaseHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getCoinbaseHoldingsProfessional = (email) =>
  apiCallBegan({
    url: baseUrlHoldings + "/coinbase/" + email,
    method: "get",
    onStart: coinbaseHoldingsRequestStart,
    onSuccess: coinbaseHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getSwyftxHoldings = () =>
  apiCallBegan({
    url: baseUrlHoldings + "/swyftx",
    method: "get",
    onStart: swyftxHoldingsRequestStart,
    onSuccess: swyftxHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getSwyftxHoldingsProfessional = (email) =>
  apiCallBegan({
    url: baseUrlHoldings + "/swyftx/" + email,
    method: "get",
    onStart: swyftxHoldingsRequestStart,
    onSuccess: swyftxHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getCoinspotHoldings = () =>
  apiCallBegan({
    url: baseUrlHoldings + "/coinspot",
    method: "get",
    onStart: coinspotHoldingsRequestStart,
    onSuccess: coinspotHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export const getCoinspotHoldingsProfessional = (email) =>
  apiCallBegan({
    url: baseUrlHoldings + "/coinspot/" + email,
    method: "get",
    onStart: coinspotHoldingsRequestStart,
    onSuccess: coinspotHoldingsRequestSuccess,
    onError: holdingsRequestFailed,
  });

export default slice.reducer;
