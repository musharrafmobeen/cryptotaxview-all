import binanceImage from "./../resources/design-images/binance-image.svg";
import coinbaseImage from "./../resources/design-images/coinbase-image.svg";
import swyftxImage from "./../resources/design-images/swyftx-image.svg";
import coinspotImage from "./../resources/design-images/coinspot-image.svg";
import metamaskImage from "./../resources/design-images/metamask-image.svg";
import bitcoinImage from "./../resources/design-images/bitcoin-image.svg";
// import digitalSurgeImage from "./../resources/design-images/digitalSurge-image.svg";

export const exchangesData = [
  {
    img: binanceImage,
    name: "binance",
    alt: "binance",
    allowFileImport: true,
    allowAPIIntegration: true,
    allowAPISecret: true,
    metamaskIntegrator: false,
    bitcoinIntegrator: false,
  },
  {
    img: coinbaseImage,
    name: "coinbase",
    alt: "coinbase",
    allowFileImport: true,
    allowAPIIntegration: true,
    allowAPISecret: true,
    metamaskIntegrator: false,
    bitcoinIntegrator: false,
  },
  {
    img: swyftxImage,
    name: "swyftx",
    alt: "swyftx",
    allowFileImport: true,
    allowAPISecret: true,
    allowAPIIntegration: true,
    metamaskIntegrator: false,
    bitcoinIntegrator: false,
  },
  {
    img: coinspotImage,
    name: "coinspot",
    alt: "coinspot",
    allowFileImport: true,
    allowAPIIntegration: true,
    allowAPISecret: true,
    metamaskIntegrator: false,
    bitcoinIntegrator: false,
  },
  {
    img: metamaskImage,
    name: "metamask",
    alt: "metamask",
    allowFileImport: false,
    allowAPIIntegration: false,
    metamaskIntegrator: true,
    bitcoinIntegrator: false,
  },
  {
    img: bitcoinImage,
    name: "bitcoin",
    alt: "bitcoin",
    allowFileImport: false,
    allowAPIIntegration: true,
    metamaskIntegrator: false,
    bitcoinIntegrator: false,
  },

  // {
  //   img: digitalSurgeImage,
  //   name: "digital surge",
  //   alt: "digitalSurge",
  //   allowFileImport: true,
  //   allowAPIIntegration: true,
  //   metamaskIntegrator: false,
  //   bitcoinIntegrator: false,
  // },
];

export const findPlatformByName = (name) => {
  const platform = exchangesData.find((exchange) => exchange.name === name);
  return platform;
};

//function to get icons in data row for platforms.

export const getPlatformImageByName = (name) => {
  const logoImage = require(`./../resources/design-icons/platforms-icons/${name}.svg`);
  // console.log("platform-icon", logoImage);
  return logoImage;
};

export const getCoinImageByName = (name) => {
  try {
    const icon = require(`./../resources/design-icons/crypto-icons/${name}.svg`);
    if (!icon)
      return require("./../resources/design-icons/crypto-icons/generic.png");
    return icon;
  } catch (e) {}
  try {
    return require(`./../resources/design-icons/crypto-icons/generic.png`);
  } catch (e) {}
};

// export const getCurrencyIcon = (currency) => {
//   if (currency) {
//     try {
//       const icon = require(`./../../node_modules/cryptocurrency-icons/svg/color/${currency
//         .toLowerCase()
//         .substring(0, 3)}.svg`);
//       if (!icon)
//         return import("./../resources/design-images/techgenix-logo-closed.png");
//       return icon;
//     } catch (err) {
//       return "./../resources/design-images/techgenix-logo-closed.png";
//     }
//   }
// };
