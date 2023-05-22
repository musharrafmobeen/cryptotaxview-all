const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const column = {
  ...row,
  flexDirection: "column",
};

const formInput = {
  border: `1px solid #7F92A3`,
  borderRadius: "4px",
  padding: "12px 5px",
  width: "50%",
  boxSizing: "border-box",
};

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
    margin: "0 auto",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 4.5}px)`,
    height: "100%",
  },
  paper: {
    ...column,
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
    ...row,
    width: "100%",
    alignItems: "center",
  },
  paperHeadProfessionalContainer: {
    ...row,
    padding: "0px 10px 0px 10px",
  },
  content: {
    ...row,
    justifyContent: "center",
  },
  homeBackBtn: {
    ...row,
    paddingRight: "10px",
    cursor: "pointer",
  },
  homeBackBtnText: {
    fontWeight: "600",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    color: "grey",
  },
  heading: {
    margin: "0",
    padding: "0",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  paperHeadButtonContainer: {
    ...row,
    width: "40%",
    "& *": {
      margin: "auto 5px",
      whiteSpace: "nowrap",
    },
    "@media (max-width: 1600px)": {
      width: "48%",
    },
    "@media (max-width: 1300px)": {
      width: "55%",
    },
  },
  btnAddHead: {
    ...button,
    backgroundColor: "#134675",
    color: "white",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  btnAddHeadProfessional: {
    ...button,
    marginLeft: "10px",
    backgroundColor: "#134675",
    color: "white",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    width: "300px",
  },
  label: {
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  labelProfessional: {
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    marginLeft: "10px",
    width: "100px",
  },
  select: {
    ...formInput,
    height: "49px",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    "& option": {
      fontSize: "15px",
      fontWeight: "500",
      fontFamily: "Roboto",
      letterSpacing: "0.5px",
    },
  },
  stackContainer: {
    height: "90%",
    margin: "auto 1px",
  },
  paperStack: {
    ...column,
    // border: "1px solid #C2CFD9",
    borderRadius: "4px",
    maxHeight: "100%",
    overflowY: "auto",
  },
  emptyMessage: {
    ...column,
    justifyContent: "center",
    height: "200px",
    "& *": {
      margin: "10px auto",
    },
  },
  btnAddStack: {
    ...button,
    padding: "10px 25px",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#092C4C",
    color: "#092C4C",
  },
  connectedPlatformRow: {
    ...row,
    // width: "100%",
    border: "1px solid #C2CFD9",
    borderRadius: "4px",
    padding: "0 10px",
    "& div:first-of-type": {
      ...row,
      justifyContent: "flex-start",
      "& *": {
        margin: "auto 5px",
      },
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
  dataRowCell: {
    textTransform: "capitalize",
    width: "25%",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  transactionCount: {
    color: "#0074CB",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  coinsCount: {
    color: "#7F92A3",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  iconButton: {
    color: "black !important",
  },
  iconButtonDisabled: {
    cursor: "not-allowed !important",
  },
  connectedIntegrationRow: {
    width: "99%",
  },
  connectedPlatformRowDetails: {
    display: "flex",
    backgroundColor: "#eaf2ff",
    marginTop: "-5px !important",
  },
  connectedPlatformAPIData: {
    width: "50%",

    "& div": {
      fontFamily: "Roboto",
      letterSpacing: "0.5px",
      paddingLeft: "20px",
      color: "#0074CB",
    },
  },
  connectedPlatformCSVData: {
    width: "50%",
  },
  connectedPlatformSubContainer: {
    backgroundColor: "white",
    margin: "2%",
    padding: "2%",
    borderRadius: "5px",
  },
  csvFileContainer: {
    borderRadius: "5px",
    backgroundColor: "#eaf2ff",
    padding: "0% 2% 0%",
    margin: "2% 0% 2%",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  csvFileName: {
    cursor: "pointer",
  },
  csvFileDeleteIcon: {
    cursor: "pointer",
  },
  csvFileDeleteIconDisabled: {
    cursor: "not-allowed",
  },
  professionalProfile: {
    ...row,
    justifyContent: "flex-end",
    "& *": {
      margin: "0px 10px 0px 10px",
    },
  },
  verticalContainer: {
    ...row,
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
