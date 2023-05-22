import { fade } from "@material-ui/core/styles/colorManipulator";

const lightThemeBgColor = "#E5E5E5";
const appThemeMainColor = "#2B406A"; //"#674FFF";

const styles = (theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "4px",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      borderRadius: "4px",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#2F4673", //'rgba(0,0,0,.1)',
      outline: "1px solid slategrey",
      borderRadius: "8px",
    },
  },
  tableRowPadding: {
    padding: "7px",
  },
  dateHeading: {
    fontSize: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1em",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "4%",
      marginTop: "4%",
      position: "relative",
      marginRight: "auto",
      marginLeft: "auto",
      zIndex: "3",
      flexDirection: "column",
    },
  },
  pageHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1em",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "4%",
      marginTop: "4%",
      position: "relative",
      marginRight: "auto",
      marginLeft: "auto",
      zIndex: "3",
      flexDirection: "column",
    },
  },
  toggleButtonContainer: {
    padding: "0.2%",
    backgroundColor: "#E3E4E5",
    position: "absolute",
    right: "2%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "4%",
      marginTop: "4%",
      position: "relative",
      marginRight: "auto",
      marginLeft: "auto",
      zIndex: "3",
      flexDirection: "column",
    },
    "& *": {
      whiteSpace: "nowrap",
      textAlign: "center",
    },
  },
  btnAddNewGrievance: {
    marginTop: "3%",
    right: "2%",
    backgroundColor: "#674FFF",
    padding: "0.4em",
    color: theme.palette.common.white,
    // width:"12rem",
    borderRadius: "0.2rem",
    // height:"2em",
    transition: "all 0.3s",
    border: `1px solid #674FFF`,
    "&:hover": {
      backgroundColor: "white",
      color: "#674FFF",
    },
  },
  selectedButton: {
    margin: "1%",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: appThemeMainColor,
      color: "white",
    },
    whiteSpace: "nowrap",
    textAlign: "center",
  },

  unSelectedButton: {
    margin: "1%",
    backgroundColor: lightThemeBgColor,
    "&:hover": {
      backgroundColor: appThemeMainColor,
      color: "white",
    },
    [theme.breakpoints.up("xl")]: {
      fontSize: "x-large",
    },
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  tableContainer: {
    width: "95%",
    margin: "0 2%",
    padding: "1em",
    maxHeight: "650px",
    overflowY: "auto",
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: `0 0.4em`,
  },
  tableHeading: {
    position: "sticky",
    // zIndex:"12",
    "& th": {
      color: "#C2C5C7",
      fontWeight: "bold",
    },
  },
  tableBody: {},
  tableRow: {
    height: "5px !important",
  },
  infoDataRow: {
    padding: "1em",
    borderRadius: "8px",
    backgroundColor: fade(theme.palette.common.white, 0.85),
    "&:hover": {
      cursor: "pointer",
      boxShadow: `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
      backgroundColor: fade(theme.palette.common.white, 0.98),
    },
    "& td:first-child": {
      borderTopLeftRadius: "8px",
      borderBottomLeftRadius: "8px",
    },
    "& td:last-child": {
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
    },
  },
  textInfoCell: {
    textTransform: "capitalize",
    // fontWeight: "bold",
  },
  currencyInfoContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "25%",
    margin: "0 auto",
    textAlign: "left",
  },
  currencyInfoContainerExchange: {
    display: "flex",
    alignItems: "center",
  },
  currencyIcon: {
    width: "32px",
    height: "32px",
  },
  currencyText: {
    textAlign: "left",
    paddingLeft: "15px",
    width: "20px",
  },
  tableFooterText: {
    color: "black",
    fontWeight: "bold",
    fontSize: "large",
  },
  footerRowContainer: {
    width: "95%",
    margin: "0 2%",
    position: "fixed",
  },
  footerRow: {
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "none",
    "&:hover": {
      color: "red",
      backgroundColor: "none",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#006838",
  },
  searchBarContainer: {
    padding: "1em",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1%",
    marginBottom: "0.75%",
  },
  nameSearch: {
    width: "30%",
    float: "left",
    left: "1%",
    [theme.breakpoints.down("sm")]: {
      width: "98%",
    },
  },
});

export default styles;
