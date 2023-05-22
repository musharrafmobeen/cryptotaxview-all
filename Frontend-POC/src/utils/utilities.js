import moment from "moment-timezone";

export const formatDate = (dateStr) => {
  let date = moment(dateStr);

  let strDate = date.format("MM/DD/YYYY hh:mm:ss A");
  return moment(strDate).tz("Australia/Sydney").format("DD,MMM  YYYY hh:mm A");
};

// export const formatDate = (dateStr) => {
//   let date = new moment(dateStr);
//   if (!date.isValid()) {
//     date = moment(dateStr, "DD/MM/YYYY hh:mm A", true);
//   }
//   return date.format("DD,MMM  YYYY HH:mm");
// };

export const formateString = (data) => {
  data.split();
};

export const formatAmount = (amount) => {
  if (amount !== "" || amount !== null || amount !== undefined)
    return amount.split(".")[0];
  return amount;
};

export const getCurrencyIcon = (currency) => {
  if (currency) {
    try {
      const icon = require(`./../../node_modules/cryptocurrency-icons/svg/color/${currency
        .toLowerCase()
        .substring(0, 3)}.svg`);
      if (!icon)
        return import("./../resources/design-images/techgenix-logo-closed.png");
      return icon;
    } catch (err) {
      return "./../resources/design-images/techgenix-logo-closed.png";
    }
  }
};

//1641854438000
//moment("03/13/2021 06:30 AM").tz("Australia/Sydney");
//1641854438000
