import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import url from "../../config.json";

const baseUrlGenerateReports = url.url.baseURL + "/exchanges-wrapper";
const baseUrlGetReports = url.url.baseURL + "/user-files";
const baseUrlDeleteReports =
  url.url.baseURL + "/exchanges-wrapper/delete/reports";

const slice = createSlice({
  name: "report",
  initialState: {
    reports: [],
    isPageRefreshNeeded: false,
    isSuccessGeneratingReport: false,
    isGeneratingReport: false,
    isErrorGeneratingReport: false,
    errorMessageGeneratingReport: "",
    isGettingReports: false,
    isSuccessDeletingReports: false,
    isDeletingReports: false,
    isErrorDeletingReports: false,
    errorMessageDeletingReports: "",
  },
  reducers: {
    generateReportStart: (report, action) => {
      report.isPageRefreshNeeded = false;
      report.isSuccessGeneratingReport = false;
      report.isGeneratingReport = true;
      report.isErrorGeneratingReport = false;
      report.errorMessageGeneratingReport = "";
    },
    generateReportEnd: (report, action) => {
      report.isSuccessGeneratingReport = true;
      report.isGeneratingReport = false;
      report.isErrorGeneratingReport = false;
      report.errorMessageGeneratingReport = "";
      report.isPageRefreshNeeded = true;
    },
    generateReportError: (report, action) => {
      report.isSuccessGeneratingReport = false;
      report.isGeneratingReport = false;
      report.isErrorGeneratingReport = true;
      report.errorMessageGeneratingReport = action.payload.message;
    },
    resetErrorStates: (report, action) => {
      report.isSuccessGeneratingReport = false;
      report.isErrorGeneratingReport = false;
      report.isErrorDeletingReports = false;
      report.isSuccessDeletingReports = false;
    },
    getReportsStart: (reports, action) => {
      reports.isGettingReports = true;
    },
    getReportsEnd: (reports, action) => {
      reports.isGettingReports = false;
      reports.reports = action.payload;
    },
    getReportsError: (reports, action) => {
      reports.isGettingReports = false;
    },
    resetIsPageRefreshNeeded: (reports, action) => {
      reports.isPageRefreshNeeded = false;
    },
    deleteReportsStart: (reports, action) => {
      reports.isDeletingReports = true;
      reports.isErrorDeletingReports = false;
      reports.errorMessageDeletingReports = "";
      reports.isSuccessDeletingReports = false;
    },
    deleteReportsSuccess: (reports, action) => {
      reports.isDeletingReports = false;
      reports.isPageRefreshNeeded = true;
      reports.isErrorDeletingReports = false;
      reports.errorMessageDeletingReports = "";
      reports.isSuccessDeletingReports = true;
    },
    deleteReportsError: (reports, action) => {
      reports.isSuccessDeletingReports = false;
      reports.isDeletingReports = false;
      reports.isErrorDeletingReports = true;
      reports.errorMessageDeletingReports = action.payload.message;
    },
  },
});

export const {
  generateReportStart,
  generateReportEnd,
  generateReportError,
  resetErrorStates,
  getReportsEnd,
  getReportsStart,
  resetIsPageRefreshNeeded,
  deleteReportsStart,
  deleteReportsSuccess,
  deleteReportsError,
  getReportsError,
} = slice.actions;

export const generateReport = (
  financialYear,
  fileType,
  exchange,
  method,
  fileName,
  reportType
) =>
  apiCallBegan({
    url: baseUrlGenerateReports + `/${fileType}`,
    method: "post",
    data: { financialYear, fileName, exchange, method, type: true, reportType },
    onStart: generateReportStart.type,
    onSuccess: generateReportEnd.type,
    onError: generateReportError.type,
  });

export const generateReportProfessional = (
  financialYear,
  fileType,
  exchange,
  method,
  fileName,
  emailID,
  reportType
) =>
  apiCallBegan({
    url: baseUrlGenerateReports + `/${fileType}/${emailID}`,
    method: "post",
    data: { financialYear, fileName, exchange, method, type: true, reportType },
    onStart: generateReportStart.type,
    onSuccess: generateReportEnd.type,
    onError: generateReportError.type,
  });

export const getReports = () =>
  apiCallBegan({
    url: baseUrlGetReports + "/files/1",
    method: "get",
    onStart: getReportsStart.type,
    onSuccess: getReportsEnd.type,
    onError: getReportsError.type,
  });

export const getReportsProfessional = (emailID) =>
  apiCallBegan({
    url: baseUrlGetReports + `/files/1/${emailID}`,
    method: "get",
    onStart: getReportsStart.type,
    onSuccess: getReportsEnd.type,
    onError: getReportsError.type,
  });

export const deleteReports = (fileNames) =>
  apiCallBegan({
    url: baseUrlDeleteReports,
    method: "delete",
    data: { fileNames },
    onStart: deleteReportsStart.type,
    onSuccess: deleteReportsSuccess.type,
    onError: deleteReportsError.type,
  });

export const deleteReportsProfessional = (fileNames, emailID) =>
  apiCallBegan({
    url: baseUrlDeleteReports + `/${emailID}`,
    method: "delete",
    data: { fileNames },
    onStart: deleteReportsStart.type,
    onSuccess: deleteReportsSuccess.type,
    onError: deleteReportsError.type,
  });

export default slice.reducer;
