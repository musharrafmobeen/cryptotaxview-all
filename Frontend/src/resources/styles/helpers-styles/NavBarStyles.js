const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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

const styles = (theme) => ({
  toolBar: {
    backgroundColor: "#FFFFFF",
    // border: "1px solid #707070",
    height: "100%",
    width: "100%",
    boxShadow: "1px 3px 8px 3px rgba(0,146,255,0.15);",
    // boxShadow: "1px 3px 8px 3px rgba(0,0,0,0.15)",
    // padding: "5px",
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
    fontWeight: "bold !important",
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
    fontWeight: "bold !important",
    justifyContent: "center !important",
    alignItems: "center !important",
    textTransform: "capitalize !important",
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
    paddingLeft: "22%",
    width: "100%",
    height: "100%",
    "& img": {
      width: "100%",
      height: "100%",
    },
    "@media (max-width: 1300px)": {
      width: "185px",
    },
  },
  planContainer: {
    width: "100%",
    paddingLeft: "15%",
    color: "black",
    position: "relative",
    "@media (max-width: 1300px)": {
      paddingLeft: "50%",
    },
  },
  currentPlan: {
    ...plan,

    width: "67%",
    // backgroundColor: "#0074CB",
    border: "1px solid #CCCCCC",
    color: "black",
    fontWeight: "500 !important",
    fontFamily: "Roboto",

    "@media (max-width: 1300px)": {
      width: "173px",
    },
  },
  alterPlan: {
    ...plan,
    width: "57%",
    backgroundColor: "white",
    height: "64%",
    position: "absolute",
    zIndex: "2",
    bottom: "-100%",
    border: "1px solid #C2CFD9",
    fontWeight: "500 !important",
    fontFamily: "Roboto",
    whiteSpace: "nowrap",
    "@media (max-width: 1300px)": {
      width: "55.5%",
    },
  },
  lockedPlan: {
    fontWeight: "500 !important",
    fontFamily: "Roboto",
    color: "#E98D24",
  },
  hidden: {
    display: "none",
  },
  planButton: {
    height: "30px",
  },
  btnActiveProfessional: {
    height: "100%",
    borderRadius: "4px",
    fontWeight: "bold",
    backgroundColor: "transparent",
    border: "1px solid #E98D24",
    color: "#E98D24",
    // "&:hover": {
    //   backgroundColor: "#E98D24",
    //   color: "white",
    //   cursor: "pointer",
    // },
  },
  navSection: {
    // paddingTop: "8px",
    color: "black",
  },
  rowDiv: {
    ...row,
    justifyContent: "flex-end",
    paddingLeft: "6%",
    width: "135px",
    "@media (max-width: 1300px)": {
      paddingLeft: "40px",
    },
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
  userFirstName: {
    whiteSpace: "nowrap",
    textTransform: "capitalize",
    paddingRight: "10px",
    fontWeight: "500 !important",
    fontFamily: "Roboto !important",
  },
  red: {
    backgroundColor: "red",
  },
  LockIcon: {
    paddingLeft: "4%",
  },
  userDropDownIcon: {
    paddingRight: "22%",
    // paddingLeft: "1%",
  },
  userNavBarContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  otherIconButtonsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    "@media (max-width: 1300px)": {
      paddingRight: "40px",
    },
  },
  notificationIcon: {
    paddingRight: "3%",
    paddingLeft: "6%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  helpIcon: {
    paddingLeft: "6%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  navTabContainer: {
    marginTop: "5px",
    "@media (max-width: 1300px)": {
      marginLeft: "40px",
    },
  },
});

export default styles;
