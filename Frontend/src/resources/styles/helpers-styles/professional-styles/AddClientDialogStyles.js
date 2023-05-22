const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const button = {
  fontWeight: "bold !important",
};

const styles = (theme) => ({
  dialogTitle: {
    ...row,
    fontFamily: "Roboto",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  rowDiv: {
    ...row,
    "& *": {
      margin: "auto 5px",
    },
    width: "fit-content",
  },
  closeBtn: {
    color: "#DE5858",
    "&:hover": {
      cursor: "pointer",
    },
  },
  dialogHeading: {
    padding: "0",
    margin: "0",
  },
  dialogCloseIcon: {
    color: "#DE5858",
    "&:hover": {
      cursor: "pointer",
    },
  },
  dialogContent: {
    fontWeight: "bold !important",
  },
  btnCancel: {
    ...button,
    backgroundColor: "#DE5858 !important",
    color: "white !important",
  },
  btnYes: {
    ...button,
    backgroundColor: "#092C4C !important",
    color: "white !important",
  },
  btnYesDisabled: {
    ...button,
    backgroundColor: "#4f7fab !important",
    color: "white !important",
  },
  boldHeadingBig: {
    fontFamily: "Roboto",
    fontWeight: "700",
    letterSpacing: "0.5px",
    fontSize: "20px",
  },
  boldHeadingMedium: {
    fontFamily: "Roboto",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  boldSubHeading: {},
  containerSpaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downloadCSVContainer: {
    display: "flex",
    alignItems: "center",
  },
  downloadCSVText: {
    paddingLeft: "5px",
    color: "#0074CB",
  },
  importContainer: {
    marginTop: "15px",
    border: "1px solid #C2CFD9",
    height: "50px",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  importFileContainerLeft: {
    display: "flex",
    paddingLeft: "10px",
  },
  importText: {
    paddingLeft: "10px",
    color: "#C2CFD9",
    fontWeight: "500",
  },
  importFileContainerRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "25%",
  },
  importButton: {
    color: "white",
    backgroundColor: "#092C4C",
    borderRadius: "4px",
    height: "90%",
    width: "95%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    letterSpacing: "0.5px",
    cursor: "pointer",
  },
  importedFileText: {
    letterSpacing: "0.5px",
    paddingLeft: "10px",
    color: "#092C4C",
  },
  orContainer: {
    display: "flex",
    alignItems: "center",
  },
  orText: {
    padding: "15px",
  },
  halfBorder: {
    content: "",
    backgroundColor: "#000000",
    display: "inline-block",
    width: "45%",
    height: "1px",
  },
  inputRow: {
    marginTop: "10px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  inputRowCheckbox: {
    marginTop: "10px",
    width: "64%",
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    height: "50px",
    width: "48%",
    borderRadius: "4px",
    border: "1px solid #C2CFD9",
  },
  inputFullWidth: {
    height: "50px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #C2CFD9",
  },
  inputCheckbox: {
    height: "20px",
    width: "50%",
  },
  addInviteRow: {
    marginTop: "10px",
  },
  addInviteBtnInActive: {
    color: "white",
    width: "150px",
    height: "50px",
    backgroundColor: "#C2CFD9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    cursor: "not-allowed",
  },
  addInviteBtnActive: {
    color: "white",
    width: "150px",
    height: "50px",
    backgroundColor: "#092C4C",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
  },
  inviteeContainer: {
    width: "100%",
    display: "flex",
    // justifyContent: "space-between",
  },
  inviteeName: {
    width: "35%",
  },
  inviteeEmail: {
    width: "45%",
    display: "flex",
    justifyContent: "center",
  },
  inviteeIcon: {
    width: "20%",
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
  },
});

export default styles;
