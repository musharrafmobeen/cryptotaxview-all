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
import React, { useState } from "react";

import styles from "../../resources/styles/helpers-styles/AddTransactionDialogStyles";

import { exchangesData } from "../../services/platform-integration-data";
import { transactionSides } from "../../services/transactionSides";

function AddTransactionDialog(props) {
  const { classes } = props;
  const { openAlert, handleCancel, handleYes } = props;

  const [transactionExchange, setTransactionExchange] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionSide, setTransactionSide] = useState("");
  const [transactionAssetTraded, setTransactionAssetTraded] = useState("");
  const [transactionAssetTradedQty, setTransactionAssetTradedQty] =
    useState("");
  const [transactionAssetReceived, setTransactionAssetReceived] = useState("");
  const [transactionAssetReceivedQty, setTransactionAssetReceivedQty] =
    useState("");
  const [transactionFee, setTransactionFee] = useState("");
  const [transactionFeeCoin, setTransactionFeeCoin] = useState("");
  const [transactionErrorMessages, setTransactionErrorMessages] = useState([]);

  // useEffect(() => {
  //   setExchangeRate(data?.priceInAud);

  //   return () => {
  //     setExchangeRate(null);
  //   };
  // }, [data]);

  const handleSubmit = () => {
    // setTransactionErrorMessages([]);
    let errorMessages = [];

    if (transactionExchange.length === 0)
      errorMessages.push("*Transactions cannot be empty");

    if (transactionDate.length === 0)
      errorMessages.push("*Date cannot be empty");
    if (transactionSide.length === 0)
      errorMessages.push("*Type cannot be empty");
    if (
      transactionAssetTraded.length === 0 ||
      transactionAssetTraded.length > 10
    )
      errorMessages.push(
        "*Asset traded cannot be empty or greater than 10 characters"
      );
    if (
      transactionAssetTradedQty.length === 0 ||
      transactionAssetTradedQty.length > 10
    )
      errorMessages.push(
        "*Asset traded Qty cannot be empty or greater than 10 characters"
      );
    if (
      transactionAssetReceived.length === 0 ||
      transactionAssetReceived.length > 10
    )
      errorMessages.push(
        "*Asset received cannot be empty or greater than 10 characters"
      );
    if (
      transactionAssetReceivedQty.length === 0 ||
      transactionAssetReceivedQty.length > 10
    )
      errorMessages.push(
        "*Asset received qty cannot be empty or greater than 10 characters"
      );
    if (transactionFee.length === 0 || transactionFee.length > 10)
      errorMessages.push("Fee cannot be empty or greater than 10 characters");
    if (transactionFeeCoin.length === 0 || transactionFeeCoin.length > 10)
      errorMessages.push(
        "*Fee coin cannot be empty or greater than 10 characters"
      );

    setTransactionErrorMessages(errorMessages);

    if (errorMessages.length === 0) {
      handleYes(
        transactionExchange,
        transactionDate,
        transactionSide,
        transactionAssetTraded,
        transactionAssetTradedQty,
        transactionAssetReceived,
        transactionAssetReceivedQty,
        transactionFee,
        transactionFeeCoin
      );
      resetFields();
    }
  };

  const resetFields = () => {
    setTransactionExchange("");
    setTransactionDate("");
    setTransactionSide("");
    setTransactionAssetTraded("");
    setTransactionAssetTradedQty("");
    setTransactionAssetReceived("");
    setTransactionAssetReceivedQty("");
    setTransactionFee("");
    setTransactionFeeCoin("");
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openAlert}
        TransitionComponent={Slide}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>Add new transaction</div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography className={classes.dialogContent}>
            <div className={classes.errorContainer}>
              {transactionErrorMessages.map((msg) => {
                return <div className={classes.errorMessages}>{msg}</div>;
              })}
            </div>
            <form>
              <div className={classes.formRow}>
                <label className={classes.label}>Exchange</label>
                <select
                  value={transactionExchange}
                  className={classes.input}
                  onChange={(e) => {
                    setTransactionExchange(e.target.value);
                  }}
                >
                  <option defaultChecked value={null}>
                    Select
                  </option>
                  {exchangesData.map((exchangeData) => {
                    return (
                      <option
                        value={exchangeData.name}
                        className={classes.capitalize}
                      >
                        {exchangeData.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Date</label>

                <input
                  type={"datetime-local"}
                  value={transactionDate}
                  className={classes.input}
                  onChange={(e) => {
                    setTransactionDate(e.target.value);
                  }}
                />
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Type</label>
                <select
                  value={transactionSide}
                  className={classes.input}
                  onChange={(e) => {
                    setTransactionSide(e.target.value);
                  }}
                >
                  <option defaultChecked value={null}>
                    Select
                  </option>
                  {transactionSides.map((side) => {
                    return (
                      <option value={side.value} className={side.capitalize}>
                        {side.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Asset Traded</label>
                <div className={classes.valueRow}>
                  <input
                    placeholder="Qty"
                    type={"text"}
                    value={transactionAssetTradedQty}
                    className={classes.inputWithAsset}
                    onChange={(e) => {
                      setTransactionAssetTradedQty(e.target.value);
                    }}
                  />
                  <input
                    placeholder="Asset Name"
                    type={"text"}
                    value={transactionAssetTraded}
                    className={classes.asset}
                    onChange={(e) => {
                      setTransactionAssetTraded(e.target.value.toUpperCase());
                    }}
                  />
                </div>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>Asset Received</label>
                <div className={classes.valueRow}>
                  <input
                    placeholder="Qty"
                    type={"text"}
                    value={transactionAssetReceivedQty}
                    className={classes.inputWithAsset}
                    onChange={(e) => {
                      setTransactionAssetReceivedQty(e.target.value);
                    }}
                  />
                  <input
                    placeholder="Asset Name"
                    type={"text"}
                    value={transactionAssetReceived}
                    className={classes.asset}
                    onChange={(e) => {
                      setTransactionAssetReceived(e.target.value.toUpperCase());
                    }}
                  />
                </div>
              </div>

              <div className={classes.formRow}>
                <label className={classes.label}>Transaction Fee</label>
                <div className={classes.valueRow}>
                  <input
                    placeholder="Qty"
                    type={"text"}
                    value={transactionFee}
                    className={classes.inputWithAsset}
                    onChange={(e) => {
                      setTransactionFee(e.target.value);
                    }}
                  />
                  <input
                    placeholder="Coin Name"
                    type={"text"}
                    value={transactionFeeCoin}
                    className={classes.asset}
                    onChange={(e) => {
                      setTransactionFeeCoin(e.target.value.toUpperCase());
                    }}
                  />
                </div>
              </div>
            </form>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} className={classes.btnCancel}>
            Cancel
          </Button>

          <Button
            onClick={(e) => {
              handleSubmit();
            }}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AddTransactionDialog);
