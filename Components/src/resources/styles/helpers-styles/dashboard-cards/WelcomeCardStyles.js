import ctv_logo_cropped from "./../../../design-images/ctv-logo-cropped.svg";

const styles = (theme) => ({
  welcomeCardPaper: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  logoContainer: {
    backgroundImage: `url(${ctv_logo_cropped})`,
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
});

export default styles;
