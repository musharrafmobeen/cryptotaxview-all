import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./../api";
import configData from "./.././../config.json";

const baseUrl = configData.url.baseURL;
const coinbaseEndPoint = configData.url.coinBaseUrl;
const binanceEndPoint = configData.url.binanceUrl;
const allEndPoint = configData.url.allUrl;
const getTransfersUrl = configData.url.getTransfers;
const binanceGetUrl = configData.url.binanceGetUrl;
const coinbaseUrl = `${baseUrl}${coinbaseEndPoint}${getTransfersUrl}`;
const binanceUrl = `${baseUrl}${binanceGetUrl}`;
const allUrl = `${baseUrl}${allEndPoint}${getTransfersUrl}`;

const slice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    binanceList: [], //new
    allList: [],
    loading: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    coinbaseTransactionsRequested: (transactions, action) => {
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = true;
    },
    coinbaseTransactionsReceived: (transactions, action) => {
      transactions.list = action.payload.transfers;
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = false;
    },
    coinbaseTransactionsRequestFailed: (transactions, action) => {
      transactions.isError = true;
      transactions.errorMessage = action.payload.message;
      transactions.loading = false;
    },
    binanceTransactionsRequested: (transactions, action) => {
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = true;
    },
    binanceTransactionsReceived: (transactions, action) => {
      transactions.binanceList = action.payload.transfers; //transactions instead of trades
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = false;
    },
    binanceTransactionsRequestFailed: (transactions, action) => {
      transactions.isError = true;
      transactions.errorMessage = action.payload.message;
      transactions.loading = false;
    },
    allTransactionsRequested: (transactions, action) => {
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = true;
    },
    allTransactionsReceived: (transactions, action) => {
      transactions.allList = action.payload.transfers;
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = false;
    },
    allTransactionsRequestFailed: (transactions, action) => {
      transactions.isError = true;
      transactions.errorMessage = action.payload.message;
      transactions.loading = false;
    },
  },
});

const {
  coinbaseTransactionsRequested,
  coinbaseTransactionsReceived,
  coinbaseTransactionsRequestFailed,
  binanceTransactionsRequested,
  binanceTransactionsReceived,
  binanceTransactionsRequestFailed,
  allTransactionsRequested,
  allTransactionsReceived,
  allTransactionsRequestFailed,
} = slice.actions;

export const loadTransactions = (selection) =>
  apiCallBegan({
    url: `${
      selection === "coinbase"
        ? coinbaseUrl
        : selection === "binance"
        ? binanceUrl
        : allUrl
    }`,
    onStart: `${
      selection === "coinbase"
        ? coinbaseTransactionsRequested.type
        : selection === "binance"
        ? binanceTransactionsRequested
        : allTransactionsRequested
    }`,
    onSuccess: `${
      selection === "coinbase"
        ? coinbaseTransactionsReceived.type
        : selection === "binance"
        ? binanceTransactionsReceived.type
        : allTransactionsReceived
    }`,
    onError: `${
      selection === "coinbase"
        ? coinbaseTransactionsRequestFailed.type
        : selection === "binance"
        ? binanceTransactionsRequestFailed
        : allTransactionsRequestFailed
    }`,
  });

export default slice.reducer;
// url: `${selection === "coinbase" ? coinbaseUrl : binanceUrl}`
