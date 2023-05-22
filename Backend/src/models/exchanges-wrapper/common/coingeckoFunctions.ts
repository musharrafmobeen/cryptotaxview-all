import axios from 'axios';
import { coingecko } from './coingecko';

const getCoinId = (symbol) => {
  const id = coingecko.filter((coin) => coin.symbol === symbol.toLowerCase())[0]
    ? coingecko.filter((coin) => coin.symbol === symbol.toLowerCase())[0].id
    : undefined;
  return id;
};

const coinGeckoRequest = async (id, date) => {
  const result = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}/history?date=${date}`,
  );
  return result.data;
};

export { getCoinId, coinGeckoRequest };
