import { checkAllowedSide } from "./getAllowedSides";

export const calculateAverageCostBasis = (data) => {
  let Sum = 0;
  for (let i = 0; i < data.length; i++) {
    checkAllowedSide(data[i].side) === 1
      ? (Sum = Sum + data[i].availableBalance * data[i].priceInAud)
      : (Sum = Sum + (data[i].priceInAud * data[i].amount) / data[i].cost);
  }
  return Sum;
};
