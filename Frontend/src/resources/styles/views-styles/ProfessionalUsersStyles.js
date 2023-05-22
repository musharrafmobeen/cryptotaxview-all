const row = {
  display: "flex",
  // justifyContent: "space-between",
  alignItems: "center",
};

const column = {
  ...row,
  flexDirection: "column",
};

const styles = (theme) => ({
  root: {
    width: "96%",
    height: "98%",
    margin: "20px auto",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 5}px)`, //"100%",
  },
  content: {
    ...column,
    alignItems: "normal",
    width: "100%",
    maxWidth: "100%",
    marginTop: "15px",
    overflowY: "scroll",
    height: "80%",
  },
  BigButtonsContainer: {
    height: "15%",
    display: "flex",
  },
  table: {
    margin: "1%",
    width: "98% !important",
    "& *": {
      fontFamily: "Roboto !important",
      letterSpacing: "0.5px !important",
      fontWeight: "700 !important",
      fontSize: "1rem !important",
    },
  },
  tableRow: {
    backgroundColor: "#E6F2FC",
    borderRadius: "2px",
    "& td": {
      border: "1px solid #DAECFA",
    },
  },
  tableRowData: {
    "& *": {
      fontWeight: "500 !important",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: "#ffffff",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#F2F8FF",
    },
    // border: "1px solid #DAECFA",
    "& td": {
      border: "1px solid #DAECFA",
      // padding: "5px",
    },
  },
  statusActive: {
    color: "#47982F !important",
    fontStyle: "italic",
  },
  statusActivate: {
    color: "#0074CB !important",
    textDecoration: "underline",
    cursor: "pointer",
  },
  platformIcon: {
    paddingRight: "5px",
  },
  italics: {
    fontStyle: "italic",
    fontWeight: "200 !important",
  },
  alignCenter: {
    display: "flex !important",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinksIcons: {
    paddingLeft: "5px",
    cursor: "pointer",
    width: "28px",
    height: "28px",
  },
  quickLinksIconsDisabled: {
    paddingLeft: "5px",
    cursor: "not-allowed",
  },
  btnCancel: {
    fontWeight: "bold !important",
    backgroundColor: "#DE5858 !important",
    color: "white !important",
  },
  btnYes: {
    fontWeight: "bold !important",
    backgroundColor: "#092C4C !important",
    color: "white !important",
  },
});

export default styles;
