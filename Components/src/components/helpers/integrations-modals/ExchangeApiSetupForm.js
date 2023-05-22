import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Switch,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../../resources/styles/helpers-styles/integrations-modals/ExchangeApiSetupFormStyles";
import { ArrowBackIcon } from "./../../../resources/design-icons/helpers-icons";
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
                Setup {platformName} API
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
              <label className={classes.formLabel}>API Key</label>
              <input type={"text"} className={classes.formInput}/>
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>API Secret</label>
              <input type={"text"} className={classes.formInput}/>
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Start Import from</label>
              <select className={classes.formSelect}>
                <option value={"beginning"}>Beginning</option>
              </select>
            </div>
            <div className={classes.formControlRow}>
              <label className={classes.formLabel}>
                Ignore reported balances
              </label>
              <Switch></Switch>
            </div>
          </form>
          <Button
            className={classes.importButton}
            fullWidth
            onClick={handleFormSubmit}
          >
            Import
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(ExchangeApiSetupForm);
