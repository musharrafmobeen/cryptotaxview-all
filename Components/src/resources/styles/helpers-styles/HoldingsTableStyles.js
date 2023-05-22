import {
  customTableContainer,
  dataRow,
  headerRow,
  tableBody,
  tableContainer,
  tableHead,
} from "./../common-styles/CommonTableStyles";

const styles = (theme) => ({
  root: {
    height: "100%",
    marginTop:"-10px",
  },
  pageHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    margin:"10px 5px",
  },
  pageHeading:{
    margin:"auto 5px",
    fonSize:"0.8em !important",
    fontWeight:"bold"
  },
  sortSelector: {
    display: "inherit",
    justifyContent: "space-between",
    "& p":{
      fontWeight:"bold",

    },
    "& *": {
      margin: "auto 5px",
    },
  },
  sortSelect:{
    width:"150px",
    height:"40px",
    border:"2px solid #D7E0E7",
    borderRadius:"4px",
    textAlign:"left",
    padding:"5px"
  },
  customTableContainer: {
    ...customTableContainer,
  },
  tableContainer: {
    ...tableContainer,
    maxHeight: "98%", //`calc(100vh - ${theme.mixins.toolbar.minHeight * 6}px)`,
    overflowX: "hidden",
  },
  tableHead: {
    ...tableHead,
    "& th": {
      fontWeight: "bold",
      backgroundColor: "#DAECFA",
      padding: "8px 10px",
    },
  },
  headerRow: {
    // ...headerRow,
  },
  tableBody: {
    ...tableBody,
  },
  internalSelect: {
    width: "125px",
    height: "40px",
  },
  dataRow: {
    ...dataRow,
    "& *": {
      // padding: "0 3px !important",
      margin: "0 auto",
      border: "none !important",
    },
  },
});

export default styles;
