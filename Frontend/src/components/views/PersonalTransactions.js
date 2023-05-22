import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  InputLabel,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import styles from "../../resources/styles/views-styles/PersonalTransactionsStyles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItemCard from "../helpers/MenuItemCard";
// import { getCurrencyIcon } from "../../services/crypto-currency-exchange-icon";
import TransactionDataIntegrationModal from "../helpers/transactions-data-integration/TransactionDataIntegrationModal";
import TransactionFileImportModal from "../helpers/transactions-data-integration/TransactionFileImportModal";
import axios from "axios";
import configData from "../../config.json";
import { useDispatch, useSelector } from "react-redux";
import AlertMessageDialog from "../helpers/AlertMessageDialog";
import coinspotImage from "../../resources/design-images/coinspot-image.svg";

import {
  changeTransactionState,
  transactionsRequestStart,
  transactionsRequestFailed,
  getCoinspotTransactions,
  getSwyftxTransactions,
  getBinanceTransactions,
  syncDataBinance,
  syncDataCoinspot,
  syncDataSwyftx,
  syncDataCoinBase,
  changeExchangeState,
  changeAlgoState,
  changeCoinspotTransactionState,
  deleteTransaction,
  getCSVTransactions,
} from "../../store/transactions/transactions";
import { formatDate } from "../../services/date-formatter";
const baseUrl = configData.url.baseURL;

function PersonalTransactions(props) {
  // const transactions = useSelector((state) => state.transaction.list);
  const { classes } = props;
  // console.log("Transactions", transactions);

  const coinspotTransactions = useSelector(
    (state) => state.entities.transactions.coinspot
  );
  const swyftxTransactions = useSelector(
    (state) => state.entities.transactions.swyftx
  );

  const binanceTransactions = useSelector(
    (state) => state.entities.transactions.binance
  );
  const exchangeFilter = useSelector(
    (state) => state.entities.transactions.exchange
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

  const filterByAlgo = useSelector((state) => state.entities.transactions.algo);

  useEffect(() => {
    // console.log("coinspotTransactions.length", coinspotTransactions.length);
    if (coinspotTransactions.length === 0)
      dispatch(getCoinspotTransactions("/" + filterByAlgo));

    // console.log("Filter", filterByAlgo);
  }, []);

  useEffect(() => {
    if (swyftxTransactions.length === 0)
      dispatch(getSwyftxTransactions("/" + filterByAlgo));
  }, []);

  useEffect(() => {
    if (binanceTransactions.length === 0)
      dispatch(getBinanceTransactions("/" + filterByAlgo));
  }, []);

  useEffect(() => {
    dispatch(getCSVTransactions());
  }, []);
  // useEffect(() => {
  //jik
  //   let data = coinspotTransactions;
  //   data.map((data) => {
  //     data["Errors"] = 0;
  //     data["exchange"] = "CoinSpot";
  //     return true;
  //   });
  //   dispatch(changeCoinspotTransactionState(data));
  // }, [coinspotTransactions]);

  const isLoading = useSelector((state) => state.entities.transactions.loading);
  const isLoadingCoinspot = useSelector(
    (state) => state.entities.transactions.isLoadingCoinspot
  );
  const isLoadingSwyftx = useSelector(
    (state) => state.entities.transactions.isLoadingSwyftx
  );
  const isLoadingBinance = useSelector(
    (state) => state.entities.transactions.isLoadingBinance
  );
  const isLoadingCoinbase = useSelector(
    (state) => state.entities.transactions.isLoadingCoinbase
  );
  /**
   * State and helper functions for integration modal.
   */
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [isAlertOpen, setIsALertOpen] = useState(false);
  const handleDeleteAlertColse = () => {
    setIsALertOpen(false);
    // setIdsToProcess(null);
  };
  const handleDeleteYes = () => {
    dispatch(deleteTransaction(idsToProcess));
    setIsALertOpen(false);
    // setIdsToProcess(null);
  };
  const handleIntegrationModalClose = () => {
    setIntegrationDialogOpen(false);
  };
  const handleIntegrationModalImportFile = () => {
    setIntegrationDialogOpen(false);
    setFileImportDialogOpen(true);
  };
  const handleIntegrationModalImportSync = () => {
    setIntegrationDialogOpen(false);
  };

  const handleFilterExchangeChange = (e) => {
    dispatch(changeExchangeState(e.target.value));
  };
  const handleFilterAlgoChange = (e) => {
    dispatch(changeAlgoState(e.target.value));
  };

  /**
   * Method for handle button click to open modal.
   */
  const openIntegrationDialog = () => {
    setIntegrationDialogOpen(true);
  };

  //end of relative code for integration modal.
  //****************************************************************************
  /**
   * State and helper functions for file import modal.
   */
  const [fileImportDialogOpen, setFileImportDialogOpen] = useState(false);
  const [importedFile, setFImportedFile] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [idsToProcess, setIdsToProcess] = useState([]);
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const dispatch = useDispatch();

  const handelDateSort = () => {
    coinspotTransactions.sort((a, b) => a.datetime - b.datetime);
  };

  const handleFileImportDialogClose = () => {
    setFImportedFile(null);
    setFileImportDialogOpen(false);
  };

  const handleFileImportDialogBackClick = () => {
    setFImportedFile(null);
    setFileImportDialogOpen(false);
    setIntegrationDialogOpen(true);
  };

  const handleSyncData = () => {
    dispatch(syncDataCoinspot("coinspot"));
    dispatch(syncDataBinance("binance"));
    dispatch(syncDataSwyftx("swyftx"));
    dispatch(syncDataCoinBase("coinbase"));
  };

  const handleFileImported = () => {
    let formData = new FormData();
    let token = "bearer " + localStorage.getItem("token");
    formData.append("file", importedFile);
    dispatch(transactionsRequestStart());
    axios
      .post(`${baseUrl}/order-history-import/upload/Coinspot`, formData, {
        headers: { authorization: token },
      })
      .then((res) => {
        // alert("File uploaded");
        let reconstructedData = res.data;
        reconstructedData.map((data) => {
          data["Errors"] = 0;
          // data["exchange"] = "CoinSpot";
          return true;
        });
        dispatch(changeTransactionState({ transactions: reconstructedData }));
        dispatch(getCSVTransactions());
        setCSVUploadError(false);
        setCSVUploadSuccess(true);
      })
      .catch((err) => {
        dispatch(transactionsRequestFailed({ message: err }));
        setCSVUploadError(true);
      });
    setFileImportDialogOpen(false);
  };

  //end of relative code for file import modal.
  /*******************************************************************************

  /**
   * State and helper function(s) for Menu to be shown on more icon click in every data row.
   */
  const [rowItemMenuAnchor, setRowItemMenuAnchor] = useState(null);

  const showRowItemMenu = (e) => {
    setRowItemMenuAnchor(e.currentTarget);
  };
  const refreshTransactions = useSelector(
    (state) => state.entities.transactions.refreshTransactions
  );

  const [CSVUploadError, setCSVUploadError] = useState(false);
  const [CSVUploadSuccess, setCSVUploadSuccess] = useState(false);

  const handleCheckBox = (transactionsId) => {
    console.log(transactionsId);
  };
  const handleCheckAllBox = () => {
    setAllRowsSelected(!allRowsSelected);
  };

  const deleteMultipleTransactions = () => {
    dispatch(deleteTransaction(idsToProcess));
  };
  //End of relative code for Menu card.
  //****************************************************************************
  const csvData = useSelector(
    (state) => state.entities.transactions.csvTransactions
  );

  // const data = [
  //   { ...dummyRow, id: 0 },
  //   { ...dummyRow, id: 1 },
  //   { ...dummyRow, id: 2 },
  //   {
  //     ...dummyRow,
  //     id: 3,
  //     exchange: "Binance",
  //     exchangeSymbol: "bnb",
  //     assetTraded: "0.000242 ADA",
  //     assetReceived: "0.000242 BTC",
  //     error: { message: "Error Occurred" },
  //     gain_loss: -601.7,
  //   },
  //   { ...dummyRow, id: 4 },
  //   { ...dummyRow, id: 5 },
  //   { ...dummyRow, id: 6 },
  //   { ...dummyRow, id: 7 },
  //   { ...dummyRow, id: 8 },
  //   { ...dummyRow, id: 9 },
  //   { ...dummyRow, id: 10 },
  //   { ...dummyRow, id: 11 },
  //   { ...dummyRow, id: 12 },
  //   {
  //     ...dummyRow,
  //     id: 13,
  //     exchange: "Binance",
  //     exchangeSymbol: "bnb",
  //     assetTraded: "0.000242 ADA",
  //     assetReceived: "0.000242 BOOTY",
  //     error: { message: "Error Occurred" },
  //     gain_loss: -601.7,
  //   },
  //   { ...dummyRow, id: 14 },
  //   { ...dummyRow, id: 15 },
  //   { ...dummyRow, id: 16 },
  //   { ...dummyRow, id: 17 },
  // ];
  const openDeleteAlert = () => {
    setIsALertOpen(true);
  };
  const moreMenuItems = [
    // {
    //   text: "Edit",
    //   onClick: () => {
    //     console.log("Edit Clicked.");
    //   },
    // },
    {
      text: "Delete",
      onClick: openDeleteAlert,
    },
  ];

  const isLoss = (gain_loss) => gain_loss < 0;
  const isError = (err) => err.length < 0;
  const renderTableRows = () => {
    const list = csvData.map((transaction) => (
      <TableRow
        key={transaction.id}
        component={Paper}
        elevation={0}
        className={`${classes.dataRow}`}
        // className={classes.dataRow}
      >
        <TableCell>
          <Checkbox
            onClick={(e) => {
              if (idsToProcess.filter((id) => id === transaction.id).length) {
                setIdsToProcess(
                  idsToProcess.filter((id) => id !== transaction.id)
                );
              } else setIdsToProcess([...idsToProcess, transaction.id]);
            }}
          />
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img src={getCurrencyIcon(transaction.exchangeSymbol)} />{" "}
            {transaction.exchange}
          </div> */}
          {transaction.exchange}
        </TableCell>
        <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
        <TableCell>{transaction.type}</TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetTraded.split(" ")[1])}
            />{" "}
            {transaction.assetTraded}
          </div> */}
          {transaction.type === "buy"
            ? transaction.cost + " " + transaction.market.split("/")[1]
            : transaction.amount + " " + transaction.market.split("/")[0]}
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetReceived.split(" ")[1])}
            />{" "}
            {transaction.assetReceived}
          </div> */}
          {transaction.type === "sell"
            ? transaction.cost + " " + transaction.market.split("/")[0]
            : transaction.amount + " " + transaction.market.split("/")[1]}
        </TableCell>
        <TableCell>{transaction.fee}</TableCell>
        <TableCell
          className={`${
            isLoss(transaction.CGT.fifo) ? classes.lossError : classes.gain
          }`}
        >
          {isLoss(transaction.CGT.fifo)
            ? `-$${Math.abs(transaction.CGT.fifo)} (L)`
            : `$${transaction.CGT.fifo} (G)`}
        </TableCell>
        {/* <TableCell
          className={isError(transaction.Errors) ? classes.lossError : ""}
        >
          {isError(transaction.Errors) ? transaction.error.message : "--"}
        </TableCell> */}
        <TableCell>
          <IconButton
            onClick={(e) => {
              setIdsToProcess([...idsToProcess, transaction.id]);
              showRowItemMenu(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
    return list;
  };

  const renderTable = (data) => {
    const list = data.map((transaction) => (
      <TableRow
        key={transaction.id}
        component={Paper}
        elevation={0}
        className={`${classes.dataRow}`}
        // className={classes.dataRow}
      >
        <TableCell>
          <Checkbox
            onClick={(e) => {
              if (idsToProcess.filter((id) => id === transaction.id).length) {
                setIdsToProcess(
                  idsToProcess.filter((id) => id !== transaction.id)
                );
              } else setIdsToProcess([...idsToProcess, transaction.id]);
            }}
          />
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img src={getCurrencyIcon(transaction.exchangeSymbol)} />{" "}
            {transaction.exchange}
          </div> */}
          {transaction.exchange}
        </TableCell>
        <TableCell>{formatDate(transaction.datetime)}</TableCell>
        <TableCell>{transaction.side}</TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetTraded.split(" ")[1])}
            />{" "}
            {transaction.assetTraded}
          </div> */}

          {transaction.side === "buy"
            ? transaction.cost + " " + transaction.symbol.split("/")[1]
            : transaction.amount + " " + transaction.symbol.split("/")[0]}
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetReceived.split(" ")[1])}
            />{" "}
            {transaction.assetReceived}
          </div> */}
          {transaction.side === "sell"
            ? transaction.cost + " " + transaction.symbol.split("/")[1]
            : transaction.amount + " " + transaction.symbol.split("/")[0]}
        </TableCell>
        <TableCell>{transaction.fee.cost}</TableCell>
        <TableCell
          className={`${
            isLoss(transaction.CGT.fifo) ? classes.lossError : classes.gain
          }`}
        >
          {isLoss(transaction.CGT.fifo)
            ? `-$${Math.abs(transaction.CGT.fifo)} (L)`
            : `$${transaction.CGT.fifo} (G)`}
        </TableCell>
        {/* <TableCell
          className={isError(transaction.Errors) ? classes.lossError : ""}
        >
          {isError(transaction.Errors) ? transaction.error.message : "--"}
        </TableCell> */}
        <TableCell>
          <IconButton
            onClick={(e) => {
              setIdsToProcess([...idsToProcess, transaction.id]);
              showRowItemMenu(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
    return list;
  };

  return (
    <div className={classes.root}>
      <Snackbar open={refreshTransactions} autoHideDuration={6000}>
        <Alert
          severity="success"
          sx={{ width: "100%", height: "50px", fontSize: "large" }}
        >
          Transaction Successfully Deleted!. Please refresh page to get your
          latest transactions with CGT
        </Alert>
      </Snackbar>

      <Snackbar open={CSVUploadSuccess} autoHideDuration={6000}>
        <Alert
          severity="success"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          CSV Uploaded Successfully
        </Alert>
      </Snackbar>

      <Snackbar open={CSVUploadError} autoHideDuration={6000}>
        <Alert
          severity="error"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          Something went down at the server. Please try again later.
        </Alert>
      </Snackbar>

      <Snackbar
        open={
          isErrorBinance ||
          isErrorCoinbase ||
          isErrorSwyftx ||
          isErrorCoinspot ||
          isErrorCSV
        }
        autoHideDuration={6000}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          Something went down at the server. Please try again later.
        </Alert>
      </Snackbar>

      <Paper className={classes.content} elevation={0}>
        <div className={classes.headRow}>
          {/* <Typography className={classes.heading}>
            Transaction History
          </Typography> */}
          <div className={classes.buttonGroup}>
            <Button className={classes.actionButton}>+ Add Transaction</Button>
            {/* <Button className={classes.actionButton}>Generate Report</Button> */}
            <Button
              className={classes.actionButton}
              onClick={openIntegrationDialog}
            >
              Import CSV Data
            </Button>
            {/* {console.log(
              isSyncingBinance,
              isSyncingCoinBase,
              isSyncingSwyftx,
              isSyncingCoinspot
            )} */}
            {!isSyncingBinance &&
            !isSyncingCoinBase &&
            !isSyncingCoinspot &&
            !isSyncingSwyftx ? (
              <Button className={classes.actionButton} onClick={handleSyncData}>
                Sync Data
              </Button>
            ) : (
              <Button className={classes.actionButtonDisabled}>
                Sync Data
              </Button>
            )}

            <Button className={classes.actionButton} onClick={openDeleteAlert}>
              <DeleteIcon />
            </Button>

            <InputLabel>Exchange</InputLabel>
            <Select
              value={exchangeFilter}
              label="Exchange"
              onChange={handleFilterExchangeChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="coinspot">CoinSpot</MenuItem>
              <MenuItem value="binance">Binance</MenuItem>
              <MenuItem value="swyftx">Swyftx</MenuItem>
            </Select>
            <InputLabel>Method</InputLabel>
            <Select
              value={filterByAlgo}
              label="Algo"
              onChange={handleFilterAlgoChange}
            >
              <MenuItem value="fifo">FIFO</MenuItem>
              <MenuItem value="lifo">LIFO</MenuItem>
            </Select>
          </div>
          <p className={classes.resetToDefault}>Reset to default</p>
        </div>
        <Divider className={classes.divider} />
        <div>
          <TableContainer
            classes={{ root: classes.customTableContainer }}
            className={classes.tableContainer}
          >
            <Table stickyHeader>
              <TableHead className={classes.tableHead}>
                <TableRow className={classes.headerRow}>
                  <TableCell>
                    <Checkbox
                      style={{ color: "white" }}
                      onClick={handleCheckAllBox}
                    />
                  </TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell onClick={handelDateSort}>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Asset Traded</TableCell>
                  <TableCell>Asset Received</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Gain / Loss</TableCell>
                  {/* <TableCell>Errors</TableCell> */}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {isLoadingCoinspot && isLoadingSwyftx && isLoadingBinance ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      className={classes.marginLess}
                    >
                      <CircularProgress className={classes.circularProgress} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {(coinspotTransactions.length &&
                      exchangeFilter === "coinspot") ||
                    exchangeFilter === "all" ? (
                      renderTable(coinspotTransactions)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No Data Found Coinspot
                        </TableCell>
                      </TableRow>
                    )}
                    {(swyftxTransactions.length &&
                      exchangeFilter === "swyftx") ||
                    exchangeFilter === "all" ? (
                      renderTable(swyftxTransactions)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No Data Found Swyftx
                        </TableCell>
                      </TableRow>
                    )}
                    {(binanceTransactions.length &&
                      exchangeFilter === "binance") ||
                    exchangeFilter === "all" ? (
                      renderTable(binanceTransactions)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No Data Found Binance
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
                {/* {console.log("Data", data)} */}
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      className={classes.marginLess}
                    >
                      <CircularProgress className={classes.circularProgress} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>{csvData?.length ? renderTableRows() : ""} </>
                )}
                {/* {renderTableRows()} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={10}
            rowsPerPage={10}
            page={1}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        </div>
      </Paper>
      <MenuItemCard
        menuItems={moreMenuItems}
        menuAnchor={rowItemMenuAnchor}
        setMenuAnchor={setRowItemMenuAnchor}
      />
      <TransactionDataIntegrationModal
        platform={{
          img: coinspotImage,
          name: "coinspot",
          alt: "coinspot",
          allowFileImport: true,
        }}
        isOpen={integrationDialogOpen}
        handleClose={handleIntegrationModalClose}
        handleImportFile={handleIntegrationModalImportFile}
        handleImportSync={handleIntegrationModalImportSync}
      />
      <TransactionFileImportModal
        isOpen={fileImportDialogOpen}
        browsedFile={importedFile}
        setBrowsedFile={setFImportedFile}
        handleClose={handleFileImportDialogClose}
        handleBackClick={handleFileImportDialogBackClick}
        handleFileSelected={handleFileImported}
      />
      <AlertMessageDialog
        openAlert={isAlertOpen}
        title={"Delete"}
        content={"Are you sure you want to delete this transaction?"}
        handleCancel={handleDeleteAlertColse}
        handleYes={handleDeleteYes}
        yesText={"Delete"}
      />
    </div>
  );
}

export default withStyles(styles)(PersonalTransactions);
