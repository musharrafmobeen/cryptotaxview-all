import { Avatar, Divider, InputBase, Paper } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import styles from "../../resources/styles/views-styles/PersonalReportsStyles";
import ReportFileCard from "../helpers/ReportFileCard";
import SearchIcon from "@mui/icons-material/Search";

import {
  DownloadIcon,
  DeleteIcon,
} from "../../resources/design-icons/reports-page-icons";
import { cgtCalculationMethods } from "../../services/cgtCalculationMethods";
import { exchangesData } from "../../services/platform-integration-data";
import { useDispatch, useSelector } from "react-redux";
import {
  generateReport,
  getReports,
  resetErrorStates,
  resetIsPageRefreshNeeded,
  deleteReports,
  getReportsProfessional,
  generateReportProfessional,
  deleteReportsProfessional,
} from "../../store/reports/reports";
import { formatShortDate } from "../../services/date-formatter";

import rocketGif from "../../resources/design-images/AJ_rocket.gif";
import axios from "axios";
import url from "../../config.json";
import FileDownload from "js-file-download";
import { getFinancialYears } from "../../services/getFinancialYears";
import { ArrowBackIos } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
import { ROLES } from "../../services/rolesVerifyingService";
import Notifications from "../helpers/Notifications";

function PersonalReports(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const path = window.location.pathname.split("/");
  const token = localStorage.getItem("token");

  const [financialYear, setFinancialYear] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [method, setMethod] = useState(null);
  // const [reportName, setReportName] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [idsToProcess, setIdsToProcess] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const isSuccessReportGeneration = useSelector(
    (state) => state.entities.reports.isSuccessGeneratingReport
  );
  const isGeneratingReport = useSelector(
    (state) => state.entities.reports.isGeneratingReport
  );
  const isPageRefreshNeeded = useSelector(
    (state) => state.entities.reports.isPageRefreshNeeded
  );
  const reports = useSelector((state) => state.entities.reports.reports);
  const isErrorGeneratingReport = useSelector(
    (state) => state.entities.reports.isErrorGeneratingReport
  );
  const errorMessageGeneratingReport = useSelector(
    (state) => state.entities.reports.errorMessageGeneratingReport
  );
  const isSuccessDeletingReports = useSelector(
    (state) => state.entities.reports.isSuccessDeletingReports
  );
  const isErrorDeletingReports = useSelector(
    (state) => state.entities.reports.isErrorDeletingReports
  );
  const errorMessageDeletingReports = useSelector(
    (state) => state.entities.reports.errorMessageDeletingReports
  );
  const isGettingReports = useSelector(
    (state) => state.entities.reports.isGettingReports
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isPersonalPlan) dispatch(getReports());
    else dispatch(getReportsProfessional(path[path.length - 1]));
  }, []);

  useEffect(() => {
    if (searchText !== "") {
      setFilteredReports(
        reports.filter((report) =>
          report.fileName.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredReports(reports);
    }
  }, [reports, searchText]);

  useEffect(() => {
    if (isPageRefreshNeeded) {
      if (isPersonalPlan) dispatch(getReports());
      else dispatch(getReportsProfessional(path[path.length - 1]));
      dispatch(resetIsPageRefreshNeeded());
      setIdsToProcess([]);
    }
  }, [isPageRefreshNeeded]);

  const handleGenerateAlertClose = () => {
    dispatch(resetErrorStates());
  };

  const handleSelectedCheckbox = (reportName) => {
    if (idsToProcess.filter((id) => id === reportName).length === 0)
      setIdsToProcess([...idsToProcess, reportName]);
    if (idsToProcess.filter((id) => id === reportName).length > 0)
      setIdsToProcess(idsToProcess.filter((id) => id !== reportName));
  };

  const handleSubmit = () => {
    const reportName =
      financialYear +
      "-" +
      reportType +
      "-" +
      user.profile?.firstName +
      "-" +
      method +
      "-" +
      (+reports.length + 1);

    if (isPersonalPlan)
      dispatch(
        generateReport(
          financialYear,
          fileType,
          exchange,
          method,
          reportName,
          reportType
        )
      );
    else
      dispatch(
        generateReportProfessional(
          financialYear,
          fileType,
          exchange,
          method,
          reportName,
          path[path.length - 1],
          reportType
        )
      );
  };

  const handleDelete = () => {
    if (isPersonalPlan) dispatch(deleteReports(idsToProcess));
    else
      dispatch(deleteReportsProfessional(idsToProcess, path[path.length - 1]));
  };

  const checkAdvancedPlan = () => {
    if (
      user?.role?.shortCode === ROLES.PAID_PROFESSIONAL_USER ||
      user?.role?.shortCode === ROLES.PAID_PERSONAL_USER
    )
      return false;
    else return true;
  };
  const handleSingleFileDownload = (id) => {
    const baseUrl = url.url.baseURL;
    if (isPersonalPlan)
      axios
        .get(baseUrl + "/exchanges-wrapper/download/report/" + id, {
          responseType: "blob",
          headers: { Authorization: `bearer ${token}` },
        })
        .then((res) => {
          FileDownload(res.data, id);
        });
    else
      axios
        .get(
          baseUrl +
            `/exchanges-wrapper/download/report/${id}/${path[path.length - 1]}`,
          {
            responseType: "blob",
            headers: { Authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          FileDownload(res.data, id);
        });
  };

  const handleDownload = () => {
    const baseUrl = url.url.baseURL;
    for (let i = 0; i < idsToProcess.length; i++) {
      if (isPersonalPlan)
        axios
          .get(
            baseUrl + "/exchanges-wrapper/download/report/" + idsToProcess[i],
            {
              responseType: "blob",
              headers: { Authorization: `bearer ${token}` },
            }
          )
          .then((res) => {
            FileDownload(res.data, idsToProcess[i]);
          });
      else
        axios
          .get(
            baseUrl +
              `/exchanges-wrapper/download/report/${idsToProcess[i]}/${
                path[path.length - 1]
              }`,
            {
              responseType: "blob",
              headers: { Authorization: `bearer ${token}` },
            }
          )
          .then((res) => {
            FileDownload(res.data, idsToProcess[i]);
          });
    }
  };

  const { classes } = props;

  return (
    <div className={classes.root}>
      <Notifications
        open={isGeneratingReport}
        message="Generating Report!"
        type="warning"
        disableAutoClose
      />
      <Notifications
        open={isSuccessDeletingReports}
        message="Report deleted successfully!"
        type="success"
        onClose={handleGenerateAlertClose}
        timeOutInterval="10000"
      />
      <Notifications
        open={isErrorGeneratingReport}
        message={errorMessageGeneratingReport.message}
        type="error"
        onClose={handleGenerateAlertClose}
        timeOutInterval="10000"
      />

      <Notifications
        open={isErrorDeletingReports}
        message={errorMessageDeletingReports.message}
        type="error"
        onClose={handleGenerateAlertClose}
        timeOutInterval="10000"
      />

      <Notifications
        open={isSuccessReportGeneration}
        message="Report generated successfully!"
        type="success"
        onClose={handleGenerateAlertClose}
        timeOutInterval="10000"
      />

      <Paper className={classes.paper} elevation={0}>
        {isPersonalPlan ? (
          <div className={classes.paperHead}>
            <h3 className={classes.paperHeading}>Generate Tax Report</h3>
          </div>
        ) : (
          <div className={classes.paperHeadProfessionalContainer}>
            <div className={classes.contentProfessional}>
              <div
                className={classes.homeBackBtn}
                onClick={() => {
                  navigate("/home");
                }}
              >
                <ArrowBackIos />{" "}
                <div className={classes.homeBackBtnText}>Home</div>
              </div>
              <Divider orientation="vertical" flexItem />
              <h3
                className={classes.paperHeading}
                style={{ marginLeft: "10px" }}
              >
                Generate Tax Report
              </h3>
            </div>
            <div className={classes.professionalProfile}>
              <Divider orientation="vertical" flexItem />
              <Avatar
                src={"image-url-here"}
                alt={
                  window.location.pathname.split("/")[
                    window.location.pathname.split("/").length - 1
                  ]
                }
              />
              <div className={classes.verticalContainer}>
                <div className={classes.firstName}>
                  {
                    window.location.pathname.split("/")[
                      window.location.pathname.split("/").length - 2
                    ]
                  }
                </div>
                <div className={classes.email}>
                  {
                    window.location.pathname.split("/")[
                      window.location.pathname.split("/").length - 1
                    ]
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        <Divider />

        {user?.role?.shortCode === ROLES.FREE_PERSONAL_USER ? (
          <div
            className={classes.buyPlanBannerContainer}
            onClick={() => {
              if (isPersonalPlan) navigate("/pricing-and-plan");
              else
                navigate(
                  `/pricing-and-plan/${
                    window.location.href.split("/")[
                      window.location.href.split("/").length - 2
                    ]
                  }/${
                    window.location.href.split("/")[
                      window.location.href.split("/").length - 1
                    ]
                  }`
                );
              dispatch(changeSubNavBar(""));
            }}
          >
            Please buy plan to continue to generate report
          </div>
        ) : (
          <></>
        )}

        <div className={classes.paperForm}>
          <div className={classes.formColumn}>
            <div className={classes.formControl}>
              <label className={classes.label}>Financial Year</label>
              <select
                value={financialYear}
                className={classes.select}
                onChange={(e) => setFinancialYear(e.target.value)}
                disabled={checkAdvancedPlan()}
              >
                <option disabled selected value={null}>
                  Select Financial Year
                </option>
                {getFinancialYears().map((year) => {
                  return <option value={year.value}>{year.label}</option>;
                })}
              </select>
            </div>
            <div className={classes.formControl}>
              <label className={classes.label}>Method</label>
              <select
                value={method}
                className={classes.select}
                onChange={(e) => setMethod(e.target.value)}
                disabled={checkAdvancedPlan()}
              >
                <option disabled selected value={null}>
                  Select Method
                </option>
                {cgtCalculationMethods().map((method) => {
                  return <option value={method.value}>{method.label}</option>;
                })}
              </select>
            </div>

            {/* <div className={classes.formControl}>
              <label className={classes.label}>Report Name</label>
              <input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className={classes.input}
                type="text"
              />
            </div> */}
            <div className={classes.formControl}>
              <label className={classes.label}>Report Type</label>
              <select
                value={reportType}
                className={classes.select}
                onChange={(e) => setReportType(e.target.value)}
                disabled={checkAdvancedPlan()}
              >
                <option disabled selected value={null}>
                  Select Report Type
                </option>
                <option value={"cgtReport"}>CGT Report</option>
                <option value={"investmentReport"}>Investment Report</option>
                <option value={"transactionsReport"}>
                  Transactions Report
                </option>
              </select>
            </div>
          </div>
          <div className={classes.formColumn}>
            <div className={classes.formControl}>
              <label className={classes.label}>File Format</label>
              <div className={classes.radioInput}>
                <div>
                  <input
                    disabled={checkAdvancedPlan()}
                    type="radio"
                    id="pdf"
                    name="file-type"
                    value="pdf"
                    onChange={(e) => setFileType(e.target.value)}
                  />
                  <label htmlFor="pdf">PDF</label>
                </div>
                <div>
                  <input
                    disabled={checkAdvancedPlan()}
                    type="radio"
                    id="excel"
                    name="file-type"
                    value="excel"
                    onChange={(e) => setFileType(e.target.value)}
                  />
                  <label htmlFor="excel">CSV</label>
                </div>
              </div>
            </div>
            <div className={classes.formControl}>
              <label className={classes.label}>Exchange</label>
              <select
                disabled={checkAdvancedPlan()}
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
                className={classes.select}
              >
                <option disabled selected value={null}>
                  Select Exchange
                </option>
                <option value={"all"}>{"All"}</option>
                {exchangesData.map((exchange) => {
                  return (
                    <option
                      className={classes.capitalize}
                      value={exchange.name}
                    >
                      {exchange.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={classes.formControl}>
              <div className={classes.grow} />
              {financialYear != null &&
              method != null &&
              // reportName != null &&
              fileType != null &&
              exchange != null ? (
                <button className={classes.btnGenerate} onClick={handleSubmit}>
                  Generate Report
                </button>
              ) : (
                <button disabled className={classes.btnGenerateDisabled}>
                  Generate Report
                </button>
              )}
            </div>
          </div>
        </div>
      </Paper>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.paperHead}>
          <h3 className={classes.paperHeading}>Reports</h3>
          <div className={classes.controlsRow}>
            {idsToProcess.length ? (
              <button onClick={handleDownload} className={classes.btnDownload}>
                <DownloadIcon />
                Download
              </button>
            ) : (
              <button disabled className={classes.btnDownloadDisabled}>
                <DownloadIcon />
                Download
              </button>
            )}
            {idsToProcess.length ? (
              <button className={classes.btnDelete} onClick={handleDelete}>
                <DeleteIcon />
                Delete
              </button>
            ) : (
              <button disabled className={classes.btnDeleteDisabled}>
                <DeleteIcon />
                Delete
              </button>
            )}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </div>
        </div>
        <Divider />
        <div className={classes.paperFormReports}>
          {!isGettingReports ? (
            filteredReports.map((report) => {
              return (
                <ReportFileCard
                  reportName={report.fileName}
                  reportDate={formatShortDate(report.createdAt)}
                  handleCheck={handleSelectedCheckbox}
                  handleSingleFileDownload={handleSingleFileDownload}
                />
              );
            })
          ) : (
            <div className={classes.loadingGif}>
              <img width="100px" height="100px" src={rocketGif} alt="Loading" />
            </div>
          )}
          {!filteredReports.length &&
          !isGettingReports &&
          reports.length > 0 ? (
            <p className={classes.noReportText}>
              No reports with the given search text found.
            </p>
          ) : (
            <></>
          )}
          {!isGettingReports && reports.length === 0 ? (
            <p className={classes.noReportText}>No generated report found.</p>
          ) : (
            <></>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(PersonalReports);
