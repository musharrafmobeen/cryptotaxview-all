import React, { useEffect } from "react";

import { withStyles } from "@mui/styles";

import styles from "../../resources/styles/helpers-styles/Notifications";
import successIcon from "../../resources/gif/success.gif";
import warningIcon from "../../resources/gif/warning.gif";
import errorIcon from "../../resources/gif/error.gif";
import closeIcon from "../../resources/design-icons/helpers-icons/close.svg";

function Notifications(props) {
  const { classes } = props;
  const { open, message, type, onClose, timeOutInterval, disableAutoClose } =
    props;
  useEffect(() => {
    var timeout;
    if (open) {
      timeout = setTimeout(
        () => {
          if (!disableAutoClose) onClose();
        },
        timeOutInterval ? timeOutInterval : 5000
      );
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);
  if (open)
    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          {type === "success" ? (
            <img
              src={successIcon}
              alt={"success-icon"}
              className={classes.gif}
            />
          ) : type === "warning" ? (
            <img
              src={warningIcon}
              alt={"warning-icon"}
              className={classes.gif}
            />
          ) : type === "error" ? (
            <img src={errorIcon} alt={"error-icon"} className={classes.gif} />
          ) : (
            <></>
          )}
        </div>
        <div className={classes.text}>{message}</div>
        <div className={classes.close}>
          <img src={closeIcon} alt="close-icon" onClick={() => onClose()} />
        </div>
      </div>
    );
  else return <></>;
}

export default withStyles(styles)(Notifications);
