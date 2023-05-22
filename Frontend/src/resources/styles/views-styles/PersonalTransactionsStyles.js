import {
  customTableContainer,
  dataRow,
  headerRow,
  tableBody,
  tableContainer,
  tableHead,
} from "./../common-styles/CommonTableStyles";

const row = {
  display: "flex",
  // justifyContent: "space-between",
  alignItems: "center",
};

const button = {
  border: "none",
  padding: "15px 25px",
  borderRadius: "4px",
  fontWeight: "bold",
  "&:hover": {
    cursor: "pointer",
  },
};

const rowProfessional = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const column = {
  ...row,
  flexDirection: "column",
};

const btnColor = "#134675";

const styles = (theme) => ({
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "pink",
    "& img": {
      width: "30px",
      height: "30px",
      backgroundColor: "red",
    },
    "& *": {
      padding: "0",
      margin: "0",
    },
  },
  root: {
    width: "96%",
    height: "98%",
    margin: "20px auto",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 5}px)`, //"100%",
  },
  content: {
    ...column,
    alignItems: "normal",
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    // padding: "1%",
    // "& *": {
    //   margin: "5px 0",
    // },
  },
  headRow: {
    ...row,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    margin: "10px 5px",
  },

  buttonGroup: {
    ...row,

    "& *": {
      margin: "auto 5px !important",
    },
  },
  actionButton: {
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
    letterSpacing: "0.5px !important",
    backgroundColor: `${btnColor} !important`,
    color: "white !important",
  },
  actionButtonDisabled: {
    backgroundColor: `#4f7fab !important`,
    color: "white !important",
    cursor: "not-allowed !important",
  },
  customTableContainer: {
    ...customTableContainer,
  },
  tableContainer: {
    ...tableContainer,
    maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight * 7}px)`,
  },
  tableHead: {
    ...tableHead,
  },
  headerRow: {
    ...headerRow,
  },
  tableBody: {
    ...tableBody,
    height: "auto",
  },
  internalSelect: {
    width: "125px",
    height: "40px",
  },
  dataRow: {
    ...dataRow,
  },
  errorDataRow: {
    backgroundColor: "#FFEBEB !important",
  },
  gain: {
    color: "#47982F !important",
  },
  lossError: {
    color: "#DE5858 !important",
  },
  circularProgress: {
    display: "block",
    margin: "0",
  },
  filtersGroup: {
    paddingLeft: "0.5% !important",
    width: "50%",
    display: "flex",
    alignItems: "center",
  },
  noData: {
    display: "flex",
    justifyContent: "center",
    height: "80px",
    paddingTop: "3%",
    // color: "#7f92a3",
    cursor: "pointer",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  allWalletsSelect: {
    paddingRight: "10px",
  },
  allCurrenciesSelect: {
    paddingRight: "10px",
  },
  resetToDefault: {},
  moreFilters: {
    display: "flex",
    alignItems: "center",
  },
  filterText: {
    fontWeight: "bold",
  },
  moreFiltersIconContainerInActive: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    height: "30px",
    width: "75px",
    paddingRight: "5px",
    marginLeft: "10px",
  },
  moreFiltersIconContainerActive: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    backgroundColor: "#0074CB",
    color: "white",
    height: "30px",
    width: "75px",
    paddingRight: "5px",
    marginLeft: "10px",
  },
  dataFilter: {
    display: "flex",

    height: "30px",
  },
  dateRangeFilterButtonActive: {
    fontWeight: "bold",
    // backgroundColor: "#0074CB",
    color: "#0074CB",
    height: "28px",
    width: "100px",
    border: "2px solid #0074CB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
    position: "relative",
    cursor: "pointer",
    // border
  },
  dateRangeFilterButtonInActive: {
    fontWeight: "bold",
    cursor: "pointer",
    height: "30px",
    width: "100px",
    border: "1px solid #c4c4c4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
    position: "relative",
    // border
  },
  moreFilterIcon: {
    display: "flex",
  },
  dateRangeModal: {
    position: "absolute",
    width: "400px",
    height: "100px",
    backgroundColor: "#f3f7fa",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
    marginTop: "40px",
  },
  dateRangePicker: {
    paddingRight: "10px",
    paddingLeft: "10px",
  },
  moreFilterText: {
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
  },
  isErrorContainer: {
    display: "flex",
    alignItems: "center",

    paddingRight: "10px",
  },
  allDataSourceSelect: {
    paddingRight: "10px",
  },
  isErrorText: {
    fontWeight: "600 !important",
    fontFamily: "Roboto !important",
  },
  // dateRangeFilterButtonActive: {
  //   display: "flex",
  // },
  // dateRangeFilterButtonInActive: {
  //   display: "flex",
  // },
  menuPaper: {
    maxHeight: "100px",
  },
  allErrorsSelect: {
    paddingRight: "10px",
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
  btnHeadProfessional: {
    ...button,
    marginLeft: "10px  !important",
    backgroundColor: "#134675 !important",
    color: "white !important",
    fontWeight: "700  !important",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",

    // width: "150px",
  },
  btnHeadProfessionalDisabled: {
    ...button,
    marginLeft: "10px  !important",
    fontWeight: "700  !important",
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
    backgroundColor: `#4f7fab !important`,
    color: "white !important",
    cursor: "not-allowed !important",
    // width: "150px",
  },
  selectProfessional: {
    marginLeft: "10px",
  },
});

export default styles;
