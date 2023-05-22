const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const styles = (theme) => ({
  dialogTitle: {
    ...row,
  },
  dialogHeading: {
    padding: "0",
    margin: "0",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
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
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  stackDescription: {
    color: "#7F92A3",
    marginBottom: "5px",
  },
  platformImageContainer: {
    width: "200px",
    height: "50px",
    padding: "5px",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  },
});

export default styles;
