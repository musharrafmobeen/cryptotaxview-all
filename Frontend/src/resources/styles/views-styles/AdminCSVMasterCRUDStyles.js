// import ctv_logo_cropped from "./../../design-images/ctv-logo-cropped.svg";
const button = {
  border: "none",
  padding: "15px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
  "&:hover": {
    cursor: "pointer",
  },
};
const styles = (theme) => ({
  root: {
    width: "96%",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 4}px)`,
    height: "96%",

    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px auto",
  },
  paper: {
    alignItems: "stretch",
    padding: "5px",
    margin: "20px auto",
    "& *": {
      marginTop: "5px",
      marginBottom: "5px",
    },
    height: "100%",
  },
  paperHead: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnAddHead: {
    ...button,
    backgroundColor: "#134675",
    color: "white",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  actionButton: {
    cursor: "pointer",
    backgroundColor: "#092c4c",
    color: "white",
    padding: "7px 20px",
    borderRadius: "5px",
    marginRight: "10px",
  },
  actionButtonDelete: {
    cursor: "pointer",
    backgroundColor: "#de5858",
    color: "white",
    padding: "7px 20px",
    borderRadius: "5px",
    marginRight: "10px",
  },
  tableContainer: {
    maxHeight: "98%", //`calc(100vh - ${theme.mixins.toolbar.minHeight * 6}px)`,
    overflowX: "hidden",
  },
  tableHead: {
    "& th": {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#0074cb",
      padding: "8px 10px",
    },
  },
  dataRow: {
    "& *": {
      // padding: "0 3px !important",

      border: "none !important",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: "#f2f8ff",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#ffffff",
    },
  },
});

export default styles;
