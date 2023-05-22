import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { withStyles } from "@mui/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  ArrowBackIcon
} from "./../../resources/design-icons/helpers-icons"
import React from "react";
import styles from "../../resources/styles/helpers-styles/TransactionFormStyles";

function TransactionForm(props) {
  const { classes } = props;
  const { openTransactionForm, isEdit, handleClose } = props;

  const handleFormSubmitt = (e) => {
    e.preventDefault();

  };

  return (
    <div className={classes.root}>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openTransactionForm}
        fullWidth
      // maxWidth="md"
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div className={classes.rowDiv}>
              <ArrowBackIcon
                className={classes.backArrow}
                onClick={handleClose}
              />
              <h2 className={classes.dialogHeading}>{isEdit ? 'Edit transation' : 'Add new transaction'}</h2>
            </div>
            <CancelIcon className={classes.closeBtn} onClick={handleClose} />
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmitt}>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Exchange</label>
              <select className={classes.formSelect}>
                <option value={null}>Select Exchange</option>
                <option value={"binance"}>Binance</option>
                <option value={"coinspot"}>Coinspot</option>
              </select>
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Date</label>
              <input type="date" className={classes.formInput} />
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Type</label>
              <select className={classes.formSelect}>
                <option value={null}>Select transaction type</option>
                <option value={"buy"}>Buy</option>
                <option value={"sell"}>Sell</option>
                <option value={"airdrop"}>Airdrop</option>
              </select>
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Asset Traded</label>
              <input
                type="text"
                placeholder="Enter asset traded"
                className={classes.formInput} />
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Asset Received</label>
              <input
                type="text"
                placeholder="Enter asset Received"
                className={classes.formInput} />
            </div>
            <div className={classes.formControl}>
              <label className={classes.formLabel}>Fee</label>
              <input
                type="text"
                className={classes.formInput} />
            </div>
            <div className={classes.formButtonsContainer}>
              <button className={classes.btnCancel} onClick={handleClose}>Cancel</button>
              <button type="submit" className={classes.btnSubmit}>Add</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionForm);
