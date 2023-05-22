const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  closeBtn: {
    color: "#DE5858",
    "&:hover": {
      cursor: "pointer",
    },
  },
  stackHeading: {
    marginTop: "5px",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  importContainer: {
    border: "1px solid #092C4C",
    height: "100px",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  browseBtn: {
    color: "#0074CB",
    textDecoration: "underline",
    fontWeight: "700 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    "&:hover": {
      cursor: "pointer",
    },
  },
  dragAndDropText: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  importButton: {
    backgroundColor: "#092C4C !important",
    fontWeight: "bold !important",
    color: "white !important",
    textTransform: "capitalize !important",
    margin: "1% auto !important",
    width: "28.5%",
  },
  importButtonDisabled: {
    backgroundColor: "#4f7fab !important",
    fontWeight: "bold !important",
    color: "white !important",
    textTransform: "capitalize !important",
    margin: "1% auto !important",
    width: "28.5%",
  },
  importButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
});

export default styles;
