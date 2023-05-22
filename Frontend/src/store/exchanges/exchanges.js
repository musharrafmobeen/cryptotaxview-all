import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import url from "../../config.json";
const baseUrl = url.url.baseURL + "/exchange-pairs";
const baseUrlUserFiles = url.url.baseURL + "/user-files/delete/files";
const slice = createSlice({
  name: "exchanges",
  initialState: {
    exchanges: [],
    isError: false,
    errorMessage: "",
    loading: false,
    autoSync: false,
    isRefreshExchanges: false,
    deleteExchangesSuccess: false,
    isDeletingFiles: false,
    isSuccessDeletingFiles: false,
  },
  reducers: {
    changeExchangesState: (exchange, action) => {
      exchange.isError = false;
      exchange.errorMessage = "";
      exchange.isRefreshExchanges = true;
      // exchange.exchanges.push(action.payload);
      // console.log("headers", { ...headers });
      exchange.loading = false;
      exchange.autoSync = true;
    },
    changeDeleteExchangesState: (exchange, action) => {
      exchange.isError = false;
      exchange.errorMessage = "";
      exchange.isRefreshExchanges = true;
      // exchange.exchanges.push(action.payload);
      // console.log("headers", { ...headers });
      exchange.loading = false;
      exchange.deleteExchangesSuccess = true;
    },
    changeGetExchangesState: (exchange, action) => {
      exchange.isError = false;
      exchange.errorMessage = "";
      // let formulatedExchangesData = [];
      // for (let i = 0; i < action.payload.length; i++) {
      //   formulatedExchangesData.push({
      //     ...action.payload[i],
      //     files: [
      //       "TestFileName-1.csv",
      //       "TestFileName-2.csv",
      //       "TestFileName-3.csv",
      //       "TestFileName-4.csv",
      //     ],
      //   });
      // }
      // exchange.exchanges = formulatedExchangesData;
      exchange.exchanges = action.payload;

      // console.log("headers", { ...headers });
      exchange.loading = false;
    },
    exchangesRequestStart: (exchange, action) => {
      exchange.isRefreshExchanges = false;
      exchange.autoSync = false;
      exchange.isError = false;
      exchange.errorMessage = "";
      exchange.loading = true;
      // exchange.exchanges = [];
    },
    exchangesDeleteRequestStart: (exchange, action) => {
      exchange.isRefreshExchanges = false;
      exchange.autoSync = false;
      exchange.deleteExchangesSuccess = false;
    },
    exchangesRequestFailed: (exchange, action) => {
      exchange.isRefreshExchanges = false;
      exchange.isError = true;
      exchange.errorMessage = action.payload.message;
      exchange.autoSync = false;
      exchange.loading = false;
    },
    resetAutoSync: (exchange, action) => {
      exchange.autoSync = false;
    },
    resetDeleteState: (exchange, action) => {
      exchange.deleteExchangesSuccess = false;
    },
    setRefreshExchangesTrue: (exchange, action) => {
      exchange.isRefreshExchanges = true;
    },
    exchangeFilesDeleteStart: (exchange, action) => {
      exchange.isDeletingFiles = true;
      exchange.isSuccessDeletingFiles = false;
    },
    exchangeFilesDeleteSuccess: (exchange, action) => {
      exchange.isDeletingFiles = false;
      exchange.isSuccessDeletingFiles = false;
      exchange.isRefreshExchanges = true;
    },
  },
});

export const {
  resetDeleteState,
  setRefreshExchangesTrue,
  exchangesRequestStart,
  exchangesRequestFailed,
  changeExchangesState,
  changeGetExchangesState,
  resetAutoSync,
  exchangesDeleteRequestStart,
  changeDeleteExchangesState,
  exchangeFilesDeleteStart,
  exchangeFilesDeleteSuccess,
} = slice.actions;

export const exchangeSetup = (payload) =>
  apiCallBegan({
    url: baseUrl,
    method: "post",
    data: {
      name: payload.exchange,
      exchange: payload.exchange,
      keys: payload.keys,
      lastSynced: 0,
      source: "api",
    },
    // headers: {
    //     ...headers,
    // },
    onStart: exchangesRequestStart.type,
    onSuccess: changeExchangesState.type,
    onError: exchangesRequestFailed.type,
  });

export const getExchanges = (order) =>
  apiCallBegan({
    url: baseUrl + "/retrieve",
    method: "post",
    data: { order },
    onStart: exchangesRequestStart.type,
    onSuccess: changeGetExchangesState.type,
    onError: exchangesRequestFailed.type,
  });
export const deleteExchanges = (name) =>
  apiCallBegan({
    url: baseUrl + `/${name}/${name}`,
    method: "delete",
    onStart: exchangesDeleteRequestStart.type,
    onSuccess: changeDeleteExchangesState.type,
    // onError: exchangesRequestFailed.type,
  });

export const deleteUserFilesExchanges = (fileNames) =>
  apiCallBegan({
    url: baseUrlUserFiles,
    method: "delete",
    data: { fileNames },
    onStart: exchangeFilesDeleteStart.type,
    onSuccess: exchangeFilesDeleteSuccess.type,
    // onError: exchangesRequestFailed.type,
  });

export const exchangeSetupProfessional = (payload, userEmail) =>
  apiCallBegan({
    url: baseUrl + "/professional/" + userEmail,
    method: "post",
    data: {
      name: payload.exchange,
      exchange: payload.exchange,
      keys: payload.keys,
      lastSynced: 0,
      source: "api",
    },
    // headers: {
    //     ...headers,
    // },
    onStart: exchangesRequestStart.type,
    onSuccess: changeExchangesState.type,
    onError: exchangesRequestFailed.type,
  });

export const getExchangesProfessional = (order, userEmail) =>
  apiCallBegan({
    url: baseUrl + "/retrieve/" + userEmail,
    method: "post",
    data: { order },
    onStart: exchangesRequestStart.type,
    onSuccess: changeGetExchangesState.type,
    onError: exchangesRequestFailed.type,
  });

export const deleteExchangesProfessional = (name, userEmail) =>
  apiCallBegan({
    url: baseUrl + `/${name}/${name}/${userEmail}`,
    method: "delete",
    onStart: exchangesDeleteRequestStart.type,
    onSuccess: changeDeleteExchangesState.type,
    // onError: exchangesRequestFailed.type,
  });

export const deleteUserFilesExchangesProfessional = (fileNames, userEmail) =>
  apiCallBegan({
    url: baseUrlUserFiles + "/" + userEmail,
    method: "delete",
    data: { fileNames },
    onStart: exchangeFilesDeleteStart.type,
    onSuccess: exchangeFilesDeleteSuccess.type,
    // onError: exchangesRequestFailed.type,
  });
export default slice.reducer;
