import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useRef } from "react";
import styles from "../../../resources/styles/helpers-styles/transactions-data-integration/TransactionFileImportModalStyles";
import {
  ArrowBackIcon,
} from "./../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";

function TransactionFileImportModal(props) {
  const { classes } = props;
  const { isOpen, browsedFile, setBrowsedFile, handleClose, handleBackClick,handleFileSelected } =
    props;
  const inputRef = useRef(null);

  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  const fileSelected = () => {
    setBrowsedFile(inputRef.current.files[0]);
  };
  const dragOver = (e) => {
    e.preventDefault();
  };
  const handleFileDrop = (e) => {
    const file = e.dataTransfer.files[0];
    setBrowsedFile(file);
    e.preventDefault();
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div className={classes.rowDiv}>
              <ArrowBackIcon
                className={classes.backArrow}
                onClick={handleBackClick}
              />
              <h2 className={classes.dialogHeading}>Import from file</h2>
            </div>
            <CancelIcon className={classes.closeBtn} onClick={handleClose} />
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <Paper className={classes.errorCard}></Paper>
          <p className={classes.stackHeading}>
            Download your transaction files for all years of trading and upload
            them here. Every deposit, withdrawal & trade should be added.
          </p>
          <input
            type="file"
            accept=".csv"
            ref={inputRef}
            onChange={fileSelected}
            style={{ display: "none" }}
          />
          <div
            className={classes.importContainer}
            onDragOver={dragOver}
            onDragEnter={dragOver}
            onDrop={handleFileDrop}
          >
            {browsedFile ? (
              <p className={classes.browseBtn}>{browsedFile.name}</p>
            ) : (
              <p>
                Drag and Drop your file or{" "}
                <a className={classes.browseBtn} onClick={handleBrowseClick}>
                  Browse
                </a>
              </p>
            )}
          </div>
          <Button className={classes.importButton} fullWidth onClick={handleFileSelected}>
            Import
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionFileImportModal);
