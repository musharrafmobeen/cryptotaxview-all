import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import url from "../../config.json";
import { buySellCalculator } from "../../services/buySellCalculator";

const baseUrlBinance = url.url.baseURL + "/exchanges-wrapper/trades/binance";
const baseUrlCoinspot = url.url.baseURL + "/exchanges-wrapper/trades/coinspot";
const baseUrlSwyftx = url.url.baseURL + "/exchanges-wrapper/trades/swyftx";

const baseUrlDataSync = url.url.baseURL + "/exchanges-wrapper/sync/";
const baseUrlDeleteTransaction = url.url.baseURL + "/transactions/remove-some";
const baseUrlGetCSVTransactions =
  url.url.baseURL + "/order-history-import/CSV-Data";
const baseUrlGetAllTransactions = url.url.baseURL + "/transactions";
const baseUrlAddTransactions = url.url.baseURL + "/transactions/create";
const baseUrlResetTransactions = url.url.baseURL + "/transactions/reset";
const slice = createSlice({
  name: "transactions",
  initialState: {
    exchange: "all",
    algo: "fifo",
    allTransactions: [],
    allTransactionsOriginal: [],
    isErrorGetAllTransactions: false,
    isLoadingGetAllTransactions: false,
    errorMessageGetAllTransactions: "",
    csvTransactions: [],
    binance: [],
    isErrorBinance: false,
    errorMessageBinance: "",
    isLoadingBinance: false,
    coinspot: [],
    isErrorCoinspot: false,
    errorMessageCoinspot: "",
    isLoadingCoinspot: false,
    swyftx: [],
    isErrorSwyftx: false,
    errorMessageSwyftx: "",
    isLoadingSwyftx: false,
    coinbase: [],
    isErrorCoinbase: false,
    errorMessageCoinbase: "",
    isLoadingCoinbase: false,
    isError: false,
    errorMessage: "",
    loading: false,
    isSyncingBinance: false,
    isSyncingCoinBase: false,
    isSyncingSwyftx: false,
    isSyncingCoinSpot: false,
    errorMessageSyncing: "",
    isErrorSyncing: false,
    isErrorDeleteTransactions: false,
    errorMessageDeleteTransactions: false,
    startDeleteTransaction: false,
    refreshTransactions: false,
    totalCount: 0,
    uniqueCoins: [],
    errorTransactionsCount: 0,
    addTransactionRequestStart: false,
    addTransactionRequestSuccess: false,
    addTransactionRequestFailed: false,
    addTransactionRequestFailedMessage: "",
    resetToDefaultSuccess: false,
    isResettingToDefault: false,
    reCalculatingCGT: false,
    userFiles: [],
  },
  reducers: {
    changeAllTransactionsState: (transactions, action) => {
      transactions.allTransactions = action.payload;
    },
    changeExchangeState: (exchange, action) => {
      exchange.exchange = action.payload;
    },
    changeAlgoState: (Algo, action) => {
      Algo.algo = action.payload;
    },
    changeTransactionState: (transactions, action) => {
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.csvTransactions = action.payload;
      // console.log("headers", { ...headers });
      transactions.loading = false;
    },
    transactionsRequestStart: (transactions, action) => {
      transactions.isError = false;
      transactions.errorMessage = "";
      transactions.loading = true;
      transactions.refreshTransactions = false;
    },
    transactionsRequestFailed: (transactions, action) => {
      transactions.isError = true;
      transactions.errorMessage = action.payload.message;
      transactions.csvTransactions = [];
      transactions.loading = false;
    },
    changeBinanceTransactionState: (transactions, action) => {
      transactions.isErrorBinance = false;
      transactions.errorMessageBinance = "";
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Binance";
        return true;
      });
      transactions.binance = data;
      // console.log("headers", { ...headers });
      transactions.isLoadingBinance = false;
    },
    binanceTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorBinance = false;
      transactions.errorMessageBinance = "";
      transactions.isLoadingBinance = true;
      transactions.refreshTransactions = false;
    },
    binanceTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorBinance = true;
      transactions.errorMessageBinance = action.payload.message;
      transactions.binance = [];
      transactions.isLoadingBinance = false;
    },
    changeCoinspotTransactionState: (transactions, action) => {
      transactions.isErrorCoinspot = false;
      transactions.errorMessageCoinspot = "";
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "CoinSpot";
        return true;
      });
      transactions.coinspot = data;
      // console.log("headers", { ...headers });
      transactions.isLoadingCoinspot = false;
    },
    coinspotTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorCoinspot = false;
      transactions.errorMessageCoinspot = "";
      transactions.isLoadingCoinspot = true;
      transactions.refreshTransactions = false;
    },
    coinspotTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorCoinspot = true;
      transactions.errorMessageCoinspot = action.payload.message;
      transactions.coinspot = [];
      transactions.isLoadingCoinspot = false;
    },
    changeSwyftxTransactionState: (transactions, action) => {
      transactions.isErrorSwyftx = false;
      transactions.errorMessageSwyftx = "";
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Swyftx";
        return true;
      });
      transactions.swyftx = data;
      // console.log("headers", { ...headers });
      transactions.isLoadingSwyftx = false;
    },
    swyftxTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorSwyftx = false;
      transactions.errorMessageSwyftx = "";
      transactions.isLoadingSwyftx = true;
      transactions.refreshTransactions = false;
    },
    swyftxTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorSwyftx = true;
      transactions.errorMessageSwyftx = action.payload.message;
      transactions.swyftx = [];
      transactions.isLoadingSwyftx = false;
    },
    changeSyncDataStateBinance: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingBinance = false;
      transactions.refreshTransactions = false;
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Binance";
        return true;
      });
      transactions.binance = data;
    },
    changeSyncDataStateSwyftx: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingSwyftx = false;
      transactions.refreshTransactions = false;
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Swyftx";
        return true;
      });
      transactions.swyftx = data;
    },
    changeSyncDataStateCoinBase: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingCoinBase = false;
      transactions.refreshTransactions = false;
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Coinbase";
        return true;
      });
      transactions.coinbase = data;
    },
    changeSyncDataStateCoinSpot: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingCoinSpot = false;
      transactions.refreshTransactions = false;
      let data = action.payload;
      data.map((data) => {
        data["Errors"] = 0;
        data["exchange"] = "Coinspot";
        return true;
      });
      transactions.coinspot = data;
    },
    syncBinanceTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingBinance = true;
    },
    syncCoinSpotTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingCoinSpot = true;
    },
    syncCoinBaseTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingCoinBase = true;
    },
    syncSwyftxTransactionsRequestStart: (transactions, action) => {
      transactions.isErrorSyncing = false;
      transactions.errorMessageSyncing = "";
      transactions.isSyncingSwyftx = true;
    },
    syncBinanceTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorSyncing = true;
      transactions.errorMessageSyncing = action.payload.message;
      transactions.isSyncingBinance = false;
    },
    syncCoinbaseTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorSyncing = true;
      transactions.errorMessageSyncing = action.payload.message;
      transactions.isSyncingCoinBase = false;
    },
    syncCoinSpotTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorSyncing = true;
      transactions.errorMessageSyncing = action.payload.message;
      transactions.isSyncingCoinSpot = false;
    },
    syncSwyftxTransactionsRequestFailed: (transactions, action) => {
      transactions.isErrorSyncing = true;
      transactions.errorMessageSyncing = action.payload.message;
      transactions.isSyncingSwyftx = false;
    },
    deleteTransactionRequestFailed: (transactions, action) => {
      transactions.isErrorDeleteTransactions = true;
      transactions.startDeleteTransaction = false;
      transactions.errorMessageDeleteTransactions = action.payload.message;
    },
    deleteTransactionRequestStarted: (transactions, action) => {
      transactions.isErrorDeleteTransactions = false;
      transactions.startDeleteTransaction = true;
      transactions.errorMessageDeleteTransactions = "";
    },
    deleteTransactionRequestSuccess: (transactions, action) => {
      transactions.startDeleteTransaction = false;
      transactions.refreshTransactions = true;
    },
    getAllTransactionsRequestStart: (transactions, action) => {
      transactions.isLoadingGetAllTransactions = true;
      transactions.errorMessageGetAllTransactions = "";
      transactions.isErrorGetAllTransactions = false;
      // transactions.allTransactions = [];
    },
    getAllTransactionsRequestFailed: (transactions, action) => {
      transactions.isLoadingGetAllTransactions = false;
      transactions.errorMessageGetAllTransactions = action.payload.message;
      transactions.isErrorGetAllTransactions = true;
      transactions.allTransactions = [];
    },
    changeTransactionsRequestSuccess: (transactions, action) => {
      transactions.refreshTransactions = true;
    },
    getAllTransactionsRequestSuccess: (transactions, action) => {
      transactions.isLoadingGetAllTransactions = false;
      transactions.errorMessageGetAllTransactions = "";
      transactions.isErrorGetAllTransactions = false;
      transactions.refreshTransactions = false;
      transactions.errorTransactionsCount = action.payload.errorCount;
      transactions.totalCount = action.payload.count;
      transactions.allTransactions = [];
      const tempUniqueCoinsArray = [];
      for (let i = 0; i < action.payload.uniqueCoins.length; i++) {
        tempUniqueCoinsArray.push({
          value: action.payload.uniqueCoins[i],
          label: action.payload.uniqueCoins[i],
        });
      }

      transactions.uniqueCoins = tempUniqueCoinsArray;
      transactions.userFiles = action.payload.uniqueFileNames;
      const transactionsData = action.payload.transactions;
      let originalDataWithisOpenProperty = [];
      for (let i = 0; i < transactionsData.length; i++) {
        originalDataWithisOpenProperty.push({
          ...transactionsData[i],
          isOpen: false,
          isOpenDetails: null,
          assetTraded: buySellCalculator(
            transactionsData[i].symbol,
            transactionsData[i].side
          )[0],
          assetReceived: buySellCalculator(
            transactionsData[i].symbol,
            transactionsData[i].side
          )[1],
        });
      }

      transactions.allTransactionsOriginal = originalDataWithisOpenProperty;
      const dates = [];
      for (let i = 0; i < transactionsData.length; i++) {
        const day = transactionsData[i].datetime.split("T")[0];
        if (dates.filter((date) => date === day).length === 0) dates.push(day);
      }

      for (let i = 0; i < dates.length; i++) {
        let dateWiseObject = { date: "", data: [] };
        dateWiseObject.date = dates[i];
        dateWiseObject.data = transactionsData.filter((data) =>
          data.datetime.includes(dates[i])
        );
        dateWiseObject.data = dateWiseObject.data.map((dataToProcess) => ({
          ...dataToProcess,
          isOpen: false,
          isOpenDetails: null, //change
          assetTraded: buySellCalculator(
            dataToProcess.symbol,
            dataToProcess.side
          )[0],
          assetReceived: buySellCalculator(
            dataToProcess.symbol,
            dataToProcess.side
          )[1],
        }));

        transactions.allTransactions.push(dateWiseObject);
      }
    },
    modifyOriginalTransactions: (transactions, action) => {
      transactions.allTransactionsOriginal = action.payload;
    },
    addTransactionsRequestStart: (transactions, action) => {
      transactions.addTransactionRequestStart = true;
      transactions.addTransactionRequestFailedMessage = "";
      transactions.addTransactionRequestFailed = false;
      transactions.addTransactionRequestSuccess = false;
    },
    addTransactionsRequestFailed: (transactions, action) => {
      transactions.addTransactionRequestStart = false;
      transactions.addTransactionRequestFailedMessage = action.payload.message;
      transactions.addTransactionRequestFailed = true;
      transactions.addTransactionRequestSuccess = false;
    },
    addTransactionsRequestSuccess: (transactions, action) => {
      transactions.refreshTransactions = true;
      transactions.addTransactionRequestFailedMessage = "";
      transactions.addTransactionRequestFailed = false;
      transactions.addTransactionRequestStart = false;
      transactions.addTransactionRequestSuccess = true;
    },
    resetTransactionStates: (transactions, action) => {
      transactions.addTransactionRequestSuccess = false;
      transactions.resetToDefaultSuccess = false;
    },

    resetTransactionsRequestSuccess: (transactions, action) => {
      transactions.refreshTransactions = true;
      transactions.resetToDefaultSuccess = true;
      transactions.isResettingToDefault = false;
    },
    resetTransactionsRequestStart: (transactions, action) => {
      transactions.isResettingToDefault = true;
    },
    editTransactionsRequestStart: (transactions, action) => {
      transactions.isLoadingGetAllTransactions = true;
      transactions.errorMessageGetAllTransactions = "";
      transactions.isErrorGetAllTransactions = false;
      transactions.reCalculatingCGT = true;
      // transactions.allTransactions = [];
    },
    editTransactionsRequestSuccess: (transactions, action) => {
      transactions.refreshTransactions = true;
      transactions.reCalculatingCGT = false;
    },
  },
});

export const {
  resetTransactionsRequestStart,
  resetTransactionStates,
  changeTransactionsRequestSuccess,
  modifyOriginalTransactions,
  changeAllTransactionsState,
  getAllTransactionsRequestSuccess,
  getAllTransactionsRequestFailed,
  getAllTransactionsRequestStart,
  transactionsRequestStart,
  transactionsRequestFailed,
  changeTransactionState,
  changeBinanceTransactionState,
  binanceTransactionsRequestStart,
  binanceTransactionsRequestFailed,
  changeCoinspotTransactionState,
  coinspotTransactionsRequestStart,
  coinspotTransactionsRequestFailed,
  changeSwyftxTransactionState,
  swyftxTransactionsRequestStart,
  swyftxTransactionsRequestFailed,
  changeSyncDataStateCoinSpot,
  changeSyncDataStateBinance,
  changeSyncDataStateSwyftx,
  changeSyncDataStateCoinBase,
  syncBinanceTransactionsRequestStart,
  syncSwyftxTransactionsRequestStart,
  syncCoinbaseTransactionsRequestStart,
  syncCoinSpotTransactionsRequestStart,
  syncBinanceTransactionsRequestFailed,
  syncCoinSpotTransactionsRequestFailed,
  syncCoinbaseTransactionsRequestFailed,
  syncSwyftxTransactionsRequestFailed,
  changeExchangeState,
  changeAlgoState,
  deleteTransactionRequestStarted,
  deleteTransactionRequestSuccess,
  deleteTransactionRequestFailed,
  addTransactionsRequestStart,
  addTransactionsRequestSuccess,
  addTransactionsRequestFailed,
  resetTransactionsRequestSuccess,
  editTransactionsRequestStart,
  editTransactionsRequestSuccess,
} = slice.actions;

export const getCoinspotTransactions = (methodOfTaxCal) =>
  apiCallBegan({
    url: baseUrlCoinspot + methodOfTaxCal,
    method: "get",
    onStart: coinspotTransactionsRequestStart.type,
    onSuccess: changeCoinspotTransactionState.type,
    onError: coinspotTransactionsRequestFailed.type,
  });

export const getSwyftxTransactions = (methodOfTaxCal) =>
  apiCallBegan({
    url: baseUrlSwyftx + methodOfTaxCal,
    method: "get",
    onStart: swyftxTransactionsRequestStart.type,
    onSuccess: changeSwyftxTransactionState.type,
    onError: swyftxTransactionsRequestFailed.type,
  });

export const getBinanceTransactions = (methodOfTaxCal) =>
  apiCallBegan({
    url: baseUrlBinance + methodOfTaxCal,
    method: "get",
    onStart: binanceTransactionsRequestStart.type,
    onSuccess: changeBinanceTransactionState.type,
    onError: binanceTransactionsRequestFailed.type,
  });

export const syncDataCoinspot = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });
export const syncDataCoinspotProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });

export const syncDataBinance = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    onStart: syncBinanceTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateBinance.type,
    onError: syncBinanceTransactionsRequestFailed.type,
  });

export const syncDataBinanceProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    onStart: syncBinanceTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateBinance.type,
    onError: syncBinanceTransactionsRequestFailed.type,
  });

export const syncDataSwyftx = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    onStart: syncSwyftxTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateSwyftx.type,
    onError: syncSwyftxTransactionsRequestFailed.type,
  });

export const syncDataSwyftxProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    onStart: syncSwyftxTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateSwyftx.type,
    onError: syncSwyftxTransactionsRequestFailed.type,
  });

export const syncDataCoinbase = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    // onStart: syncCoinbaseTransactionsRequestStart.type,
    // onSuccess: changeSyncDataStateCoinBase.type,
    // onError: syncCoinbaseTransactionsRequestFailed.type,
  });

export const syncDataCoinbaseProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    // onStart: syncCoinbaseTransactionsRequestStart.type,
    // onSuccess: changeSyncDataStateCoinBase.type,
    // onError: syncCoinbaseTransactionsRequestFailed.type,
  });

export const syncDataMetamask = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });

export const syncDataMetamaskProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });

export const syncDataBitcoin = (exchange) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });

export const syncDataBitcoinProfessional = (exchange, userEmail) =>
  apiCallBegan({
    url: baseUrlDataSync + exchange + "/" + exchange + "/" + userEmail,
    method: "get",
    onStart: syncCoinSpotTransactionsRequestStart.type,
    onSuccess: changeSyncDataStateCoinSpot.type,
    onError: syncCoinSpotTransactionsRequestFailed.type,
  });

export const deleteTransaction = (id) =>
  apiCallBegan({
    url: baseUrlDeleteTransaction,
    method: "delete",
    data: { txnIDs: id },
    onStart: deleteTransactionRequestStarted.type,
    onSuccess: deleteTransactionRequestSuccess.type,
    onError: deleteTransactionRequestFailed.type,
  });
export const deleteTransactionProfessional = (id, emailID) =>
  apiCallBegan({
    url: baseUrlDeleteTransaction + `/${emailID}`,
    method: "delete",
    data: { txnIDs: id },
    onStart: deleteTransactionRequestStarted.type,
    onSuccess: deleteTransactionRequestSuccess.type,
    onError: deleteTransactionRequestFailed.type,
  });
export const getCSVTransactions = () =>
  apiCallBegan({
    url: baseUrlGetCSVTransactions,
    method: "get",
    onStart: transactionsRequestStart.type,
    onSuccess: changeTransactionState.type,
    onError: transactionsRequestFailed.type,
  });
export const getAllTransactions = (take, skip, filters) =>
  apiCallBegan({
    url: baseUrlGetAllTransactions + `/${take}/${skip}`,
    method: "post",
    data: { filters },
    onStart: getAllTransactionsRequestStart.type,
    onSuccess: getAllTransactionsRequestSuccess.type,
    onError: getAllTransactionsRequestFailed.type,
  });
export const getAllTransactionsProfessional = (take, skip, filters, emailID) =>
  apiCallBegan({
    url: baseUrlGetAllTransactions + `/${take}/${skip}/${emailID}`,
    method: "post",
    data: { filters },
    onStart: getAllTransactionsRequestStart.type,
    onSuccess: getAllTransactionsRequestSuccess.type,
    onError: getAllTransactionsRequestFailed.type,
  });
export const changeTransactionSide = (id, object) =>
  apiCallBegan({
    url: baseUrlGetAllTransactions,

    method: "patch",
    data: { ids: [id], updates: object },

    onStart: editTransactionsRequestStart.type,
    onSuccess: editTransactionsRequestSuccess.type,
    onError: getAllTransactionsRequestFailed.type,
  });
export const changeTransactionSideProfessional = (id, object, emailID) =>
  apiCallBegan({
    url: baseUrlGetAllTransactions + `/${emailID}`,
    method: "patch",
    data: { ids: [id], updates: object },

    onStart: editTransactionsRequestStart.type,
    onSuccess: editTransactionsRequestSuccess.type,
    onError: getAllTransactionsRequestFailed.type,
  });
export const addTransaction = (data) =>
  apiCallBegan({
    url: baseUrlAddTransactions,
    method: "post",
    data,

    onStart: addTransactionsRequestStart.type,
    onSuccess: addTransactionsRequestSuccess.type,
    onError: addTransactionsRequestFailed.type,
  });

export const addTransactionProfessional = (data, emailID) =>
  apiCallBegan({
    url: baseUrlAddTransactions + `/${emailID}`,
    method: "post",
    data,

    onStart: addTransactionsRequestStart.type,
    onSuccess: addTransactionsRequestSuccess.type,
    onError: addTransactionsRequestFailed.type,
  });
export const resetTransactions = () =>
  apiCallBegan({
    url: baseUrlResetTransactions,
    method: "get",
    onStart: resetTransactionsRequestStart,
    onSuccess: resetTransactionsRequestSuccess.type,
  });
export const resetTransactionStatesProfessional = (emailID) =>
  apiCallBegan({
    url: baseUrlResetTransactions + `/${emailID}`,
    method: "get",
    onStart: resetTransactionsRequestStart,
    onSuccess: resetTransactionsRequestSuccess.type,
  });
export default slice.reducer;
