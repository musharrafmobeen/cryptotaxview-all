const styles = (theme) => ({
  root: {
    height: "100%", //`calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
    maxHeight: "100%", //`calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
    // marginTop: theme.mixins.toolbar.minHeight,
    margin: "auto",
  },
  appBar: {
    position: "initial !important",
    width: "96% !important",
    margin: "1% auto",
    borderRadius: "8px",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: "inherit",
    padding: "0",
  },
  linksContainer: {
    display: "inherit",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "25%",
    minHeight: theme.mixins.toolbar.minHeight + 8,
  },
  link: {
    borderBottom: "1px solid grey",
  },
  navBtn: {
    border: `1px solid #E98D24 !important`,
    color: "#E98D24 !important",
  },
  outletChildRenderer: {
    // height: "100%",
  },
  tabCustom: {
    fontWeight: "bold !important",
    textTransform: "capitalize !important",
  },
});

export default styles;
