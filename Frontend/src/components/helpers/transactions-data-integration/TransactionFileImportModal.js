import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useRef, useState } from "react";
import styles from "../../../resources/styles/helpers-styles/transactions-data-integration/TransactionFileImportModalStyles";

import { ArrowBackIcon } from "./../../../resources/design-icons/helpers-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function TransactionFileImportModal(props) {
  const { classes } = props;

  const {
    isOpen,

    browsedFile,
    setBrowsedFile,
    handleClose,
    handleBackClick,
    handleFileSelected,
  } = props;
  const inputRef = useRef(null);
  const [uploadTypeCheck, setUploadTypeCheck] = useState("append");

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

          <FormControl>
            <FormLabel id="radio-button-group-label">Upload Type</FormLabel>
            <RadioGroup
              row
              name="row-radio-buttons-group"
              onChange={(e) => {
                setUploadTypeCheck(e.target.value);
              }}
              value={uploadTypeCheck}
            >
              <FormControlLabel
                value="append"
                control={<Radio />}
                label="Add new"
              />
              <FormControlLabel
                value="replace"
                control={<Radio />}
                label="Replace"
              />
            </RadioGroup>
          </FormControl>

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
              <p className={classes.dragAndDropText}>
                Drag and Drop your file or{" "}
                <span className={classes.browseBtn} onClick={handleBrowseClick}>
                  Browse
                </span>
              </p>
            )}
          </div>
          <div className={classes.importButtonContainer}>
            {browsedFile ? (
              <Button
                className={classes.importButton}
                // fullWidth

                onClick={(e) => {
                  handleFileSelected(uploadTypeCheck);
                }}
              >
                Import
              </Button>
            ) : (
              <Button
                className={classes.importButtonDisabled}
                // fullWidth

                disabled
              >
                Import
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TransactionFileImportModal);
