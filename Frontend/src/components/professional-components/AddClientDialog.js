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
import React, { useRef, useState } from "react";
import csvDownloadIcon from "../../resources/design-icons/professionalPlan-icons/download-csv-icon.svg";
import csvUploadIcon from "../../resources/design-icons/professionalPlan-icons/upload-csv-icon.svg";
import styles from "../../resources/styles/helpers-styles/professional-styles/AddClientDialogStyles";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
function AddClientDialog(props) {
  const { classes } = props;
  const { openAlert, handleCancel, handleYes, browsedFile, setBrowsedFile } =
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

  const handleSubmit = (quickInvitees) => {
    handleYes(quickInvitees);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [quickInvitees, setQuickInvitees] = useState([]);

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openAlert}
        TransitionComponent={Slide}
        fullWidth
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <h2 className={classes.dialogHeading}>Add Client</h2>
            <CancelIcon className={classes.closeBtn} onClick={handleCancel} />
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography className={classes.dialogContent}>
            <div className={classes.boldHeadingBig}>Bulk Import</div>
            <div className={classes.containerSpaceBetween}>
              <div className={classes.boldHeadingMedium}>
                Send invite to multiple client
              </div>
              <div className={classes.downloadCSVContainer}>
                <img src={csvDownloadIcon} alt="CSV Download" />{" "}
                <div className={classes.downloadCSVText}>
                  Download CSV Template
                </div>
              </div>
            </div>
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
              <div className={classes.importFileContainerLeft}>
                <img src={csvUploadIcon} alt="CSV Upload" />{" "}
                {browsedFile ? (
                  <p className={classes.importedFileText}>{browsedFile.name}</p>
                ) : (
                  <div className={classes.importText}>
                    Import staff .csv file
                  </div>
                )}
              </div>
              <div className={classes.importFileContainerRight}>
                <div
                  className={classes.importButton}
                  onClick={handleBrowseClick}
                >
                  Import
                </div>
              </div>
            </div>
            <div className={classes.orContainer}>
              <div className={classes.halfBorder} />
              <div className={classes.orText}>OR</div>
              <div className={classes.halfBorder} />
            </div>
            <div className={classes.boldHeadingBig}>Quick Invite</div>
            <div>
              {quickInvitees.map((invitee) => (
                <div className={classes.inviteeContainer}>
                  <div className={classes.inviteeName}>
                    {invitee.firstName + " " + invitee.lastName}
                  </div>
                  <div className={classes.inviteeEmail}>{invitee.email}</div>
                  <div
                    className={classes.inviteeIcon}
                    onClick={() => {
                      setQuickInvitees(
                        quickInvitees.filter(
                          (instInvitee) => instInvitee.email !== invitee.email
                        )
                      );
                    }}
                  >
                    <DeleteIcon color="error" />
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.inputRow}>
              <input
                type={"text"}
                className={classes.input}
                placeholder={"First Name"}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <input
                type={"text"}
                className={classes.input}
                placeholder={"Last Name"}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div className={classes.inputRow}>
              <input
                type={"text"}
                className={classes.inputFullWidth}
                placeholder={"Email Address"}
                value={emailAddress}
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
              />
            </div>
            <div className={classes.inputRowCheckbox}>
              <div className={classes.boldHeadingMedium}>Send Email?</div>
              <input
                type={"checkbox"}
                className={classes.inputCheckbox}
                value={sendEmail}
                onChange={(e) => {
                  setSendEmail(e.target.value);
                }}
              />
            </div>
            <div className={classes.addInviteRow}>
              <div
                className={
                  firstName.length > 0 &&
                  lastName.length > 0 &&
                  emailAddress.length > 0
                    ? classes.addInviteBtnActive
                    : classes.addInviteBtnInActive
                }
                onClick={() => {
                  if (
                    firstName.length > 0 &&
                    lastName.length > 0 &&
                    emailAddress.length > 0
                  ) {
                    setQuickInvitees([
                      ...quickInvitees,
                      {
                        firstName,
                        lastName,
                        email: emailAddress,
                        sendEmail: sendEmail ? "yes" : "no",
                      },
                    ]);
                    setFirstName("");
                    setLastName("");
                    setEmailAddress("");
                    setSendEmail(false);
                  }
                }}
              >
                Add Invite
              </div>
            </div>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} className={classes.btnCancel}>
            Cancel
          </Button>

          <Button
            onClick={(e) => {
              handleSubmit(quickInvitees);
            }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AddClientDialog);
