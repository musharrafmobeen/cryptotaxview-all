// import ctv_logo_cropped from "./../../design-images/ctv-logo-cropped.svg";

const styles = (theme) => ({
  root: {
    width: "96%",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 4}px)`,
    height: "96%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px auto",
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
  welcomeCardPaper: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  logoContainer: {
    // backgroundImage: `url(${ctv_logo_cropped})`,
    backgroundPosition: "left",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    height: "75%",
    width: "24.5%",
  },
  welcomeTextContainer: {
    width: "74.5%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    "& *": {
      fontWeight: "bold !important",
    },
  },
  textHeadingRow: {
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
  heading: {
    fontWeight: "bold !important",
    fontSize: "1.5vw !important",
    padding: "0",
    marin: "0",
  },
  coloredText: {
    color: "#0074CB",
  },
  linkedText: {
    color: "#0074CB",
    textDecoration: "underline",
    "&:hover": {
      cursor: "pointer",
    },
  },
  actionTextContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "4% auto",
    "& *": {
      margin: "auto 4px !important",
    },
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
  tableContainerFullWidth: {
    width: "100%",
    height: "100%",
  },
});

export default styles;
