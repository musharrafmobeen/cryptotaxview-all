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
    margin: "0 auto",
    // height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 5}px)`, //"100%",
  },
  content: {
    ...column,
    alignItems: "normal",
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    // padding: "1%",
    "& *": {
      margin: "5px 0",
    },
  },
  headRow: {
    ...row,
  },
  buttonGroup: {
    ...row,
    "& *": {
      margin: "auto 5px !important",
    },
  },
  actionButton: {
    backgroundColor: `${btnColor} !important`,
    color: "white !important",
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
});

export default styles;
