export const roundNumberDecimal = (number, decimalPoint) => {
  let multiplier = 10 * 10 ** decimalPoint;
  return Math.round((number + Number.EPSILON) * multiplier) / multiplier;
};
