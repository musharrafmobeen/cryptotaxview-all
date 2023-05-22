import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../resources/styles/helpers-styles/TransactionFormStyles";

function TransactionForm(props) {
  const { classes } = props;
  const { openTransactionForm } = props;
  return (
    <div className={classes.root}>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openTransactionForm}
      >
        <DialogTitle></DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionForm);
