const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const button = {
  border: "none",
  padding: "10px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
};

const plan = {
  ...row,
  margin: "auto 10px",
  borderRadius: "4px",
  width: "120px",
  padding: "5px",
  "&:hover": {
    cursor: "pointer",
  },
};

const styles = (theme) => ({
  toolBar: {
    backgroundColor: "#FFFFFF",
    // border: "1px solid #707070",
    height: "100%",
    width: "100%",
    padding: "5px",
  },
  navItem: {
    color: "#7F92A3",
    boxSizing: "border-box",
    // backgroundColor:'green',
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
    },
  },
  active: {
    color: "#0074CB",
    fontWeight: "bold",
    borderBottom: "3px solid #0074CB",
  },
  logoContainer: {
    paddingLeft: "12%",
    width: "250px",
    height: "100%",
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
  planContainer: {
    color: "black",
    position: "relative",
  },
  currentPlan: {
    ...plan,
    backgroundColor: "#0074CB",
    color: "white",
  },
  alterPlan: {
    ...plan,
    backgroundColor: "white",
    position: "absolute",
    bottom: "-110%",
    border: "1px solid #C2CFD9",
  },
  lockedPlan: {
    color: "#C2CFD9",
  },
  hidden: {
    display: "none",
  },
  btnActiveProfessional: {
    ...button,
    backgroundColor: "transparent",
    border: "1px solid #E98D24",
    color: "#E98D24",
    "&:hover": {
      backgroundColor: "#E98D24",
      color: "white",
      cursor: "pointer",
    },
  },
  navSection: {
    color: "black",
  },
  rowDiv: {
    ...row,
    width: "120px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  signOutBtn: {
    "& *": {
      color: "red",
    },
  },
});

export default styles;
