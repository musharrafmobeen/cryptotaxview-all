// import ctv_logo_cropped from "./../../design-images/ctv-logo-cropped.svg";

const styles = (theme) => ({
  root: {
    width: "96%",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 4}px)`,
    height: "96%",

    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px auto",
  },
  actionItem: {
    backgroundColor: "lightgrey",
    width: "33.33%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "grey",
      color: "white",
    },
  },
});

export default styles;
