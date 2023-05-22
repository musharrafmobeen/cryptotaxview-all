const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const font500 = {
  fontWeight: "500",
  fontFamily: "Roboto",
  letterSpacing: "0.5px",
};

const font700 = {
  fontWeight: "700",
  fontFamily: "Roboto",
  letterSpacing: "0.5px",
};

const styles = (theme) => ({
  dialogTitle: {
    ...row,
  },
  dialogHeading: {
    padding: "0",
    margin: "0",

    ...font700,
  },
  closeBtn: {
    color: "#DE5858",
    "&:hover": {
      cursor: "pointer",
    },
  },
  contentStack: {
    ...row,
    border: `1px solid #C2CFD9`,
    borderRadius: "4px",
    justifyContent: "flex-start",
    "& *": {
      margin: "0 5px",
    },
    margin: "5px auto",
    "&:hover": {
      cursor: "pointer",
    },
  },
  stackHeading: {
    marginTop: "5px",
    ...font700,
  },
  stackDescription: {
    color: "#7F92A3",
    marginBottom: "5px",
  },
  platformsContainer: {
    ...row,
    flexWrap: "wrap",
    "& *": {
      margin: "2px",
    },
  },
  integrationPlatform: {
    width: "30%",
    height: "50px",
    border: `1px solid #C2CFD9`,
    borderRadius: "4px",
    padding: "5px",
  },
  integrationPlatformImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    "&:hover": {
      cursor: "pointer",
    },
  },
  addressContainer: {
    display: "flex",
    alignItems: "center",
  },
  address: {
    ...font500,
    margin: "5px 10px 5px 10px",
    width: "500px",
  },
  rowCount: {
    ...font500,
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  input: {
    height: "30px",
    width: "80%",
    borderRadius: "5px",
    ...font500,
  },
  submit: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    borderRadius: "5px",
    backgroundColor: "#134675",
    color: "white",
    cursor: "pointer",
  },
  submitDisabled: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    borderRadius: "5px",
    backgroundColor: "#D7E0E7",
    color: "white",
    cursor: "not-allowed",
  },
  error: {
    ...font500,
    color: "#DE5858",
  },
});

export default styles;
