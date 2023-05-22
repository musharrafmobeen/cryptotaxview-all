export const getCurrencyIcon = (currency) => {
  if (currency) {
    try {
      const icon = require(`./../../node_modules/cryptocurrency-icons/svg/color/${currency.toLowerCase()}.svg`);
      if (!icon) return import("./../resources/design-images/CTV-Monogram.png");
      return icon;
    } catch (err) {
      return "./../resources/design-images/CTV-Monogram.png";
    }
  }
};
