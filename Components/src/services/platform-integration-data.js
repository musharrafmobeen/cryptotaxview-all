import binanceImage from "./../resources/design-images/binance-image.svg";
import coinbaseImage from "./../resources/design-images/coinbase-image.svg";
import swyftxImage from "./../resources/design-images/swyftx-image.svg";
import coinspotImage from "./../resources/design-images/coinspot-image.svg";

export const exchangesData = [
  {
    img: binanceImage,
    name: "binance",
    alt: "binance",
  },
  {
    img: coinbaseImage,
    name: "coinbase",
    alt: "coinbase",
  },
  {
    img: swyftxImage,
    name: "swytx",
    alt: "swytx",
  },
  {
    img: coinspotImage,
    name: "coinspot",
    alt: "coinspot",
  },
];

export const findPlatformByName = (name) => {
  const platform = exchangesData.find((exchange) => exchange.name === name);
  return platform;
};

//function to get icons in data row for platforms.

export const getPlatformImageByName = (name) => {
  const logoImage = require(`./../resources/design-icons/platforms-icons/${name}.svg`);
  console.log("platform-icon", logoImage);
  return logoImage;
};
