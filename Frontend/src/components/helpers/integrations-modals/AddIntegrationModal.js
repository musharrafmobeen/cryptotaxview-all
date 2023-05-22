import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "../../../resources/styles/helpers-styles/integrations-modals/AddIntegrationModalStyles";
import { exchangesData } from "./../../../services/platform-integration-data";

function AddIntegrationModal(props) {
  const { classes } = props;
  const { isOpen, handleClose, handlePlatformSelect } = props;
  const renderPlatforms = () => {
    const list = exchangesData.map((exchange, index) => (
      <div
        key={index}
        className={classes.integrationPlatform}
        onClick={handlePlatformSelect(exchange)}
      >
        <img
          src={exchange.img}
          alt={exchange.alt}
          className={classes.integrationPlatformImg}
        />
      </div>
    ));
    return list;
  };
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
            <p className={classes.stackHeading}>
              Select your integration to connect with your account.
            </p>
          </div>
          <div className={classes.platformsContainer}>{renderPlatforms()}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AddIntegrationModal);
