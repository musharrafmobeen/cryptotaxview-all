export const getFinancialYears = () => {
  let currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  if (currentMonth > 5) {
    currentYear++;
  }
  let financialYears = [];
  for (let i = 0; i < 10; i++) {
    financialYears.push({
      label: `${currentYear - i - 1}-${currentYear - i}`,
      value: `${currentYear - i - 1}-${currentYear - i}`,
    });
  }

  return financialYears;
};
