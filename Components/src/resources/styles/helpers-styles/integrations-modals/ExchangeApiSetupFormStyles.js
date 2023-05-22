const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const formInput = {
  border: `1px solid #7F92A3`,
  borderRadius: "4px",
  padding: "10px 5px",
  width: "100%",
  boxSizing: "border-box",
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
  errorCard: {},
  formControl: {
    ...row,
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    "& *": {
      marginTop: "5px",
      marginBottom: "5px",
    },
  },
  formControlRow:{
      ...row,
  },
  formLabel: {
    fontWeight: "bold",
    // fontSize: "1.30vw"
  },
  formSelect: {
    ...formInput,
    padding: "10px 5px",
  },
  formInput: {
    ...formInput,
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
