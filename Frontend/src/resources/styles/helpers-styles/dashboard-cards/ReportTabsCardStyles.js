const row = {
  display: "flex",
  justifyContent: "space-between",
};

const column = {
  ...row,
  flexDirection: "column",
};

const formInput = {
  border: `1px solid #7F92A3`,
  borderRadius: "4px",
  padding: "10px 5px",
  width: "75%",
  boxSizing: "border-box",
};

const button = {
  border: "none",
  padding: "10px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
  "&:hover": {
    cursor: "pointer",
  },
};

const styles = (theme) => ({
  reportsTabRootPaper: {
    height: "100%",
    borderRadius: "8px",
  },
  reportsLogCard: {
    height: "100%",
    ...column,
    alignItems: "center",
  },
  searchInput: {
    width: "95%",
    padding: "10px 5px",
    margin: "5px auto",
    border: `1px solid #D7E0E7`,
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  logCardPaper: {
    height: "80%",
    maxHeight: "80%",
    overflowY: "auto",
    width: "95%",
    margin: "5px auto",
  },
  noLogContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noLogText: {
    fontWeight: "bold",
    color: "#C2CFD9",
  },
  btnGenerate: {
    ...button,
    borderRadius: "4px",
    padding: "10px 25px",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#092C4C",
    color: "#092C4C",
  },
  formPaper: {
    height: "90%",
    width: "95%",
    margin: "auto",
    padding: "0 10px",
    overflowY: "auto",
    "& *": {
      marginTop: "5px",
      marginBottom: "5px",
    },
  },
  formControl: {
    ...row,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  },
  select: {
    ...formInput,
  },
  input: {
    ...formInput,
  },
  radioInput: {
    ...formInput,
    ...row,
    border: "none",
    justifyContent: "flex-start",
    alignItems: "center",
    "& *": {
      margin: "auto 5px",
    },
  },
  formBtnGenerate: {
    ...button,
    backgroundColor: "#134675",
    color: "white",
    width: "100%",
  },
});

export default styles;
