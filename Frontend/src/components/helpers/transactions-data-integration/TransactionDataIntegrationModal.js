import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../../resources/styles/helpers-styles/transactions-data-integration/TransactionDataIntegrationModalStyles";
import { ImportFileIcon } from "./../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CachedIcon from "@mui/icons-material/Cached";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function TransactionDataIntegrationModal(props) {
  const { classes } = props;
  const {
    isOpen,
    handleClose,
    handleImportFile,
    handleImportSync,
    platform,
    handleImportMetaMask,
  } = props;

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        fullWidth
        // maxWidth="md"
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <h2 className={classes.dialogHeading}>Add Integration</h2>
            <CancelIcon className={classes.closeBtn} onClick={handleClose} />
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <div>
            {platform && (
              <div className={classes.platformImageContainer}>
                <img src={platform.img} alt="Exchange Icon" />
              </div>
            )}
            <div>
              <p className={classes.stackHeading}>
                Connect your exchange and let's import some data.
              </p>
            </div>
          </div>
          {platform?.metamaskIntegrator ? (
            <div
              className={classes.contentStack}
              onClick={handleImportMetaMask}
            >
              <AccountBalanceWalletIcon />
              <div>
                <p className={classes.stackHeading}>
                  Setup your metamask account
                </p>
                <p className={classes.stackDescription}>
                  Your wallet transactions will be imported automatically
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {platform?.allowAPIIntegration ? (
            <div className={classes.contentStack} onClick={handleImportSync}>
              <CachedIcon />
              <div>
                <p className={classes.stackHeading}>Setup auto-sync</p>
                <p className={classes.stackDescription}>
                  Your transactions will be imported automatically
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {platform?.allowFileImport ? (
            <div className={classes.contentStack} onClick={handleImportFile}>
              <ImportFileIcon />
              <div>
                <p className={classes.stackHeading}>Import From File</p>
                <p className={classes.stackDescription}>
                  Download your transaction history and upload manually
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionDataIntegrationModal);
