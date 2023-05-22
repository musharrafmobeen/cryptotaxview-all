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
  backArrow: {
    // padding: "4px",
    "&:hover": {
      cursor: "pointer",
      //   backgroundColor: "grey",
      //   borderRadius: "50%",
    },
  },
  dialogHeading: {
    padding: "0",
    margin: "0",
    color: "#DE5858",
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
  formRow: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px",
    fontFamily: "Roboto",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  input: {
    width: "350px",
    height: "40px",
    marginBottom: "10px",
    textTransform: "capitalize",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  inputWithAsset: {
    width: "225px",
    height: "40px",
    marginBottom: "10px",
    textTransform: "capitalize",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  valueRow: {
    display: "flex",
    flexDirection: "row",

    height: "40px",
    marginBottom: "10px",
  },
  asset: {
    marginLeft: "10px",
    height: "40px",
    width: "100px",
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  validationError: {
    color: "red",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  errorMessages: {
    fontWeight: "100",
    color: "#DE5858",

    paddingBottom: "5px",
  },
  errorContainer: {
    width: "350px",
    maxHeight: "80px",
    overflowY: "auto",
    marginBottom: "10px",
  },
});

export default styles;
