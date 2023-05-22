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
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import styles from "../../../resources/styles/helpers-styles/integrations-modals/ExchangeApiSetupFormStyles";
import { ArrowBackIcon } from "./../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";

function WalletAddressSetupForm(props) {
  const { classes } = props;
  const {
    isOpen,
    handleClose,
    handleBackClick,
    handleFormSubmit,
    platformName,
    isAllowedSecretKey,
  } = props;
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleApiSecretChange = (e) => {
    setApiSecret(e.target.value);
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 34,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(17px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

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
              <input
                onChange={handleApiKeyChange}
                type={"text"}
                className={classes.formInput}
              />
            </div>
            {isAllowedSecretKey ? (
              <div className={classes.formControl}>
                <label className={classes.formLabel}>API Secret</label>
                <input
                  onChange={handleApiSecretChange}
                  type={"text"}
                  className={classes.formInput}
                />
              </div>
            ) : (
              <></>
            )}
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
              <AntSwitch
                defaultChecked
                inputProps={{
                  "aria-label": "ant design",
                }}
              />
            </div>
          </form>
          <Button
            className={classes.importButton}
            fullWidth
            onClick={() => {
              handleFormSubmit(apiKey, apiSecret);
            }}
          >
            Secure Import
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(WalletAddressSetupForm);
