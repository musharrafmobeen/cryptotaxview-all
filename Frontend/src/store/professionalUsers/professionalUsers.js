import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import configData from "../../config.json";

const baseUrl = configData.url.baseURL;

const slice = createSlice({
  name: "clients",
  initialState: {
    users: [],
    isGettingClients: false,
    isErrorGettingClients: false,
    errorMessageGettingClients: "",
    isRefreshClients: false,
    isPostingClients: false,
    isErrorPostingQuickInvitees: false,
    errorMessagePostingClients: "",
  },
  reducers: {
    gettingClientsStart: (clients, action) => {
      clients.isGettingClients = true;
      clients.isErrorGettingClients = false;
      clients.errorMessageGettingClients = "";
      clients.isRefreshClients = false;
    },
    gettingClientsError: (clients, action) => {
      clients.isGettingClients = false;
      clients.isErrorGettingClients = true;
      clients.errorMessageGettingClients = action.payload.message;
      clients.isRefreshClients = false;
    },
    gettingClientsSuccess: (clients, action) => {
      clients.isGettingClients = false;
      clients.isErrorGettingClients = false;
      clients.errorMessageGettingClients = "";
      clients.isRefreshClients = false;
      clients.users = action.payload;
    },
    postingClientsStart: (clients, actions) => {
      clients.isPostingClients = true;
      clients.isErrorPostingQuickInvitees = false;
      clients.errorMessagePostingClients = "";
    },
    postingClientsSuccess: (clients, actions) => {
      clients.isPostingClients = false;
      clients.isErrorPostingQuickInvitees = false;
      clients.errorMessagePostingClients = "";
      clients.isRefreshClients = true;
    },
    postingClientsError: (clients, actions) => {
      clients.isPostingClients = false;
      clients.isErrorPostingQuickInvitees = true;
      clients.errorMessagePostingClients = actions.payload.message;
      clients.isRefreshClients = false;
    },
  },
});

export const {
  gettingClientsStart,
  gettingClientsError,
  gettingClientsSuccess,
  postingClientsStart,
  postingClientsSuccess,
  postingClientsError,
} = slice.actions;

export const getClients = () =>
  apiCallBegan({
    url: baseUrl + "/referrals",
    method: "get",
    onStart: gettingClientsStart.type,
    onSuccess: gettingClientsSuccess.type,
    onError: gettingClientsError.type,
  });

export const postQuickInvites = (data) =>
  apiCallBegan({
    url: baseUrl + "/users/users-invitation",
    method: "post",
    data: { users: data },
    onStart: postingClientsStart.type,
    onSuccess: postingClientsSuccess.type,
    onError: postingClientsError.type,
  });

export const patchReferrals = (email) =>
  apiCallBegan({
    url: baseUrl + "/referrals",
    method: "patch",
    data: { email },
  });

export const sendReferralEmail = (userToBeInvited) =>
  apiCallBegan({
    url: baseUrl + "/users/user-invite",
    method: "post",
    data: { userToBeInvited },
    onSuccess: postingClientsSuccess.type,
  });

export default slice.reducer;
