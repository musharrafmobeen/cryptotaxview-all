const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};

const styles = (theme) => ({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: "1",
    marginLeft: "80px",
    marginBottom: "70px",
    // padding: "20px",
    width: "25%",
    backgroundColor: "white",
    justifyContent: "space-between",
    minHeight: "85px",
    borderRadius: "5px",
    // border: "1px solid #C2CFD9",
    boxShadow:
      "rgba(19,70,117, 0.19) 0px 10px 20px, rgba(19,70,117, 0.23) 0px 6px 6px;",
    ...flexAlignCenter,

    // transition: "all 2s ease-out",
  },
  icon: {
    paddingLeft: "20px",
  },
  gif: {
    width: "70px",
  },
  close: { ...flexAlignCenter, paddingRight: "20px", cursor: "pointer" },
  text: {
    ...flexAlignCenter,
    fontFamily: "Roboto",
    justifyContent: "left",
    width: "-webkit-fill-available",
    paddingLeft: "20px",
  },
});
export default styles;
