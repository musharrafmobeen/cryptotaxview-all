const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const column = {
  ...row,
  flexDirection: "column",
};

const styles = (theme) => ({
  root: {
    ...row,
    width: "100%",
  },
  avatar: {
    marginRight: "5px",
  },
  textInfo: {
    ...column,
    alignItems: "flex-start",
    marginLeft: "5px",
  },
  userName: {
    fontWeight: "bold !important",
    textTransform: "capitalize !important",
  },
  userEmail:{
      color:"#C2CFD9 !important",
  },
});

export default styles;
