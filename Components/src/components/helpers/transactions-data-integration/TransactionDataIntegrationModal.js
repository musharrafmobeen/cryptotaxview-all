import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../../resources/styles/helpers-styles/transactions-data-integration/TransactionDataIntegrationModalStyles";
import {
  CloseIcon,
  ImportFileIcon,
} from "./../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CachedIcon from '@mui/icons-material/Cached';

function TransactionDataIntegrationModal(props) {
  const { classes } = props;
  const { isOpen, handleClose, handleImportFile, handleImportSync, platform } =
    props;
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
                Connect your Exchange and Let's Import some data.
              </p>
            </div>
          </div>
          <div className={classes.contentStack} onClick={handleImportSync}>
            <CachedIcon />
            <div>
              <p className={classes.stackHeading}>Setup auto-sync</p>
              <p className={classes.stackDescription}>
                Your transactions will be imported automatically
              </p>
            </div>
          </div>
          <div className={classes.contentStack} onClick={handleImportFile}>
            <ImportFileIcon />
            <div>
              <p className={classes.stackHeading}>Import From File</p>
              <p className={classes.stackDescription}>
                Download your transaction history and upload manually
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionDataIntegrationModal);
