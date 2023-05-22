import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";

import styles from "../../resources/styles/helpers-styles/EditTransactionDialogStyles";
import { formatDateTransactionsTable } from "../../services/date-formatter";

function EditTransactionDialog(props) {
  const { classes } = props;
  const { openAlert, data, handleCancel, handleYes } = props;
  const [exchangeRate, setExchangeRate] = useState(data?.priceInAud);

  useEffect(() => {
    setExchangeRate(data?.priceInAud);

    return () => {
      setExchangeRate(null);
    };
  }, [data]);

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openAlert}
        TransitionComponent={Slide}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>Edit Transactions</div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography className={classes.dialogContent}>
            <form>
              <div className={classes.formRow}>
                <label className={classes.label}>Exchange</label>
                <input
                  type={"text"}
                  value={data?.exchange}
                  disabled
                  className={classes.input}
                />
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Date</label>
                <input
                  type={"text"}
                  value={formatDateTransactionsTable(data?.datetime)}
                  disabled
                  className={classes.input}
                />
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Type</label>
                <input
                  type={"text"}
                  value={data?.side}
                  disabled
                  className={classes.input}
                />
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Asset Traded</label>
                <div className={classes.valueRow}>
                  <input
                    type={"text"}
                    value={data?.side === "buy" ? data?.cost : data?.amount}
                    disabled
                    className={classes.inputWithAsset}
                  />
                  <div className={classes.asset}>
                    {data?.side === "buy"
                      ? data?.symbol.split("/")[1]
                      : data?.symbol.split("/")[0]}
                  </div>
                </div>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Asset Received</label>
                <div className={classes.valueRow}>
                  <input
                    type={"text"}
                    value={data?.side === "sell" ? data?.cost : data?.amount}
                    disabled
                    className={classes.inputWithAsset}
                  />
                  <div className={classes.asset}>
                    {data?.side === "buy"
                      ? data?.symbol.split("/")[0]
                      : data?.symbol.split("/")[1]}
                  </div>
                </div>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>{`Exchange Rate ${
                  data?.side === "buy"
                    ? data?.symbol.split("/")[1]
                    : data?.symbol.split("/")[0]
                }`}</label>
                <input
                  value={exchangeRate}
                  type={"text"}
                  onChange={(e) => {
                    setExchangeRate(e.target.value);
                  }}
                  className={classes.input}
                />
                {console.log("validation-text", data?.priceInAud)}
                {data?.priceInAud > 0 ||
                (exchangeRate?.length &&
                  !isNaN(exchangeRate) &&
                  exchangeRate[0] !== "0") ? (
                  <></>
                ) : (
                  <div className={classes.validationError}>
                    Exchange Rate cannot be in alphabets and should be greater
                    than zero
                  </div>
                )}
              </div>
            </form>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} className={classes.btnCancel}>
            Cancel
          </Button>

          {exchangeRate?.length &&
          !isNaN(exchangeRate) &&
          exchangeRate[0] !== "0" ? (
            <Button
              onClick={(e) => {
                handleYes(exchangeRate);
              }}
              classes={{ root: classes.btnYes }}
              className={classes.btnYes}
            >
              {"Submit"}
            </Button>
          ) : (
            <Button
              disabled
              classes={{ root: classes.btnYes }}
              className={classes.btnYesDisabled}
            >
              {"Submit"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(EditTransactionDialog);
