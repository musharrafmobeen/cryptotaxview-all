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
    height: "97%",
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
  heading: {
    margin: "0",
    padding: "0",
  },
  paperHeadButtonContainer: {
    ...row,
    width: "20%",
    "& *": {
      margin: "auto 5px",
      whiteSpace: "nowrap",
    },
  },
  btnAddHead: {
    ...button,
    backgroundColor: "#134675",
    color: "white",
  },
  label: {
    fontWeight: "bold",
  },
  select: {
    ...formInput,
  },
  stackContainer: {
    height: "90%",
    margin: "auto 1px",
  },
  paperStack: {
    ...column,
    border: "1px solid #C2CFD9",
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
    width: "98%",
    border: "1px solid #C2CFD9",
    borderRadius: "4px",
    padding: "0 10px",
    "& div:first-of-type": {
      ...row,
      justifyContent:"flex-start",
      "& *":{
        margin:"auto 5px"
      },
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
  dataRowCell: {
    textTransform: "capitalize",
    width: "25%",
  },
  transactionCount: {
    color: "#0074CB",
  },
  coinsCount: {
    color: "#7F92A3",
  },
  iconButton: {
    color: "black !important",
  },
});

export default styles;
