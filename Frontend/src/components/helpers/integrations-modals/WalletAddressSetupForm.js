import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
} from "@mui/material";
import { withStyles } from "@mui/styles";

import React, { useState } from "react";
import styles from "../../../resources/styles/helpers-styles/integrations-modals/ExchangeApiSetupFormStyles";
import { ArrowBackIcon } from "../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";

function ExchangeApiSetupForm(props) {
  const { classes } = props;
  const {
    isOpen,
    handleClose,
    handleBackClick,
    handleFormSubmit,
    platformName,
  } = props;
  const [walletAddress, setWalletAddress] = useState("");

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
            <div className={classes.rowDiv}>
              <ArrowBackIcon
                className={classes.backArrow}
                onClick={handleBackClick}
              />
              <h2 className={classes.dialogHeading}>
                Setup {platformName} Wallet
              </h2>
            </div>
            <CancelIcon className={classes.closeBtn} onClick={handleClose} />
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <Paper className={classes.errorCard}></Paper>
          <form>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Wallet Address</label>
              <input
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                }}
                type={"text"}
                className={classes.formInput}
              />
            </div>
          </form>
          <div className={classes.buttonContainer}>
            {!walletAddress.length ? (
              <Button className={classes.importButtonDisabled} disabled>
                Secure Import
              </Button>
            ) : (
              <Button
                className={classes.importButton}
                onClick={() => {
                  handleFormSubmit(walletAddress);
                }}
              >
                Secure Import
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(ExchangeApiSetupForm);
