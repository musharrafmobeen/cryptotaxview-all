const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const footerItem = {
  margin: "0 2%",
  textDecoration: "none",
  color: "#969696",
  fonSize: "xx-small",
};
const styles = (theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "6px",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      borderRadius: "8px",
      backgroundColor:"#ECEFF4"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#134675", //'rgba(0,0,0,.1)',
      outline: "1px solid #D7E0E7",
      borderRadius: "8px",
    },
  },
  root: {
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    marginTop: theme.mixins.toolbar.minHeight,
    position: "relative",
    backgroundColor:"#F3F7FA",
  },
  childPropContainer: {
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 2}px)`,
    margin: "auto",
    padding: "10px 0",
  },
  footer: {
    ...row,
    width: "100%",
    position: "fixed",
    bottom: "0",
    // backgroundColor: "white",
  },
  footerLinks: {
    ...row,
    width: "30%",
    // height: theme.mixins.toolbar.minHeight,
    padding:"5px 25px"
  },
  linkItem: {
    ...footerItem,
    "&:hover": {
      cursor: "pointer",
    },
  },
  linkItemLast: {
    ...footerItem,
  },
});

export default styles;
