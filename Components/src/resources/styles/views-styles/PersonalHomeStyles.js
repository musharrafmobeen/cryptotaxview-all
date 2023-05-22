const styles = (theme) => ({
  root: {
    width: "96%",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 4}px)`,
    height: "97%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
  },
  cardsColumn: {
    width: "39%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeCard: {
    height: "49.5%",
    width: "100%",
    marginBottom: "1%",
  },
  reportsTabCard: {
    height: "49.5%",
    width: "100%",
    marginTop: "1%",
  },
  tableContainer: {
    width: "59%",
    height: "100%",
  },
});

export default styles;
