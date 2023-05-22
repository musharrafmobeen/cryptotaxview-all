import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import url from "../../config.json";
const baseUrl = url.url.baseURL + "/exchange-master-table";
const slice = createSlice({
  name: "csvMasterTable",
  initialState: {
    data: [],
    errorMessage: "",
    isRefreshNeeded: false,
    isLoading: false,
    isLoadingSuccess: false,
    isLoadingFailed: false,
    isDataRefreshRequired: false,
    isAdding: false,
    isAddingSuccess: false,
    isAddingFailed: false,
    isDeleting: false,
    isDeletingSuccess: false,
    isDeletingFailed: false,
    isEditing: false,
    isEditingSuccess: false,
    isEditingFailed: false,
  },
  reducers: {
    getCSVMasterTableStart: (state, action) => {
      state.errorMessage = "";
      state.isLoading = true;
      state.isLoadingSuccess = false;
      state.isLoadingFailed = false;
      state.isRefreshNeeded = false;
    },
    getCSVMasterTableSuccess: (state, action) => {
      state.errorMessage = "";
      state.isLoading = false;
      state.isLoadingSuccess = true;
      state.isLoadingFailed = false;
      state.data = action.payload;
    },
    getCSVMasterTableFailed: (state, action) => {
      state.errorMessage = action.payload.message;
      state.isLoading = false;
      state.isLoadingSuccess = false;
      state.isLoadingFailed = true;
    },
    postCSVMasterTableStart: (state, action) => {
      state.errorMessage = "";
      state.isAdding = true;
      state.isAddingFailed = false;
      state.isAddingSuccess = false;
    },
    postCSVMasterTableSuccess: (state, action) => {
      state.errorMessage = "";
      state.isAdding = false;
      state.isAddingFailed = false;
      state.isAddingSuccess = true;
      state.isRefreshNeeded = true;
      // state.data = action.payload;
    },
    postCSVMasterTableFailed: (state, action) => {
      state.errorMessage = action.payload.message;
      state.isAdding = false;
      state.isAddingFailed = true;
      state.isAddingSuccess = false;
    },
    deleteCSVMasterTableStart: (state, action) => {
      state.errorMessage = "";
      state.isDeleting = true;
      state.isDeletingSuccess = false;
      state.isDeletingFailed = false;
    },
    deleteCSVMasterTableSuccess: (state, action) => {
      state.errorMessage = "";
      state.isDeleting = false;
      state.isDeletingSuccess = true;
      state.isDeletingFailed = false;
      state.isRefreshNeeded = true;
      // state.data = action.payload;
    },
    deleteCSVMasterTableFailed: (state, action) => {
      state.errorMessage = action.payload.message;
      state.isDeleting = false;
      state.isDeletingSuccess = false;
      state.isDeletingFailed = true;
    },
    patchCSVMasterTableStart: (state, action) => {
      state.errorMessage = "";
      state.isEditing = true;
      state.isEditingSuccess = false;
      state.isEditingFailed = false;
    },
    patchCSVMasterTableSuccess: (state, action) => {
      state.errorMessage = "";
      state.isEditing = false;
      state.isEditingSuccess = true;
      state.isEditingFailed = false;
      state.isRefreshNeeded = true;
      // state.data = action.payload;
    },
    patchCSVMasterTableFailed: (state, action) => {
      state.isEditing = false;
      state.isEditingSuccess = false;
      state.isEditingFailed = true;
      state.errorMessage = action.payload.message;
    },
  },
});

export const {
  getCSVMasterTableStart,
  getCSVMasterTableSuccess,
  getCSVMasterTableFailed,
  postCSVMasterTableStart,
  postCSVMasterTableSuccess,
  postCSVMasterTableFailed,
  deleteCSVMasterTableStart,
  deleteCSVMasterTableSuccess,
  deleteCSVMasterTableFailed,
  patchCSVMasterTableStart,
  patchCSVMasterTableSuccess,
  patchCSVMasterTableFailed,
} = slice.actions;

export const getCSVMasterTableData = (payload) =>
  apiCallBegan({
    url: baseUrl,
    method: "get",
    onStart: getCSVMasterTableStart.type,
    onSuccess: getCSVMasterTableSuccess.type,
    onError: getCSVMasterTableFailed.type,
  });

export const postCSVMasterTableData = (data) =>
  apiCallBegan({
    url: baseUrl,
    method: "post",
    data,
    onStart: postCSVMasterTableStart.type,
    onSuccess: postCSVMasterTableSuccess.type,
    onError: postCSVMasterTableFailed.type,
  });

export const deleteCSVMasterTableData = (id) =>
  apiCallBegan({
    url: baseUrl + `/${id}`,
    method: "delete",

    onStart: deleteCSVMasterTableStart.type,
    onSuccess: deleteCSVMasterTableSuccess.type,
    onError: deleteCSVMasterTableFailed.type,
  });

export const patchCSVMasterTableData = (data) =>
  apiCallBegan({
    url: baseUrl + `/${data.name}`,
    method: "patch",
    data,
    onStart: patchCSVMasterTableStart.type,
    onSuccess: patchCSVMasterTableSuccess.type,
    onError: patchCSVMasterTableFailed.type,
  });

export default slice.reducer;
