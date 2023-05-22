const column = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
};

const rowProfessional = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const formInput = {
  border: `1px solid #7F92A3`,
  borderRadius: "4px",
  padding: "10px 5px",
  width: "75%",
  boxSizing: "border-box",
};

const button = {
  border: "none",
  padding: "10px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
  "&:hover": {
    cursor: "pointer",
  },
};

const styles = (theme) => ({
  root: {
    width: "96%",
    margin: "0 auto",
  },
  paper: {
    ...column,
    // alignItems: "felx-start",
    padding: "5px",
    margin: "20px auto",
    "& *": {
      marginTop: "5px",
      marginBottom: "5px",
    },
  },
  paperHead: {
    ...row,
    width: "100%",
    alignItems: "center",
  },
  paperHeading: {
    margin: "0",
    padding: "0",
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  paperForm: {
    ...row,
    border: "1px solid #C2CFD9",
    borderRadius: "4px",
  },
  paperFormReports: {
    ...row,
    border: "1px solid #C2CFD9",
    borderRadius: "4px",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    overflowY: "auto",
    maxHeight: "350px",
    "& *": {
      height: "30%",
    },
  },
  formColumn: {
    ...column,
    width: "50%",
    margin: "auto 10px",
  },
  formControl: {
    ...row,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  select: {
    ...formInput,
    textTransform: "capitalize",

    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  input: {
    ...formInput,

    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  radioInput: {
    ...formInput,
    ...row,
    border: "none",
    justifyContent: "flex-start",
    alignItems: "center",
    "& *": {
      margin: "auto 5px",
    },

    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  grow: {
    flexGrow: "1",
  },
  btnGenerate: {
    ...button,
    backgroundColor: "#134675",
    color: "white",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  btnGenerateDisabled: {
    ...button,
    backgroundColor: "#4f7fab",
    color: "white",
    cursor: "not-allowed !important",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  controlsRow: {
    ...row,
    "& *": {
      margin: "auto 5px",
    },
  },
  btnDownload: {
    ...button,
    ...row,
    padding: "5px 10px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #0074CB",
    color: "#0074CB",
  },
  btnDownloadDisabled: {
    ...button,
    ...row,
    padding: "5px 10px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #0074CB",
    color: "#4f7fab !important",
    cursor: "not-allowed !important",
  },
  btnDelete: {
    ...button,
    ...row,
    padding: "5px 10px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #DE5858",
    color: "#DE5858",
  },
  btnDeleteDisabled: {
    ...button,
    ...row,
    padding: "5px 10px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #DE5858",
    color: "#DE5858",
    cursor: "not-allowed !important",
  },

  search: {
    position: "relative",
    marginLeft: 0,
    width: "100%",
    backgroundColor: "#D7E0E7",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto",
    },
    borderRadius: "4px",
  },
  searchIcon: {
    width: theme.spacing(4),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#C2CFD9",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: `${theme.spacing(5)} !important`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
  capitalize: {
    textTransform: "capitalize",
  },
  noReportText: {
    height: "100px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  },
  loadingGif: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paperHeadProfessionalContainer: {
    ...rowProfessional,
    padding: "5px 10px 5px 10px",
  },
  contentProfessional: {
    ...rowProfessional,
    justifyContent: "center",
  },
  homeBackBtn: {
    ...rowProfessional,
    paddingRight: "10px",
    cursor: "pointer",
  },
  homeBackBtnText: {
    fontWeight: "600",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    color: "grey",
  },
  professionalProfile: {
    ...rowProfessional,
    justifyContent: "flex-end",
    "& *": {
      margin: "0px 10px 0px 10px",
    },
  },
  verticalContainer: {
    ...rowProfessional,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  firstName: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    fontWeight: "700",
    fontSize: "25px",
  },
  email: {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    fontWeight: "400",
    fontSize: "15px",
  },
  buyPlanBannerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffeaea",
    color: "#de5858",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "600",
    fontFamily: "Roboto",
    cursor: "pointer",
  },
});

export default styles;
