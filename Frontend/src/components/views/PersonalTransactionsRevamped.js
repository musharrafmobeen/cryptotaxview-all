import {
  Button,
  Divider,
  Paper,
  TextField,
  Checkbox,
  Avatar,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";

import { withStyles } from "@mui/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../resources/styles/views-styles/PersonalTransactionsStyles";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
import MenuItemCard from "../helpers/MenuItemCard";

import errorGif from "../../resources/design-images/error.gif";
import { useDispatch, useSelector } from "react-redux";
import AlertMessageDialog from "../helpers/AlertMessageDialog";
import { Grid } from "@mui/material";

import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { KeyboardArrowDownRounded } from "@material-ui/icons";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  syncDataBinance,
  syncDataCoinspot,
  syncDataSwyftx,
  syncDataCoinbase,
  syncDataMetamask,
  deleteTransaction,
  getAllTransactions,
  addTransaction,
  resetTransactionStates,
  resetTransactions,
  syncDataBitcoin,
  getAllTransactionsProfessional,
  resetTransactionStatesProfessional,
  deleteTransactionProfessional,
  syncDataCoinspotProfessional,
  syncDataBinanceProfessional,
  syncDataSwyftxProfessional,
  syncDataMetamaskProfessional,
  syncDataCoinbaseProfessional,
  syncDataBitcoinProfessional,
  addTransactionProfessional,
} from "../../store/transactions/transactions";
import { exchangesData } from "../../services/platform-integration-data";
import TransactionsTable from "../helpers/TransactionsTable";
import { SocketContext } from "../../contexts/socket";
import { useNavigate } from "react-router-dom";

import AddTransactionDialog from "../helpers/AddTransactionDialog";

import { setRefreshExchangesTrue } from "../../store/exchanges/exchanges";
import { ArrowBackIos } from "@mui/icons-material";
import Notifications from "../helpers/Notifications";

function PersonalTransactions(props) {
  const { classes } = props;
  const path = window.location.pathname.split("/");
  const binanceData = useSelector(
    (state) => state.entities.transactions.binance
  );
  const swyftxData = useSelector((state) => state.entities.transactions.swyftx);
  const coinbaseData = useSelector(
    (state) => state.entities.transactions.coinbase
  );
  const coinspotData = useSelector(
    (state) => state.entities.transactions.coinspot
  );
  const isErrorBinance = useSelector(
    (state) => state.entities.transactions.isErrorBinance
  );
  const isErrorCoinbase = useSelector(
    (state) => state.entities.transactions.isErrorCoinbase
  );
  const isErrorSwyftx = useSelector(
    (state) => state.entities.transactions.isErrorSwyftx
  );
  const isErrorCSV = useSelector(
    (state) => state.entities.transactions.isError
  );
  const isErrorCoinspot = useSelector(
    (state) => state.entities.transactions.isErrorCoinspot
  );
  const isSyncingBinance = useSelector(
    (state) => state.entities.transactions.isSyncingBinance
  );
  const isSyncingCoinspot = useSelector(
    (state) => state.entities.transactions.isSyncingCoinSpot
  );
  const isSyncingCoinBase = useSelector(
    (state) => state.entities.transactions.isSyncingCoinBase
  );
  const isSyncingSwyftx = useSelector(
    (state) => state.entities.transactions.isSyncingSwyftx
  );
  const refreshTransactions = useSelector(
    (state) => state.entities.transactions.refreshTransactions
  );
  const allTransactions = useSelector(
    (state) => state.entities.transactions.allTransactions
  );

  const errorTransactionsCount = useSelector(
    (state) => state.entities.transactions.errorTransactionsCount
  );
  const totalCount = useSelector(
    (state) => state.entities.transactions.totalCount
  );
  const uniqueCoins = useSelector(
    (state) => state.entities.transactions.uniqueCoins
  );
  const addTransactionsSuccess = useSelector(
    (state) => state.entities.transactions.addTransactionRequestSuccess
  );
  const resetToDefaultSuccess = useSelector(
    (state) => state.entities.transactions.resetToDefaultSuccess
  );
  const isResettingToDefault = useSelector(
    (state) => state.entities.transactions.isResettingToDefault
  );
  const isReCalculatingCGT = useSelector(
    (state) => state.entities.transactions.reCalculatingCGT
  );
  const userFileNames = useSelector(
    (state) => state.entities.transactions.userFiles
  );

  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);

  const [snackNotification, setSnackNotification] = useState("");
  const [notificationSnack, setNotificationSnack] = useState(false);
  const [isAlertOpen, setIsALertOpen] = useState(false);
  const [idsToProcess, setIdsToProcess] = useState([]);
  const [rowItemMenuAnchor, setRowItemMenuAnchor] = useState(null);
  const [CSVUploadError, setCSVUploadError] = useState(false);
  const [CSVUploadSuccess, setCSVUploadSuccess] = useState(false);
  const [rowStart, setRowStart] = useState(1);
  const [rowPerPage, setRowPerPage] = useState("10");
  const [rowPerPageSelectOpen, setRowPerPageSelectOpen] = useState(false);
  const [exchangeFilter, setExchangeFilter] = useState("allWallets");
  const [exchangeFilterSelectOpen, setExchangeFilterSelectOpen] =
    useState(false);
  const [currencyFilter, setCurrencyFilter] = useState("allCurrencies");
  const [currencyFilterSelectOpen, setCurrencyFilterSelectOpen] =
    useState(false);
  const [dataSourceFilter, setDataSourceFilter] = useState("allDataSources");
  const [dataSourceFilterSelectOpen, setDataSourceFilterSelectOpen] =
    useState(false);
  const [errorTypeFilter, setErrorTypeFilter] = useState("noErrorType");
  const [errorTypeFilterSelectOpen, setErrorTypeFilterSelectOpen] =
    useState(false);
  const [fileNameFilter, setFileNameFilter] = useState("allFiles");
  const [fileNameFilterSelectOpen, setFileNameFilterSelectOpen] =
    useState(false);
  const [moreFiltersSelected, setMoreFiltersSelected] = useState(false);
  const [openDateRangeFilter, setOpenDateRangeFilter] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [startDateFilterServer, setStartDateFilterServer] = useState(null);
  const [endDateFilterServer, setEndDateFilterServer] = useState(null);
  const [isErrorFilterTransactions, setIsErrorFilterTransactions] =
    useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAlertOpenResetToDefault, setIsAlertOpenResetToDefault] =
    useState(false);
  const [isSyncDataErrorDialogShow, setIsSyncDataErrorDialogShow] =
    useState(false);

  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef();
  const ref2 = useRef();

  useEffect(() => {
    if (
      binanceData.length === 0 &&
      swyftxData.length === 0 &&
      coinbaseData.length === 0 &&
      coinspotData.length === 0 &&
      allTransactions.length === 0
    ) {
      setIsSyncDataErrorDialogShow(true);
    } else setIsSyncDataErrorDialogShow(false);
  }, [isSyncingBinance, isSyncingCoinBase, isSyncingCoinspot, isSyncingSwyftx]);

  useEffect(() => {
    if (notificationSnack) {
      if (isPersonalPlan)
        dispatch(getAllTransactions(rowPerPage, Number(rowStart) - 1));
      else
        dispatch(
          getAllTransactionsProfessional(
            rowPerPage,
            Number(rowStart) - 1,
            undefined,
            path[path.length - 1]
          )
        );
    }
  }, [notificationSnack]);

  useEffect(() => {
    setIsSyncDataErrorDialogShow(false);
    if (allTransactions.length === 0) {
      if (isPersonalPlan)
        dispatch(getAllTransactions(rowPerPage, Number(rowStart) - 1));
      else {
        dispatch(
          getAllTransactionsProfessional(
            rowPerPage,
            Number(rowStart) - 1,
            undefined,
            path[path.length - 1]
          )
        );
      }
    }

    socket.on("notification", (notification) => {
      handleNotification(notification);
    });
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    let filterObject = {};
    if (exchangeFilter !== "allWallets")
      filterObject = {
        ...filterObject,
        exchange: exchangeFilter,
      };
    if (currencyFilter !== "allCurrencies")
      filterObject = { ...filterObject, symbol: currencyFilter };
    if (startDateFilter !== null && endDateFilter != null)
      filterObject = {
        ...filterObject,
        from: startDateFilterServer,
        to: endDateFilterServer,
      };
    if (isErrorFilterTransactions)
      filterObject = { ...filterObject, isError: isErrorFilterTransactions };
    if (dataSourceFilter !== "allDataSources")
      filterObject = { ...filterObject, source: dataSourceFilter };
    if (errorTypeFilter === "pricingError")
      filterObject = { ...filterObject, priceInAud: 0 };
    if (errorTypeFilter === "holdingError")
      filterObject = { ...filterObject, holdingsError: true };
    if (fileNameFilter !== "allFiles")
      filterObject = { ...filterObject, fileName: fileNameFilter };
    if (isPersonalPlan)
      dispatch(
        getAllTransactions(rowPerPage, Number(rowStart) - 1, filterObject)
      );
    else
      dispatch(
        getAllTransactionsProfessional(
          rowPerPage,
          Number(rowStart) - 1,
          filterObject,
          path[path.length - 1]
        )
      );
  }, [
    rowPerPage,
    rowStart,
    startDateFilter,
    endDateFilter,
    exchangeFilter,
    currencyFilter,
    isErrorFilterTransactions,
    dataSourceFilter,
    errorTypeFilter,
    fileNameFilter,
    refreshTransactions,
  ]);

  socket.on("notifyClient", (notification) => {
    handleNotification(notification.notification);
  });

  const rowPerPageOptions = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const handleNextPage = () => {
    const newRowStart = Number(rowStart) + Number(rowPerPage);
    if (newRowStart < totalCount) setRowStart(newRowStart);
  };
  const handlePrevPage = () => {
    const newRowStart = Number(rowStart) - Number(rowPerPage);
    if (newRowStart < 1) setRowStart(1);
    else setRowStart(newRowStart);
  };
  const handleNotificationSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationSnack(false);
  };
  const handleNotification = (notification) => {
    setSnackNotification(notification);
    setNotificationSnack(true);
  };
  const handelCSVUploadClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCSVUploadSuccess(false);
  };
  const handelSyncTransactionsClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSyncDataErrorDialogShow(false);
  };
  const handelResetState = () => {
    dispatch(resetTransactionStates());
    // if (isPersonalPlan) dispatch(resetTransactionStates());
    // else dispatch(resetTransactionStatesProfessional(path[path.length - 1]));
  };
  const handelCSVUploadCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCSVUploadError(false);
  };
  const handleDeleteAlertClose = () => {
    setIsALertOpen(false);
  };
  const handleDeleteYes = () => {
    if (isPersonalPlan) dispatch(deleteTransaction(idsToProcess));
    else
      dispatch(
        deleteTransactionProfessional(idsToProcess, path[path.length - 1])
      );
    setIdsToProcess([]);
    setIsALertOpen(false);
  };
  const handleSyncData = () => {
    if (isPersonalPlan) {
      dispatch(syncDataCoinspot("coinspot"));
      dispatch(syncDataBinance("binance"));
      dispatch(syncDataSwyftx("swyftx"));
      dispatch(syncDataMetamask("metamask"));
      dispatch(syncDataCoinbase("coinbase"));
      dispatch(syncDataBitcoin("bitcoin"));
    } else {
      dispatch(syncDataCoinspotProfessional("coinspot", path[path.length - 1]));
      dispatch(syncDataBinanceProfessional("binance", path[path.length - 1]));
      dispatch(syncDataSwyftxProfessional("swyftx", path[path.length - 1]));
      dispatch(syncDataMetamaskProfessional("metamask", path[path.length - 1]));
      dispatch(syncDataCoinbaseProfessional("coinbase", path[path.length - 1]));
      dispatch(syncDataBitcoinProfessional("bitcoin", path[path.length - 1]));
    }
  };
  const openDeleteAlert = () => {
    setIsALertOpen(true);
  };
  const handleResetToDefaultClose = () => {
    setIsAlertOpenResetToDefault(false);
  };
  const handleResetToDefaultDeleteYes = () => {
    if (isPersonalPlan) dispatch(resetTransactions());
    else dispatch(resetTransactionStatesProfessional(path[path.length - 1]));
    setIsAlertOpenResetToDefault(false);
  };
  const moreMenuItems = [
    {
      text: "Delete",
      onClick: openDeleteAlert,
    },
  ];
  const handleDeleteIds = (ids) => {
    setIdsToProcess(ids);
  };
  const handleNoDataToast = () => {
    navigate("/integrations");
    dispatch(changeSubNavBar("integrations"));
  };

  const handleClickOutside = (event) => {
    // console.log("ref-target", event.target, ref.current);

    if (
      ref.current &&
      ref2.current &&
      !ref.current.contains(event.target) &&
      !ref2.current.contains(event.target)
    ) {
      setMoreFiltersSelected(false);
    }
  };
  const handleAddDialogCancel = () => {
    setIsAddDialogOpen(false);
  };
  const handleAddDialogYes = (
    transactionExchange,
    transactionDate,
    transactionSide,
    transactionAssetTraded,
    transactionAssetTradedQty,
    transactionAssetReceived,
    transactionAssetReceivedQty,
    transactionFee,
    transactionFeeCoin
  ) => {
    let dataObj = {};
    if (transactionSide === "buy" || transactionSide === "receive") {
      dataObj = {
        symbol: `${transactionAssetReceived + "/" + transactionAssetTraded}`,
        exchange: transactionExchange,
        price: Number(transactionAssetTradedQty / transactionAssetReceivedQty),
        amount: Number(transactionAssetReceivedQty),
        cost: Number(transactionAssetTradedQty),
        datetime: transactionDate,
        side: transactionSide,
        fee: { cost: Number(transactionFee), currency: transactionFeeCoin },
      };
    } else {
      dataObj = {
        symbol: `${transactionAssetTraded + "/" + transactionAssetReceived}`,
        exchange: transactionExchange,
        price: Number(transactionAssetReceivedQty / transactionAssetTradedQty),
        amount: Number(transactionAssetTradedQty),
        cost: Number(transactionAssetReceivedQty),
        datetime: transactionDate,
        side: transactionSide,
        fee: { cost: Number(transactionFee), currency: transactionFeeCoin },
      };
    }
    if (isPersonalPlan) dispatch(addTransaction(dataObj));
    else dispatch(addTransactionProfessional(dataObj, path[path.length - 1]));
    dispatch(setRefreshExchangesTrue());
    setIsAddDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <Notifications
        type="warning"
        open={isReCalculatingCGT}
        message={"Recalculating CGT!"}
        onClose={() => {}}
      />
      <Notifications
        open={isSyncDataErrorDialogShow}
        onClose={handelSyncTransactionsClose}
        message={
          "Exchange keys are not connected OR data is not available currently from exchange!"
        }
        type="error"
      />
      <Notifications
        open={isResettingToDefault}
        message={"Resetting transactions to initial state!"}
        type="warning"
        onClose={() => {}}
      />

      <Notifications
        open={resetToDefaultSuccess}
        onClose={handelResetState}
        message={"Transactions are reset successfully!"}
        type="success"
      />
      <Notifications
        open={addTransactionsSuccess}
        onClose={handelResetState}
        message={"Transaction is added successfully!"}
        type="success"
      />
      <Notifications
        open={CSVUploadSuccess}
        onClose={handelCSVUploadClose}
        message={"CSV uploaded successfully!"}
        type="success"
      />
      <Notifications
        open={CSVUploadError}
        onClose={handelCSVUploadCloseError}
        message={"Something went down at the server. Please try again later.!"}
        type="error"
      />
      <Notifications
        open={
          isErrorBinance ||
          isErrorCoinbase ||
          isErrorSwyftx ||
          isErrorCoinspot ||
          isErrorCSV
        }
        message={"Something went down at the server. Please try again later.!"}
        onClose={() => {}}
      />

      <Notifications
        open={notificationSnack && snackNotification === "Syncing"}
        onClose={handleNotificationSnackClose}
        message={snackNotification}
        type="warning"
        disableAutoClose
      />
      <Notifications
        open={notificationSnack && snackNotification !== "Syncing"}
        onClose={handleNotificationSnackClose}
        message={snackNotification}
        type="success"
      />
      <Paper className={classes.content} elevation={0}>
        {isPersonalPlan ? (
          <div className={classes.headRow}>
            <div className={classes.buttonGroup}>
              <Button
                className={classes.actionButton}
                onClick={(e) => {
                  setIsAlertOpenResetToDefault(!isAlertOpenResetToDefault);
                }}
              >
                Reset
              </Button>
              {idsToProcess.length ? (
                <Button
                  className={classes.actionButton}
                  onClick={openDeleteAlert}
                >
                  <DeleteIcon />
                </Button>
              ) : (
                <Button
                  className={classes.actionButtonDisabled}
                  onClick={openDeleteAlert}
                  disabled
                >
                  <DeleteIcon />
                </Button>
              )}
              {!isSyncingBinance &&
              !isSyncingCoinBase &&
              !isSyncingCoinspot &&
              !isSyncingSwyftx ? (
                <Button
                  className={classes.actionButton}
                  onClick={handleSyncData}
                >
                  Sync
                </Button>
              ) : (
                <Button className={classes.actionButtonDisabled}>Sync</Button>
              )}

              <Button
                className={classes.actionButton}
                onClick={(e) => {
                  setIsAddDialogOpen(true);
                }}
              >
                Add
              </Button>
            </div>
            <div className={classes.filtersGroup}>
              <div className={classes.allWalletsSelect}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={exchangeFilter}
                  onChange={(e) => {
                    setExchangeFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setExchangeFilterSelectOpen(!exchangeFilterSelectOpen)
                  }
                  open={exchangeFilterSelectOpen}
                >
                  <MenuItem value="allWallets">All Wallets</MenuItem>
                  {exchangesData.map((option) => {
                    return (
                      <MenuItem
                        value={option.name}
                        className={classes.capitalize}
                      >
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className={classes.allCurrenciesSelect}>
                {" "}
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={currencyFilter}
                  onChange={(e) => {
                    setCurrencyFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setCurrencyFilterSelectOpen(!currencyFilterSelectOpen)
                  }
                  open={currencyFilterSelectOpen}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 350 } } }}
                >
                  <MenuItem value="allCurrencies">All Currencies</MenuItem>
                  {uniqueCoins.map((option) => {
                    return (
                      <MenuItem
                        value={option.value}
                        className={classes.capitalize}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className={classes.allDataSourceSelect}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={dataSourceFilter}
                  onChange={(e) => {
                    setDataSourceFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setDataSourceFilterSelectOpen(!dataSourceFilterSelectOpen)
                  }
                  open={dataSourceFilterSelectOpen}
                >
                  <MenuItem value="allDataSources">All Sources</MenuItem>

                  <MenuItem value={"csv"} className={classes.capitalize}>
                    CSV
                  </MenuItem>
                  <MenuItem value={"api"} className={classes.capitalize}>
                    API
                  </MenuItem>
                </Select>
              </div>
              <div className={classes.allErrorsSelect}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={errorTypeFilter}
                  onChange={(e) => {
                    setErrorTypeFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setErrorTypeFilterSelectOpen(!errorTypeFilterSelectOpen)
                  }
                  open={errorTypeFilterSelectOpen}
                >
                  <MenuItem value="noErrorType">Error Type</MenuItem>

                  <MenuItem
                    value={"pricingError"}
                    className={classes.capitalize}
                  >
                    Pricing Error
                  </MenuItem>
                  <MenuItem
                    value={"holdingError"}
                    className={classes.capitalize}
                  >
                    Holding Error
                  </MenuItem>
                </Select>
              </div>
              <div className={classes.fileTypeSelect}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={fileNameFilter}
                  onChange={(e) => {
                    setFileNameFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setFileNameFilterSelectOpen(!fileNameFilterSelectOpen)
                  }
                  open={fileNameFilterSelectOpen}
                >
                  <MenuItem value="allFiles">All Files</MenuItem>

                  {userFileNames.map((file) => (
                    <MenuItem value={file}>{file}</MenuItem>
                  ))}
                </Select>
              </div>
              {/* <div className={classes.resetToDefault}>
              {" "}
              <p>Reset to default</p>
            </div> */}

              <div
                className={`${
                  moreFiltersSelected
                    ? classes.moreFiltersIconContainerActive
                    : classes.moreFiltersIconContainerInActive
                }`}
                onClick={() => {
                  setMoreFiltersSelected(!moreFiltersSelected);
                }}
              >
                {moreFiltersSelected ? (
                  <>
                    <div className={classes.moreFilterIcon}>
                      <FilterAltIcon />
                    </div>
                    <div className={classes.moreFilterText}>Filters</div>
                  </>
                ) : (
                  <>
                    <div className={classes.moreFilterIcon}>
                      <FilterAltOutlinedIcon />
                    </div>
                    <div className={classes.moreFilterText}>Filters</div>
                  </>
                )}
              </div>
              {moreFiltersSelected ? (
                <div className={classes.dataFilter}>
                  <div className={classes.isErrorContainer}>
                    <div className={classes.isErrorCheckbox}>
                      <Checkbox
                        checked={isErrorFilterTransactions}
                        onClick={(e) => {
                          setIsErrorFilterTransactions(
                            !isErrorFilterTransactions
                          );
                        }}
                      />
                    </div>
                    <div className={classes.isErrorText}>Errors</div>
                  </div>
                  <div
                    className={`${
                      openDateRangeFilter
                        ? classes.dateRangeFilterButtonActive
                        : classes.dateRangeFilterButtonInActive
                    }`}
                    onClick={(e) => {
                      setOpenDateRangeFilter(!openDateRangeFilter);
                    }}
                  >
                    Date Range
                  </div>
                  {openDateRangeFilter ? (
                    <div className={classes.dateRangeModal}>
                      <div className={classes.dateRangePicker}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <div className={classes.datePickerStartDateComponent}>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="Start Date"
                              value={startDateFilter}
                              onChange={(newValue) => {
                                setStartDateFilter(newValue);
                                // console.log("date-before", newValue);
                                const day = new Date(newValue).getDate() + 1;
                                const month = new Date(newValue).getMonth() + 1;
                                const year = new Date(newValue).getFullYear();

                                const refDate = new Date(
                                  `${month}/${day}/${year}`
                                );

                                setStartDateFilterServer(refDate);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </div>
                        </LocalizationProvider>
                      </div>

                      <div className={classes.dateRangePicker}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            label="End Date"
                            value={endDateFilter}
                            onChange={(newValue) => {
                              setEndDateFilter(newValue);
                              const day = new Date(newValue).getDate() + 2;
                              const month = new Date(newValue).getMonth() + 1;
                              const year = new Date(newValue).getFullYear();
                              const refDate = new Date(
                                `${month}/${day}/${year}`
                              ).toISOString();
                              setEndDateFilterServer(refDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
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
              <Button
                className={classes.btnHeadProfessional}
                onClick={(e) => {
                  setIsAddDialogOpen(true);
                }}
              >
                Add
              </Button>
              {!isSyncingBinance &&
              !isSyncingCoinBase &&
              !isSyncingCoinspot &&
              !isSyncingSwyftx ? (
                <Button
                  className={classes.btnHeadProfessional}
                  onClick={handleSyncData}
                >
                  Sync
                </Button>
              ) : (
                <Button className={classes.btnHeadProfessionalDisabled}>
                  Sync
                </Button>
              )}
              {idsToProcess.length ? (
                <Button
                  className={classes.btnHeadProfessional}
                  onClick={openDeleteAlert}
                >
                  <DeleteIcon />
                </Button>
              ) : (
                <></>
              )}
              <Button
                className={classes.btnHeadProfessional}
                onClick={(e) => {
                  setIsAlertOpenResetToDefault(!isAlertOpenResetToDefault);
                }}
              >
                Reset
              </Button>
              <div className={classes.selectProfessional}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={exchangeFilter}
                  onChange={(e) => {
                    setExchangeFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setExchangeFilterSelectOpen(!exchangeFilterSelectOpen)
                  }
                  open={exchangeFilterSelectOpen}
                >
                  <MenuItem value="allWallets">All Wallets</MenuItem>
                  {exchangesData.map((option) => {
                    return (
                      <MenuItem
                        value={option.name}
                        className={classes.capitalize}
                      >
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className={classes.selectProfessional}>
                {" "}
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={currencyFilter}
                  onChange={(e) => {
                    setCurrencyFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setCurrencyFilterSelectOpen(!currencyFilterSelectOpen)
                  }
                  open={currencyFilterSelectOpen}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 350 } } }}
                >
                  <MenuItem value="allCurrencies">All Currencies</MenuItem>
                  {uniqueCoins.map((option) => {
                    return (
                      <MenuItem
                        value={option.value}
                        className={classes.capitalize}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className={classes.selectProfessional}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={dataSourceFilter}
                  onChange={(e) => {
                    setDataSourceFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setDataSourceFilterSelectOpen(!dataSourceFilterSelectOpen)
                  }
                  open={dataSourceFilterSelectOpen}
                >
                  <MenuItem value="allDataSources">All Sources</MenuItem>

                  <MenuItem value={"csv"} className={classes.capitalize}>
                    CSV
                  </MenuItem>
                  <MenuItem value={"api"} className={classes.capitalize}>
                    API
                  </MenuItem>
                </Select>
              </div>
              <div className={classes.selectProfessional}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={errorTypeFilter}
                  onChange={(e) => {
                    setErrorTypeFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setErrorTypeFilterSelectOpen(!errorTypeFilterSelectOpen)
                  }
                  open={errorTypeFilterSelectOpen}
                >
                  <MenuItem value="noErrorType">Error Type</MenuItem>

                  <MenuItem
                    value={"pricingError"}
                    className={classes.capitalize}
                  >
                    Pricing Error
                  </MenuItem>
                  <MenuItem
                    value={"holdingError"}
                    className={classes.capitalize}
                  >
                    Holding Error
                  </MenuItem>
                </Select>
              </div>
              <div className={classes.selectProfessional}>
                <Select
                  IconComponent={() => (
                    <KeyboardArrowDownRounded className="select-icon" />
                  )}
                  value={fileNameFilter}
                  onChange={(e) => {
                    setFileNameFilter(e.target.value);
                  }}
                  className="custom-select"
                  onClick={() =>
                    setFileNameFilterSelectOpen(!fileNameFilterSelectOpen)
                  }
                  open={fileNameFilterSelectOpen}
                >
                  <MenuItem value="allFiles">All Files</MenuItem>

                  {userFileNames.map((file) => (
                    <MenuItem value={file}>{file}</MenuItem>
                  ))}
                </Select>
              </div>
              {/* <button
                className={classes.btnAddHeadProfessional}
                onClick={openIntegrationDialog}
              >
                <h3>+ Add Integration</h3>
              </button>
              <h3 className={classes.labelProfessional}>Sort By</h3>
              <select
                className={classes.select}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
              >
                {sortByValues.map((sortByValue) => (
                  <option value={sortByValue.value}>{sortByValue.label}</option>
                ))}
              </select> */}
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
        <Divider className={classes.divider} />

        {allTransactions.length ? (
          <>
            {errorTransactionsCount > 0 ? (
              <Grid container className="custom-container-full-width">
                <Grid item xs={12}>
                  <div
                    className="transactions-error-banner-container"
                    onClick={(e) => {
                      setMoreFiltersSelected(!moreFiltersSelected);
                      setIsErrorFilterTransactions(!isErrorFilterTransactions);
                    }}
                  >
                    <img
                      width="40px"
                      height="40px"
                      src={errorGif}
                      alt="error-gif"
                    />
                    <div className="transactions-error-banner-text">
                      {errorTransactionsCount > 1
                        ? errorTransactionsCount +
                          " transactions require your attention! Click here to view"
                        : errorTransactionsCount +
                          " transaction require your attention! Click here to view"}
                    </div>
                  </div>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}

            <TransactionsTable
              transactions={allTransactions}
              handleDeleteIds={handleDeleteIds}
            />
          </>
        ) : (
          <div className={classes.noData} onClick={handleNoDataToast}>
            <h3>No data, integrate exchange</h3>
          </div>
        )}
        {allTransactions.length ? (
          <Grid
            container
            className="custom-container-full-width pagination-container"
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <div className="row-per-page-text"> Rows Per Page</div>
            <div className="row-per-page-select-box">
              <Select
                IconComponent={() => (
                  <KeyboardArrowDownRounded className="select-icon" />
                )}
                value={rowPerPage}
                onChange={(e) => {
                  setRowPerPage(e.target.value);
                  setRowStart(1);
                }}
                className="custom-select"
                onClick={() => setRowPerPageSelectOpen(!rowPerPageSelectOpen)}
                open={rowPerPageSelectOpen}
              >
                {rowPerPageOptions.map((option) => {
                  return (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                  );
                })}
              </Select>
            </div>
            <div className="row-per-page-details">
              <p>
                {rowStart +
                  "-" +
                  `${
                    Number(rowPerPage) + Number(rowStart) > totalCount
                      ? totalCount
                      : Number(rowPerPage) + Number(rowStart) - 1
                  }` +
                  " of " +
                  totalCount}
              </p>
            </div>
            {rowStart !== 1 ? (
              <div className="row-per-page-arrow-back" onClick={handlePrevPage}>
                <ArrowBackIosRoundedIcon />
              </div>
            ) : (
              <div className="row-per-page-arrow-back">
                <ArrowBackIosRoundedIcon color="disabled" />
              </div>
            )}
            {Number(rowPerPage) + Number(rowStart) < totalCount ? (
              <div className="row-per-page-arrow-fwd" onClick={handleNextPage}>
                <ArrowForwardIosRoundedIcon />
              </div>
            ) : (
              <div className="row-per-page-arrow-fwd">
                <ArrowForwardIosRoundedIcon color="disabled" />
              </div>
            )}
          </Grid>
        ) : (
          <></>
        )}
      </Paper>
      <MenuItemCard
        menuItems={moreMenuItems}
        menuAnchor={rowItemMenuAnchor}
        setMenuAnchor={setRowItemMenuAnchor}
      />
      <AlertMessageDialog
        openAlert={isAlertOpen}
        title={"Delete"}
        content={"Are you sure you want to delete this transaction?"}
        handleCancel={handleDeleteAlertClose}
        handleYes={handleDeleteYes}
        yesText={"Delete"}
      />
      <AlertMessageDialog
        openAlert={isAlertOpenResetToDefault}
        title={"Reset to initial state"}
        content={
          "Are you sure you want to reset all transactions? All manually added transactions will be removed!"
        }
        handleCancel={handleResetToDefaultClose}
        handleYes={handleResetToDefaultDeleteYes}
        yesText={"Reset"}
      />
      <AddTransactionDialog
        openAlert={isAddDialogOpen}
        handleCancel={handleAddDialogCancel}
        handleYes={handleAddDialogYes}
      />
    </div>
  );
}

export default withStyles(styles)(PersonalTransactions);
