import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";

import styles from "../../resources/styles/helpers-styles/AlertMessageDialogStyles";

function AlertMessageDialog(props) {
  const { classes } = props;
  const { openAlert, title, content, handleCancel, handleYes, yesText } = props;
  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openAlert}
        TransitionComponent={Slide}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <h3 className={classes.dialogHeading}>{title}</h3>
            {/* <CancelIcon
                            onClick={handleCancel}
                            className={classes.dialogCloseIcon}
                        /> */}
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.dialogContent}>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} className={classes.btnCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleYes}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {yesText ? yesText : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AlertMessageDialog);
