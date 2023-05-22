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
  },
  input: {
    width: "350px",
    height: "40px",
    marginBottom: "10px",
    textTransform: "capitalize",
  },
  inputWithAsset: {
    width: "300px",
    height: "40px",
    marginBottom: "10px",
    textTransform: "capitalize",
  },
  valueRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "40px",
    marginBottom: "10px",
  },
  asset: {
    width: "50px",
    display: "flex",
    justifyContent: "center",
  },
  validationError: {
    width: "350px",
    color: "red",
  },
});

export default styles;
