export const longTermDateCheck = (currentDate: Date, checkDate: Date) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  if (currentDate.getTime() - checkDate.getTime() >= year) return true;
  return false;
};
