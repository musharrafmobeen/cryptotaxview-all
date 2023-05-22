const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItmes: "center",
};

const column = {
  ...row,
  flexDirection: "column",
};

const styles = (theme) => ({
  cardRoot: {
    ...row,
    alignItems: "center",
    "& *": {
      margin: "auto 3px",
    },
  },
  infoRow: {
    ...row,
    alignItems: "center",
    cursor: "pointer",
  },
  textColumn: {
    ...column,
    height: "25px",
  },
  reportTitle: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  reportDate: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    fontSize: "small",
    color: "#7F92A3",
    alignSelf: "flex-start",
  },
});

export default styles;
