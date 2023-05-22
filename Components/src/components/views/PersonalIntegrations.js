import { MoreVert } from "@mui/icons-material";
import { Divider, IconButton, Paper } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import styles from "../../resources/styles/views-styles/PersonalIntegrationsStyles";
import AddIntegrationModal from "../helpers/integrations-modals/AddIntegrationModal";
import ExchangeApiSetupForm from "../helpers/integrations-modals/ExchangeApiSetupForm";
import TransactionDataIntegrationModal from "../helpers/transactions-data-integration/TransactionDataIntegrationModal";
import TransactionFileImportModal from "../helpers/transactions-data-integration/TransactionFileImportModal";
import { getPlatformImageByName } from "./../../services/platform-integration-data";

function PersonalIntegrations(props) {
  const { classes } = props;

  /**
   * Dummy Code to MOCK integrated Exchanges.
   */
  const connectedExchanges = [
    {
      id: "ccd2327e-1d3c-43dd-9e6f-e1de82f03c37",
      exchange: "binance",
      userID: "39181b77-029a-466d-8952-6b928f366a52",
      trxCount: 50,
    },
    {
      id: "5a243b8f-51f8-43d1-9816-7d4f258cbe17",
      exchange: "coinspot",
      userID: "39181b77-029a-466d-8952-6b928f366a52",
      trxCount: 945,
    },
    {
      id: "b21c1cdd-86ca-4b4c-8a5e-2e17cb28af15",
      exchange: "swyftx",
      userID: "39181b77-029a-466d-8952-6b928f366a52",
      trxCount: 75,
    },
    {
      id: "a62d1399-d0f4-4e89-92c9-fe22b49471ce",
      exchange: "coinbase",
      userID: "39181b77-029a-466d-8952-6b928f366a52",
      trxCount: 25,
    },
  ];

  /**
   * Method to render connected exchanges.
   */
  const renderDataRows = () => {
    if (connectedExchanges.length === 0) {
      return (
        <div className={classes.emptyMessage}>
          <h3 className={classes.heading}>
            No Exchanges, Wallets or Blockchain Connected
          </h3>
          <button
            className={classes.btnAddStack}
            onClick={openIntegrationDialog}
          >
            + Add Integration
          </button>
        </div>
      );
    }
    const list = connectedExchanges.map((platform) => (
      <div key={platform.id} className={classes.connectedPlatformRow}>
        <div className={classes.dataRowCell}>
          <img
            src={getPlatformImageByName(platform.exchange)}
            alt={platform.exchange}
          />
          {platform.exchange}
        </div>
        <div className={`${classes.dataRowCell} ${classes.transactionCount}`}>
          {platform.trxCount} Transactions
        </div>
        <div className={`${classes.dataRowCell} ${classes.coinsCount}`}>
          {platform.coins} Coins
        </div>
        <IconButton className={classes.iconButton}>
          <MoreVert />
        </IconButton>
      </div>
    ));
    return list;
  };
  //end of relative code for integrated exchanges.
  //****************************************************************************

  /**
   * State and helper functions for integration modal.
   */
  const [addIntegrationDialogOpen, setAddIntegrationDialogOpen] =
    useState(false);
  const [integrationPlatform, setIntegrationPlatform] = useState(null);
  const [transactionDataSyncDialog, setTransactionDataSyncDialog] =
    useState(false);

  const handleIntegrationModalClose = () => {
    setAddIntegrationDialogOpen(false);
  };
  const handleIntegrationModalSelectPlatform = (platform) => () => {
    setIntegrationPlatform(platform);
    setAddIntegrationDialogOpen(false);
    setTransactionDataSyncDialog(true);
  };
  const handleIntegrationModalImportSync = () => {
    setAddIntegrationDialogOpen(false);
    setFileImportDialogOpen(true);
  };

  const handleTransactionDataSyncDialogClose = () => {
    setTransactionDataSyncDialog(false);
    setIntegrationPlatform(null);
  };

  const handleTransactionDataSyncApiClick = () => {
    setTransactionDataSyncDialog(false);
    setExchangeApiSetupDialogOpen(true);
  };

  /**
   * Method for handle button click to open modal.
   */
  const openIntegrationDialog = () => {
    setAddIntegrationDialogOpen(true);
  };

  //end of relative code for integration modal.
  //****************************************************************************

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
    setTransactionDataSyncDialog(true);
  };

  const handleFileImported = () => {
    setFileImportDialogOpen(false);
  };

  //end of relative code for file import modal.
  //*******************************************************************************

  /**
   * State and helper functions for exchange api setup modal.
   */
  const [exchangeApiSetupDialogOpen, setExchangeApiSetupDialogOpen] =
    useState(false);

  const handleExchangeApiSetupDialogClose = () => {
    setExchangeApiSetupDialogOpen(false);
  };

  const handleExchangeApiSetupDialogBackClick = () => {
    setExchangeApiSetupDialogOpen(false);
    setTransactionDataSyncDialog(true);
  };

  const handleExchangeApiSetupFormSubmit = () => {
    setExchangeApiSetupDialogOpen(false);
  };

  //end of relative code for exchange api setup modal.
  //*******************************************************************************

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.paperHead}>
          <h3 className={classes.heading}>Connected Integrations</h3>
          <div className={classes.paperHeadButtonContainer}>
            <p className={classes.label}>Sort By</p>
            <select className={classes.select}>
              <option value={null}>Select</option>
            </select>
            <button
              className={classes.btnAddHead}
              onClick={openIntegrationDialog}
            >
              + Add Integration
            </button>
          </div>
        </div>
        <Divider />
        <div className={classes.stackContainer}>
          <div className={classes.paperStack}>{renderDataRows()}</div>
        </div>
      </Paper>
      <AddIntegrationModal
        isOpen={addIntegrationDialogOpen}
        handleClose={handleIntegrationModalClose}
        handlePlatformSelect={handleIntegrationModalSelectPlatform}
      />
      <TransactionDataIntegrationModal
        isOpen={transactionDataSyncDialog && integrationPlatform}
        platform={integrationPlatform}
        handleClose={handleTransactionDataSyncDialogClose}
        handleImportFile={handleIntegrationModalImportSync}
        handleImportSync={handleTransactionDataSyncApiClick}
      />
      <TransactionFileImportModal
        isOpen={fileImportDialogOpen}
        browsedFile={importedFile}
        setBrowsedFile={setFImportedFile}
        handleClose={handleFileImportDialogClose}
        handleBackClick={handleFileImportDialogBackClick}
        handleFileSelected={handleFileImported}
      />
      <ExchangeApiSetupForm
        isOpen={exchangeApiSetupDialogOpen}
        handleClose={handleExchangeApiSetupDialogClose}
        handleBackClick={handleExchangeApiSetupDialogBackClick}
        handleFormSubmit={handleExchangeApiSetupFormSubmit}
        platformName={integrationPlatform?.name}
      />
    </div>
  );
}

export default withStyles(styles)(PersonalIntegrations);
