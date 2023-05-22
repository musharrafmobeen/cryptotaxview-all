import * as ccxt from 'ccxt';

export const exchangeConnection = (
  exchangeId: string,
  apiKey: string,
  secret: string,
) => {
  const exchangeClass = ccxt[exchangeId],
    exchange = new exchangeClass({
      apiKey,
      secret,
    });
  // exchange.set_sandbox_mode(true);
  return exchange;
};
