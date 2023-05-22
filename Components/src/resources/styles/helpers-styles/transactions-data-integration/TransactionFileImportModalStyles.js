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
  },
  closeBtn: {
    color: "#DE5858",
    "&:hover": {
      cursor: "pointer",
    },
  },
  errorCard:{
      
  },
  stackHeading: {
    fontWeight: "bold",
    marginTop: "5px",
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
    "&:hover": {
      cursor: "pointer",
    },
  },
  importButton: {
    backgroundColor: "#092C4C !important",
    fontWeight: "bold !important",
    color: "white !important",
    textTransform: "capitalize !important",
    margin: "1% auto !important",
  },
});

export default styles;
