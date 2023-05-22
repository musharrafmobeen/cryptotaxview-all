import { checkAllowedSide } from "./getAllowedSides";
export const buySellCalculator = (symbol, side) => {
  if (symbol.split("/").length > 1) {
    //Exchange scenario
    if (checkAllowedSide(side) === 1) {
      return [symbol.split("/")[1], symbol.split("/")[0]];
    } else {
      return [symbol.split("/")[0], symbol.split("/")[1]];
    }
  } else {
    // Deposit scenario
    if (side === "buy") {
      return [symbol, ""];
    } else return ["", symbol];
  }
};
