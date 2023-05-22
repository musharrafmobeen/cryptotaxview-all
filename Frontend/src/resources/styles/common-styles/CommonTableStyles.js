const btnColor = "#134675";

export const customTableContainer = {
  overflowX: "initial",
};
export const tableContainer = {
  height: "90%",
  padding: "0",
  // maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight * 6}px)`,
  overflowY: "auto",
  position: "relative",
  paddingRight: "5px",
  paddingLeft: "2px",
};
export const tableHead = {
  position: "sticky !important",
  top: "0 !important",
  zIndex: "1",
  "& th": {
    color: "white",
    fontWeight: "bold",
    backgroundColor: btnColor,
    padding: "0",
  },
};
export const headerRow = {
  "& th:first-child": {
    borderTopLeftRadius: "8px",
  },
  "& th:last-child": {
    borderTopRightRadius: "8px",
  },
};
export const tableBody = {};
export const internalSelect = {
  width: "125px",
  height: "40px",
};
export const dataRow = {
  padding: "0",
  "& *": {
    padding: "0 3px !important",
    margin: "0 auto",
    border: "none !important",
  },
};
