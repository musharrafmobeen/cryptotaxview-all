const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const button = {
  border: "none",
  padding: "10px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
};

const plan = {
  ...row,
  margin: "auto 10px",
  borderRadius: "4px",
  width: "120px",
  padding: "5px",
  "&:hover": {
    cursor: "pointer",
  },
};

const btnColor = "#134675";

const styles = (theme) => ({
  row: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  toolBar: {
    backgroundColor: "#FFFFFF",
    // border: "1px solid #707070",
    height: "100%",
    width: "100%",
    padding: "5px",
  },
  navItem: {
    color: "#7F92A3 !important",
    boxSizing: "border-box !important",
    // backgroundColor:'green',
    height: "100%",
    fontSize: "initial !important",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center !important",
    textTransform: "capitalize !important",
    // fontWeight: "bold !important",
    fontWeight: "500 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    "&:hover": {
      cursor: "pointer",
    },
  },
  navItemActive: {
    color: "#0074cb !important",
    boxSizing: "border-box !important",
    // backgroundColor:'green',
    height: "100%",
    fontSize: "initial !important",
    display: "flex !important",

    justifyContent: "center !important",
    alignItems: "center !important",
    textTransform: "capitalize !important",
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    "&:hover": {
      cursor: "pointer",
    },
  },
  active: {
    color: "#0074CB",
    fontWeight: "bold",
    borderBottom: "3px solid #0074CB",
  },
  logoContainer: {
    paddingLeft: "12%",
    width: "250px",
    height: "100%",
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
  planContainer: {
    color: "black",
    position: "relative",
  },
  currentPlan: {
    ...plan,
    backgroundColor: "#0074CB",
    color: "white",
  },
  alterPlan: {
    ...plan,
    backgroundColor: "white",
    position: "absolute",
    bottom: "-110%",
    border: "1px solid #C2CFD9",
  },
  lockedPlan: {
    color: "#C2CFD9",
  },
  hidden: {
    display: "none",
  },
  btnActiveProfessional: {
    ...button,
    backgroundColor: "transparent",
    border: "1px solid #E98D24",
    color: "#E98D24",
    "&:hover": {
      backgroundColor: "#E98D24",
      color: "white",
      cursor: "pointer",
    },
  },
  navSection: {
    color: "black",
  },
  rowDiv: {
    ...row,
    width: "120px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  signOutBtn: {
    "& *": {
      color: "red",
    },
  },
  capitalize: {
    textTransform: "capitalize",
  },
  btnCancel: {
    ...button,
    cursor: "not-allowed !important",
    backgroundColor: "#DE5858 !important",
    color: "white !important",
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",

    "&:hover": {
      backgroundColor: "#E43737 !important",
    },
  },
  btnYes: {
    ...button,
    backgroundColor: "#092C4C !important",
    color: "white !important",
  },
  actionButton: {
    cursor: "not-allowed",
    backgroundColor: `${btnColor} !important`,
    color: "white !important",
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",

    "&:hover": {
      backgroundColor: "#0074CB !important",
    },
  },
  buttonGroup: {
    ...row,
    justifyContent: "flex-end",
    paddingRight: "8px",
    "& *": {
      margin: "auto 5px !important",
    },
  },
  divider: {
    borderBottom: "1px solid black",
  },
  tableSubNavBar: {
    // marginLeft: "5% !important",
  },

  textBold: {
    fontWeight: "bold !important",
  },
  marginTopSmall: {
    marginTop: "10px !important",
  },
  uuid: {
    color: "#7F92A3 ",
    fontFamily: "Roboto !important",
    fontWeight: "500 !important",
    letterSpacing: "0.5px",
    paddingRight: "2%",
  },
  mainContainer: {
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "4px",
    marginTop: "5px !important",
    marginBottom: "5px !important",
  },
  tableContainer: {
    marginTop: "5px",
    // width: "99% !important",
    // paddingLeft: "1%",
    maxHeight: "200px",
  },
  table: {
    width: "99% !important",
  },
  tableHeadRow: {
    // backgroundColor: "#E6F2FC",
    "& *": {
      fontWeight: "600 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px",
      fontSize: "16px !important",
    },
  },
  tableHeadRowError: {
    backgroundColor: "#FFEAEA",
    "& *": {
      fontWeight: "600 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px",
      fontSize: "16px !important",
    },
  },

  tableRow: {
    "& *": {
      fontWeight: "500 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px !important",
      fontSize: "16px !important",
    },
    // "&:nth-of-type(even)": {
    //   backgroundColor: "#F2F8FF",
    // },
  },
  holdingsHeading: {
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    paddingLeft: "10px",
  },
  rowDetailContainer: {
    borderTop: "1px solid #CCCCCC",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rowDetailLabel: {
    width: "150px",
    paddingLeft: "10px",
    "& p": {
      fontWeight: "600 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px !important",
    },
  },
  rowDetailValue: {
    paddingLeft: "30px",
    "& p": {
      fontWeight: "500 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px !important",
    },
  },
  detailsHeadingContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    "& h3": { textTransform: "capitalize" },
    "& p": {
      fontWeight: "500 !important",
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px !important",
      paddingLeft: "10px",
      color: "#CCCCCC",
    },
  },
});

export default styles;
