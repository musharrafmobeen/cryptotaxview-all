// import ctv_logo_cropped from "./../../design-images/ctv-logo-cropped.svg";
const BLUE_DARK = "#134675";

const font = {
  fontFamily: "Roboto",
  letterSpacing: "0.5px",
};

const fontHeavy = {
  fontWeight: "600",
};

const fontSizeLarge = {
  fontSize: "22px",
};

const fontSizeMedium = {
  fontSize: "18px",
};

const displayFlex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const stdMarginTopAndBottom = {
  margin: "10px 0px 10px 0px",
};

const styles = (theme) => ({
  root: {
    width: "96%",
    height: "96%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "15px auto",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "10px",
    overflowY: "auto",
  },
  actionItem: {
    ...displayFlex,

    backgroundColor: "lightgrey",
    width: "33.33%",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "grey",
      color: "white",
    },
  },
  homeBackBtn: {
    ...font,
    ...displayFlex,

    margin: "5px",
    cursor: "pointer",
    width: "100px",
    padding: "5px",
  },
  bodyContent: {
    ...displayFlex,
    ...fontHeavy,

    flexDirection: "column",
    width: "100%",
  },
  title: {
    ...font,
    ...fontHeavy,
    ...displayFlex,
    ...fontSizeLarge,
  },
  titleDetails: {
    ...font,
    ...fontHeavy,
    ...displayFlex,
    ...fontSizeMedium,
    ...stdMarginTopAndBottom,
  },
  planContainer: {
    ...stdMarginTopAndBottom,
    ...displayFlex,
    border: `3px solid ${BLUE_DARK}`,
    borderRadius: "5px",
  },
  personal: {
    ...font,
    ...fontHeavy,
    ...fontSizeMedium,

    backgroundColor: BLUE_DARK,
    color: "white",
    padding: "5px 20px 5px 20px",
    cursor: "pointer",
  },
  personalAlt: {
    ...font,
    ...fontHeavy,
    ...fontSizeMedium,

    backgroundColor: "white",
    color: BLUE_DARK,
    padding: "5px 20px 5px 20px",
    cursor: "pointer",
  },
  professional: {
    ...font,
    ...fontHeavy,
    ...fontSizeMedium,

    backgroundColor: BLUE_DARK,
    color: "white",
    padding: "5px 20px 5px 20px",
    cursor: "pointer",
  },
  professionalAlt: {
    ...font,
    ...fontHeavy,
    ...fontSizeMedium,

    backgroundColor: "white",
    color: BLUE_DARK,
    padding: "5px 20px 5px 20px",
    cursor: "pointer",
  },
  plansContainer: {
    display: "flex",
    paddingBottom: "20px",
  },
  financialYearRow: {
    marginTop: "10px",
  },
  select: {
    height: "35px",
    marginLeft: "15px",
    ...font,
    ...fontSizeMedium,
    ...fontHeavy,
    borderRadius: "5px",
    border: `3px solid ${BLUE_DARK}`,
    color: BLUE_DARK,
    cursor: "pointer",
  },
  label: {
    ...font,
    ...fontSizeMedium,
  },
  paymentContainer: {
    marginLeft: "-33px",
    position: "absolute",
    backgroundColor: "white",
    top: 0,
    zIndex: 3,
    width: "100%",
    height: "960px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentImage: {
    width: "50%",
  },
});

export default styles;
