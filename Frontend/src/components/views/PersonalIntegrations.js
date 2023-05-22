import {
  Divider,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";

import { ArrowBackIos, MoreVert } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import React, { useState, useContext } from "react";
import styles from "../../resources/styles/views-styles/PersonalIntegrationsStyles";
import AddIntegrationModal from "../helpers/integrations-modals/AddIntegrationModal";
import ExchangeApiSetupForm from "../helpers/integrations-modals/ExchangeApiSetupForm";
import TransactionDataIntegrationModal from "../helpers/transactions-data-integration/TransactionDataIntegrationModal";
import TransactionFileImportModal from "../helpers/transactions-data-integration/TransactionFileImportModal";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteExchanges,
  deleteExchangesProfessional,
  deleteUserFilesExchanges,
  deleteUserFilesExchangesProfessional,
  exchangeSetup,
  exchangeSetupProfessional,
  getExchangesProfessional,
  resetAutoSync,
  resetDeleteState,
} from "../../store/exchanges/exchanges";
import { getExchanges } from "../../store/exchanges/exchanges";
import { useEffect } from "react";
import { getPlatformImageByName } from "./../../services/platform-integration-data";
import { formatDate } from "../../services/date-formatter";
import { SocketContext } from "../../contexts/socket";

import {
  syncDataBinance,
  syncDataCoinspot,
  syncDataSwyftx,
  syncDataMetamask,
  syncDataCoinbase,
  transactionsRequestStart,
  syncDataBitcoin,
  syncDataCoinspotProfessional,
  syncDataBinanceProfessional,
  syncDataSwyftxProfessional,
  syncDataMetamaskProfessional,
  syncDataCoinbaseProfessional,
  syncDataBitcoinProfessional,
} from "../../store/transactions/transactions";
import axios from "axios";
import configData from "../../config.json";
import {
  transactionsRequestFailed,
  getAllTransactions,
} from "../../store/transactions/transactions";
import WalletAddressSetupForm from "../helpers/integrations-modals/WalletAddressSetupForm";
import AlertMessageDialog from "../helpers/AlertMessageDialog";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  isAllowedPermission,
  PERMISSION_SLUGS,
} from "../../services/rolesVerifyingService";

import { useNavigate } from "react-router-dom";

import AlliedAddressesAddDialog from "../helpers/integrations-modals/AlliedAddressesAddDialog";
import Notifications from "../helpers/Notifications";

function PersonalIntegrations(props) {
  const baseUrl = configData.url.baseURL;
  const { classes } = props;
  const sortByValues = [
    { value: null, label: "Select" },
    { value: "exchange", label: "Exchange" },
    { value: "trxCount", label: "Transaction Count" },
    { value: "lastSynced", label: "Last Synced" },
  ];
  const autoSync = useSelector((state) => state.entities.exchanges.autoSync);
  const [snackNotification, setSnackNotification] = useState("");
  const [notificationSnack, setNotificationSnack] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isOpenAddAlliedAccounts, setIsOpenAddAlliedAccounts] = useState(false);
  const [openedConnectedExchanges, setOpenedConnectedExchanges] = useState([]);
  const [exchangeToProcess, setExchangeToProcess] = useState("");
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const [sortBy, setSortBy] = useState(null);
  const [fileToProcess, setFileToProcess] = useState("");
  const socket = useContext(SocketContext);
  const handleNotificationSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationSnack(false);
  };
  const connectedExchanges = useSelector(
    (state) => state.entities.exchanges.exchanges
  );

  const isRefreshExchanges = useSelector(
    (state) => state.entities.exchanges.isRefreshExchanges
  );
  const isDeletingCSV = useSelector(
    (state) => state.entities.exchanges.isDeletingFiles
  );

  const deleteExchangesSuccess = useSelector(
    (state) => state.entities.exchanges.deleteExchangesSuccess
  );

  const role = useSelector((state) => state.auth.user.role);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // if(connectedExchanges.length===0)
    const path = window.location.pathname.split("/");

    if (isPersonalPlan) {
      dispatch(getExchanges());
    } else {
      dispatch(getExchangesProfessional(undefined, path[path.length - 1]));
    }

    socket.on("notification", (notification) => {
      handleNotification(notification);
    });
  }, []);

  useEffect(() => {
    if (sortBy !== null) {
      const path = window.location.pathname.split("/");
      if (isPersonalPlan) {
        dispatch(getExchanges({ [sortBy]: "DESC" }));
      } else {
        dispatch(
          getExchangesProfessional({ [sortBy]: "DESC" }, path[path.length - 1])
        );
      }
    }
  }, [sortBy]);

  useEffect(() => {
    if (isRefreshExchanges) {
      const path = window.location.pathname.split("/");
      if (isPersonalPlan) {
        dispatch(getExchanges());
      } else {
        dispatch(getExchangesProfessional(undefined, path[path.length - 1]));
      }
    }
  }, [isRefreshExchanges]);

  socket.on("notifyClient", (notification) => {
    handleNotification(notification.notification);
  });

  const handleNotification = (notification) => {
    setSnackNotification(notification);
    setNotificationSnack(true);
  };

  const handleDeleteSuccessSnackClose = () => {
    dispatch(resetDeleteState());
  };

  const checkIsOpenConnectedExchange = (exchange) => {
    if (openedConnectedExchanges.includes(exchange)) {
      return true;
    } else return false;
  };

  useEffect(() => {
    const path = window.location.pathname.split("/");
    if (autoSync && isPersonalPlan) {
      dispatch(syncDataCoinspot("coinspot"));
      dispatch(syncDataBinance("binance"));
      dispatch(syncDataSwyftx("swyftx"));
      dispatch(syncDataMetamask("metamask"));
      dispatch(syncDataCoinbase("coinbase"));
      dispatch(syncDataBitcoin("bitcoin"));
      dispatch(resetAutoSync());
    } else if (autoSync && !isPersonalPlan) {
      dispatch(syncDataCoinspotProfessional("coinspot", path[path.length - 1]));
      dispatch(syncDataBinanceProfessional("binance", path[path.length - 1]));
      dispatch(syncDataSwyftxProfessional("swyftx", path[path.length - 1]));
      dispatch(syncDataMetamaskProfessional("metamask", path[path.length - 1]));
      dispatch(syncDataCoinbaseProfessional("coinbase", path[path.length - 1]));
      dispatch(syncDataBitcoinProfessional("bitcoin", path[path.length - 1]));
      dispatch(resetAutoSync());
    }
  }, [autoSync]);

  const handleFileImported = (uploadType) => {
    setTransactionDataSyncDialog(false);
    let formData = new FormData();
    let token = "bearer " + localStorage.getItem("token");
    formData.append("file", importedFile);
    dispatch(transactionsRequestStart());
    const path = window.location.pathname.split("/");
    if (isPersonalPlan) {
      axios
        .post(
          `${baseUrl}/order-history-import/upload/${integrationPlatform.name}/${uploadType}`,
          formData,
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          dispatch(getAllTransactions(200, 0));
          dispatch(getExchanges());

          setFImportedFile(null);
        })
        .catch((err) => {
          dispatch(transactionsRequestFailed({ message: err }));
          setTransactionDataSyncDialog(false);

          setFImportedFile(null);
        });
    } else {
      axios
        .post(
          `${baseUrl}/order-history-import/upload/${
            integrationPlatform.name
          }/${uploadType}/${path[path.length - 1]}`,
          formData,
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          dispatch(getAllTransactions(200, 0));
          dispatch(getExchangesProfessional(undefined, path[path.length - 1]));

          setFImportedFile(null);
        })
        .catch((err) => {
          dispatch(transactionsRequestFailed({ message: err }));
          setTransactionDataSyncDialog(false);

          setFImportedFile(null);
        });
    }

    setFileImportDialogOpen(false);
  };
  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };
  const renderFiles = (files, exchangeName) => {
    return files.map((file) => {
      return file.exchange === exchangeName ? (
        <div className={classes.csvFileContainer}>
          <div className={classes.csvFileName}>
            {file.fileName}
            {", Original File: "}
            {file.originalFileName}
          </div>

          <div
            className={
              isAllowedPermission(
                role.rolePermission,
                PERMISSION_SLUGS.INTEGRATION_ALL_PERMISSIONS
              )
                ? classes.csvFileDeleteIcon
                : classes.csvFileDeleteIconDisabled
            }
            onClick={(e) => {
              if (
                isAllowedPermission(
                  role.rolePermission,
                  PERMISSION_SLUGS.INTEGRATION_ALL_PERMISSIONS
                )
              ) {
                setIsAlertOpenCSV(true);
                setFileToProcess(file.fileName);
              }
            }}
          >
            {" "}
            {isAllowedPermission(
              role.rolePermission,
              PERMISSION_SLUGS.INTEGRATION_ALL_PERMISSIONS
            ) ? (
              <DeleteIcon color="error" />
            ) : (
              <DeleteIcon color="disabled" />
            )}
          </div>
        </div>
      ) : (
        <></>
      );
    });
  };

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
    if (connectedExchanges.length) {
      const list = connectedExchanges.map((platform) => (
        <div className={classes.connectedIntegrationRow}>
          <div
            key={platform.id}
            className={classes.connectedPlatformRow}
            onClick={(e) => {
              if (openedConnectedExchanges.includes(platform.exchange)) {
                setOpenedConnectedExchanges(
                  openedConnectedExchanges.filter(
                    (exchange) => exchange !== platform.exchange
                  )
                );
              } else
                setOpenedConnectedExchanges([
                  ...openedConnectedExchanges,
                  platform.exchange,
                ]);
            }}
          >
            <div className={classes.dataRowCell}>
              <img
                src={getPlatformImageByName(platform.exchange)}
                alt={platform.exchange}
                style={{ marginRight: "10px" }}
              />
              {platform.exchange}
            </div>
            <div
              className={`${classes.dataRowCell} ${classes.transactionCount}`}
            >
              Transactions: {platform.trxCount}
            </div>
            <div
              className={`${classes.dataRowCell} ${classes.transactionCount}`}
            >
              Data Source: {platform.source.toUpperCase()}
            </div>
            <div className={`${classes.dataRowCell} ${classes.coinsCount}`}>
              Last Synced{" "}
              {platform.lastSynced === 0
                ? ""
                : formatDate(+platform.lastSynced)}
            </div>
            <IconButton
              className={
                isAllowedPermission(
                  role.rolePermission,
                  PERMISSION_SLUGS.INTEGRATION_ALL_PERMISSIONS
                )
                  ? classes.iconButton
                  : classes.iconButtonDisabled
              }
              onClick={(e) => {
                if (
                  isAllowedPermission(
                    role.rolePermission,
                    PERMISSION_SLUGS.INTEGRATION_ALL_PERMISSIONS
                  )
                ) {
                  openMenu(e);
                  setExchangeToProcess(platform.exchange);
                }
              }}
            >
              <MoreVert />
            </IconButton>
          </div>
          {checkIsOpenConnectedExchange(platform.exchange) ? (
            <div className={classes.connectedPlatformRowDetails}>
              <div className={classes.connectedPlatformAPIData}>
                <div>API</div>
                {platform.source.includes("api") ? (
                  <div className={classes.connectedPlatformSubContainer}>
                    API Keys integrated
                  </div>
                ) : (
                  <div className={classes.connectedPlatformSubContainer}>
                    API Keys not integrated
                  </div>
                )}
              </div>
              <div className={classes.connectedPlatformAPIData}>
                <div>CSV</div>
                {!platform.source.includes("csv") ? (
                  <div className={classes.connectedPlatformSubContainer}>
                    CSV not integrated
                  </div>
                ) : (
                  <div className={classes.connectedPlatformSubContainer}>
                    {renderFiles(platform.files, platform.exchange)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ));

      return list;
    }
  };
  /**
   * State and helper functions for integration modal.
   */
  const [addIntegrationDialogOpen, setAddIntegrationDialogOpen] =
    useState(false);
  const [integrationPlatform, setIntegrationPlatform] = useState(null);

  const [transactionDataSyncDialog, setTransactionDataSyncDialog] =
    useState(false);
  const [metaMaskWalletOpen, setMetaMaskWalletOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertOpenCSV, setIsAlertOpenCSV] = useState(false);

  const handleDeleteAlertColse = () => {
    setIsAlertOpenCSV(false);
    // setIdsToProcess(null);
  };

  const handleDeleteAlertCloseCSV = () => {
    setIsAlertOpenCSV(false);
    // setIdsToProcess(null);
  };
  const handleDeleteYesCSV = () => {
    setIsAlertOpenCSV(false);
    if (isPersonalPlan) {
      dispatch(deleteUserFilesExchanges([fileToProcess]));
    } else {
      const path = window.location.pathname.split("/");
      dispatch(
        deleteUserFilesExchangesProfessional(
          [fileToProcess],
          path[path.length - 1]
        )
      );
    }
    // setIdsToProcess(null);
  };

  const handleDeleteYes = () => {
    if (isPersonalPlan) {
      dispatch(deleteExchanges(exchangeToProcess));
    } else {
      const path = window.location.pathname.split("/");
      dispatch(
        deleteExchangesProfessional(exchangeToProcess, path[path.length - 1])
      );
    }

    setIsAlertOpen(false);
    // setIdsToProcess(null);
  };
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
    setTransactionDataSyncDialog(false);
    setFileImportDialogOpen(true);
  };

  const handleTransactionDataSyncDialogClose = () => {
    setTransactionDataSyncDialog(false);
    setIntegrationPlatform(null);
  };

  const handleTransactionDataSyncApiClick = () => {
    setAddIntegrationDialogOpen(false);
    setTransactionDataSyncDialog(false);
    setExchangeApiSetupDialogOpen(true);
  };

  const handleImportMetaMask = () => {
    setTransactionDataSyncDialog(false);
    setMetaMaskWalletOpen(true);
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

  //end of relative code for file import modal.
  //*******************************************************************************

  /**
   * State and helper functions for exchange api setup modal.
   */
  const [exchangeApiSetupDialogOpen, setExchangeApiSetupDialogOpen] =
    useState(false);

  const handleExchangeApiSetupDialogClose = () => {
    setExchangeApiSetupDialogOpen(false);
    setMetaMaskWalletOpen(false);
  };

  const handleExchangeApiSetupDialogBackClick = () => {
    setExchangeApiSetupDialogOpen(false);
    setTransactionDataSyncDialog(true);
    setMetaMaskWalletOpen(false);
  };

  const handleExchangeApiSetupFormSubmit = (apiKey, apiSecret) => {
    const path = window.location.pathname.split("/");
    if (isPersonalPlan) {
      dispatch(
        exchangeSetup({
          exchange: integrationPlatform.name,
          keys: [apiKey, apiSecret],
        })
      );
    } else {
      dispatch(
        exchangeSetupProfessional(
          {
            exchange: integrationPlatform.name,
            keys: [apiKey, apiSecret],
          },
          path[path.length - 1]
        )
      );
    }

    setExchangeApiSetupDialogOpen(false);
  };

  const handleMetaMaskWalletSubmit = (walletKey) => {
    const path = window.location.pathname.split("/");
    if (isPersonalPlan) {
      dispatch(
        exchangeSetup({
          exchange: integrationPlatform.name,
          keys: [walletKey],
        })
      );
    } else {
      dispatch(
        exchangeSetupProfessional(
          {
            exchange: integrationPlatform.name,
            keys: [walletKey],
          },
          path[path.length - 1]
        )
      );
    }

    setMetaMaskWalletOpen(false);
  };

  //end of relative code for exchange api setup modal.
  //*******************************************************************************

  return (
    <div className={classes.root}>
      <Notifications
        open={isDeletingCSV}
        message={"Deleting CSV Files!"}
        type="warning"
      />

      <Notifications
        open={deleteExchangesSuccess}
        onClose={handleDeleteSuccessSnackClose}
        message={"Integrations and transactions deleted successfully!"}
        type="success"
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

      {/* <Snackbar
        open={notificationSnack}
        onClose={handleNotificationSnackClose}
        message={snackNotification}
        action={
          <>
            {snackNotification !== "Synced" ? (
              <img
                width="40px"
                height="40px"
                src={rocketGif}
                alt="Rocket-gif"
              />
            ) : (
              ""
            )}
            <IconButton
              onClick={handleNotificationSnackClose}
              style={{ color: "white" }}
            >
              <CancelIcon />
            </IconButton>
          </>
        }
      /> */}
      <Paper className={classes.paper} elevation={0}>
        {isPersonalPlan ? (
          <div className={classes.paperHead}>
            <h3 className={classes.heading}>Connected Integrations</h3>
            <div className={classes.paperHeadButtonContainer}>
              <h3 className={classes.label}>Sort By</h3>
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
              </select>
              <button
                className={classes.btnAddHead}
                onClick={openIntegrationDialog}
              >
                <h3>+ Add Integration</h3>
              </button>
              <button
                className={classes.btnAddHead}
                onClick={() => {
                  setIsOpenAddAlliedAccounts(true);
                }}
              >
                <h3>+ Add Allied Accounts</h3>
              </button>
            </div>
          </div>
        ) : (
          <div className={classes.paperHeadProfessionalContainer}>
            <div className={classes.content}>
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

              <button
                className={classes.btnAddHeadProfessional}
                onClick={openIntegrationDialog}
              >
                <h3>+ Add Integration</h3>
              </button>
              <button
                className={classes.btnAddHeadProfessional}
                onClick={() => {
                  setIsOpenAddAlliedAccounts(true);
                }}
              >
                <h3>+ Add Allied Accounts</h3>
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
              </select>
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
        handleImportMetaMask={handleImportMetaMask}
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
        isAllowedSecretKey={integrationPlatform?.allowAPISecret}
      />
      <WalletAddressSetupForm
        isOpen={metaMaskWalletOpen}
        handleClose={handleExchangeApiSetupDialogClose}
        handleBackClick={handleExchangeApiSetupDialogBackClick}
        handleFormSubmit={handleMetaMaskWalletSubmit}
        platformName={integrationPlatform?.name}
      />
      <AlliedAddressesAddDialog
        isOpen={isOpenAddAlliedAccounts}
        handleClose={() => {
          setIsOpenAddAlliedAccounts(false);
        }}
      />
      <AlertMessageDialog
        openAlert={isAlertOpenCSV}
        title={"Delete"}
        content={"Are you sure you want to delete this CSV File?"}
        handleCancel={handleDeleteAlertCloseCSV}
        handleYes={handleDeleteYesCSV}
        yesText={"Delete"}
      />
      <AlertMessageDialog
        openAlert={isAlertOpen}
        title={"Delete"}
        content={
          "Are you sure you want to delete this exchange? All related transactions (API/CSV/Manual) will be deleted"
        }
        handleCancel={handleDeleteAlertColse}
        handleYes={handleDeleteYes}
        yesText={"Delete"}
      />
      <Menu
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
        PaperProps={{
          style: {
            maxHeight: 350,
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            setIsAlertOpen(true);
            setMenuAnchor(null);
          }}
        >
          Delete Exchange
        </MenuItem>
      </Menu>
    </div>
  );
}

export default withStyles(styles)(PersonalIntegrations);
