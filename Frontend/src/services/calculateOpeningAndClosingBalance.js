export const calculateOpeningAndClosingBalance = (data) => {
  let currentBalance = 0;
  let prevBalance = 0;
  for (let i = 0; i < data.length; i++) {
    currentBalance = data[i].availableBalance + currentBalance;
    prevBalance = data[i].availableBalance + prevBalance;
  }

  return [prevBalance, currentBalance];
};
