import {
  customTableContainer,
  dataRow,
  tableBody,
  tableContainer,
  tableHead,
} from "./../common-styles/CommonTableStyles";

const rowProfessional = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const styles = (theme) => ({
  // root: {
  //   height: "100%",
  //   marginTop: "-10px",
  // },
  tableRoot: { height: "100%", marginTop: "-10px", borderRadius: "8px" },
  pageHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 5px",
    paddingTop: "20px",
  },
  pageHeading: {
    margin: "auto 5px",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: "600 !important",
  },
  sortSelector: {
    display: "inherit",
    justifyContent: "space-between",
    "& p": {
      fontWeight: "bold",
    },
    "& *": {
      margin: "auto 5px",
    },
  },
  sortSelect: {
    width: "150px",
    height: "40px",
    border: "1px solid black",
    borderRadius: "4px",
    textAlign: "left",
    padding: "5px",
  },
  customTableContainer: {
    ...customTableContainer,
    height: "98% !important",
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
      color: "white",
      backgroundColor: "#0074cb",
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
    "&:nth-of-type(odd)": {
      backgroundColor: "#f2f8ff",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#ffffff",
    },
  },
  capitalize: {
    textTransform: "capitalize",
  },
  loadingImage: {
    display: "flex",
    justifyContent: "center",
  },
  errorGettingHoldings: {
    display: "flex",
    justifyContent: "center",
  },
  paperHeadProfessionalContainer: {
    ...rowProfessional,
    padding: "5px 10px 5px 10px",
  },
  contentProfessional: {
    ...rowProfessional,
    justifyContent: "center",
  },
  homeBackBtn: {
    ...rowProfessional,
    paddingRight: "10px",
    cursor: "pointer",
  },
  homeBackBtnText: {
    fontWeight: "600",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    color: "grey",
  },
  professionalProfile: {
    ...rowProfessional,
    justifyContent: "flex-end",
    "& *": {
      margin: "0px 10px 0px 10px",
    },
  },
  verticalContainer: {
    ...rowProfessional,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  firstName: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    fontWeight: "700",
    fontSize: "25px",
  },
  email: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    fontWeight: "400",
    fontSize: "15px",
  },
});

export default styles;
