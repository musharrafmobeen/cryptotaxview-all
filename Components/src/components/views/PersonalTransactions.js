import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import styles from "../../resources/styles/views-styles/PersonalTransactionsStyles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItemCard from "../helpers/MenuItemCard";
import { getCurrencyIcon } from "../../services/crypto-currency-exchange-icon";
import TransactionDataIntegrationModal from "../helpers/transactions-data-integration/TransactionDataIntegrationModal";
import TransactionFileImportModal from "../helpers/transactions-data-integration/TransactionFileImportModal";
import TransactionForm from "../helpers/TransactionForm";
import AlertMessageDialog from "../helpers/AlertMessageDialog";
import { findPlatformByName } from "../../services/platform-integration-data";

const dummyRow = {
  id: "1",
  exchange: "Binance",
  exchangeSymbol: "bnb",
  date: "20 Feb 2022, 3:00 PM",
  type: ["Trade"],
  assetTraded: "0.000242 BTC",
  assetReceived: "0.000242 ETH",
  fee: "2.42 (0.1%)",
  gain_loss: 601.7,
  error: {},
};

function PersonalTransactions(props) {
  const { classes } = props;

  /**
   * State and helper functions for delete alert message dialog.
   */
  const [isAlertOpen, setIsALertOpen] = useState(false);
  const [transactionToBeDeleted, setTransactionToBeDeleted] = useState(null);

  const handleDeleteAlertColse = () => {
    setIsALertOpen(false);
    setTransactionToBeDeleted(null);
  };
  const handleDeleteYes = () => {
    setIsALertOpen(false);
    setTransactionToBeDeleted(null);
  };

  /**
   * Method to open delete alert message.
   */

  const openDeleteAlert = () => {
    setIsALertOpen(true);
  };

  //end of relative code for delete alert message dialog.
  //****************************************************************************
  /**
   * State and helper functions for transaction single record Add form.
   */
  const [openTransactionFrom, setOpenTransactionForm] = useState(false);
  const [isTransactionEdit, setIsTransactionEdit] = useState(false);
  const [transactionToBeEdit, setTransactionToBeEdit] = useState(null);

  const handleTransactionFormClose = () => {
    setOpenTransactionForm(false);
    setTransactionToBeEdit(null);
    setIsTransactionEdit(false);
  };

  /**
   * Method to handle click on Add New Transaction buttton.
   */
  const openTransactionAddForm = () => {
    setTransactionToBeEdit(null);
    setIsTransactionEdit(false);
    setOpenTransactionForm(true);
  };
  //end of relative code for transaction single record Add form.
  //****************************************************************************
  /**
   * State and helper functions for integration modal.
   */
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);

  const coinSpotPlatFormData = findPlatformByName("coinspot");

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

  const handleFileImportDialogClose = () => {
    setFImportedFile(null);
    setFileImportDialogOpen(false);
  };

  const handleFileImportDialogBackClick = () => {
    setFImportedFile(null);
    setFileImportDialogOpen(false);
    setIntegrationDialogOpen(true);
  };

  const handleFileImported = () => {
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

  //End of relative code for Menu card.
  //****************************************************************************

  const data = [
    { ...dummyRow, id: 0 },
    { ...dummyRow, id: 1 },
    { ...dummyRow, id: 2 },
    {
      ...dummyRow,
      id: 3,
      exchange: "Binance",
      exchangeSymbol: "bnb",
      assetTraded: "0.000242 ADA",
      assetReceived: "0.000242 BTC",
      error: { message: "Error Occurred" },
      gain_loss: -601.7,
    },
    { ...dummyRow, id: 4 },
    { ...dummyRow, id: 5 },
    { ...dummyRow, id: 6 },
    { ...dummyRow, id: 7 },
    { ...dummyRow, id: 8 },
    { ...dummyRow, id: 9 },
    { ...dummyRow, id: 10 },
    { ...dummyRow, id: 11 },
    { ...dummyRow, id: 12 },
    {
      ...dummyRow,
      id: 13,
      exchange: "Binance",
      exchangeSymbol: "bnb",
      assetTraded: "0.000242 ADA",
      assetReceived: "0.000242 BOOTY",
      error: { message: "Error Occurred" },
      gain_loss: -601.7,
    },
    { ...dummyRow, id: 14 },
    { ...dummyRow, id: 15 },
    { ...dummyRow, id: 16 },
    { ...dummyRow, id: 17 },
  ];
  const moreMenuItems = [
    {
      text: "Edit",
      onClick: () => {
        console.log("Edit Clicked.");
      },
    },
    {
      text: "Delete",
      onClick: openDeleteAlert,
    },
  ];

  const isLoss = (gain_loss) => gain_loss < 0;
  const isError = (err) => Object.keys(err).length;
  const renderTableRows = () => {
    const list = data.map((transaction) => (
      <TableRow
        key={transaction.id}
        component={Paper}
        elevation={0}
        className={`${classes.dataRow} ${
          isError(transaction.error) ? classes.errorDataRow : ""
        }`}
      >
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img src={getCurrencyIcon(transaction.exchangeSymbol)} />{" "}
            {transaction.exchange}
          </div> */}
          {transaction.exchange}
        </TableCell>
        <TableCell>{transaction.date}</TableCell>
        <TableCell>
          <Select
            value={transaction.type[0] || "N/A"}
            className={classes.internalSelect}
          >
            {transaction.type.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetTraded.split(" ")[1])}
            />{" "}
            {transaction.assetTraded}
          </div> */}
          {transaction.assetTraded}
        </TableCell>
        <TableCell>
          {/* <div className={classes.row}>
            <img
              src={getCurrencyIcon(transaction.assetReceived.split(" ")[1])}
            />{" "}
            {transaction.assetReceived}
          </div> */}
          {transaction.assetReceived}
        </TableCell>
        <TableCell>{transaction.fee}</TableCell>
        <TableCell
          className={`${
            isLoss(transaction.gain_loss) ? classes.lossError : classes.gain
          }`}
        >
          {isLoss(transaction.gain_loss)
            ? `-$${Math.abs(transaction.gain_loss)} (L)`
            : `$${transaction.gain_loss} (G)`}
        </TableCell>
        <TableCell
          className={isError(transaction.error) ? classes.lossError : ""}
        >
          {isError(transaction.error) ? transaction.error.message : "--"}
        </TableCell>
        <TableCell>
          <IconButton onClick={showRowItemMenu}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
    return list;
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.content} elevation={0}>
        <div className={classes.headRow}>
          {/* <Typography className={classes.heading}>
            Transaction History
          </Typography> */}
          <div className={classes.buttonGroup}>
            <Button
              className={classes.actionButton}
              onClick={openTransactionAddForm}
            >
              + Add Transaction
            </Button>
            <Button className={classes.actionButton}>Generate Report</Button>
            <Button
              className={classes.actionButton}
              onClick={openIntegrationDialog}
            >
              Integrate Data
            </Button>
          </div>
          <a>Reset to default</a>
        </div>
        <Divider />
        <div>
          <TableContainer
            classes={{ root: classes.customTableContainer }}
            className={classes.tableContainer}
          >
            <Table stickyHeader>
              <TableHead className={classes.tableHead}>
                <TableRow className={classes.headerRow}>
                  <TableCell>
                    <Checkbox style={{ color: "white" }} />
                  </TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Asset Traded</TableCell>
                  <TableCell>Asset Received</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Gain / Loss</TableCell>
                  <TableCell>Errors</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {/* <TableRow>
                  <TableCell colSpan={10} align="center">
                    Transactions Data here
                  </TableCell>
                </TableRow> */}
                {renderTableRows()}
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
        isOpen={integrationDialogOpen}
        platform={coinSpotPlatFormData}
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
      <TransactionForm
        openTransactionForm={openTransactionFrom}
        isEdit={isTransactionEdit}
        handleClose={handleTransactionFormClose}
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
