import { Transaction } from 'src/models/transactions/entities/transaction.entity';
import { getCoinId, coinGeckoRequest } from '../common/coingeckoFunctions';

const allowableMaster = {
  incoming: [
    'receive',
    'buy',
    'airdrop',
    'staking reward',
    'interest',
    'gift',
    'chain split',
    'mining',
    'income',
    'cashback',
    'realised profit',
    'fiat deposit',
    'borrow',
    'ignore',
    'distribution',
    'isolatedMargin loan',
    'large OTC trading',
    'margin loan',
    'p2p trading',
    'pos savings interest',
    'pos savings redemption',
    'deposit',
  ],
  outgoing: [
    'sell',
    'send',
    'lost/stolen',
    'liquidation',
    'fee',
    'loan fee',
    'loan repayment',
    'personal use',
    'realised loss',
    'fiat withdrawl',
    'mint',
    'funding fee',
    'isolatedmargin repayment',
    'margin repayment',
    'pos savings purchase',
    'realize profit and loss',
    'small assets exchange bnb',
    'withdraw',
  ],
};

export const calculateHoldings = async (trades) => {
  const coins = {};
  const holdings = { info: { balances: [] } };
  for (let i = 0; i < trades.length; i++) {
    if (allowableMaster.incoming.includes(trades[i].side.toLowerCase())) {
      const [BC, SC] = trades[i].symbol.split('/');
      if (coins[BC]) {
        holdings.info.balances[coins[BC].index].free += trades[i].amount;
      } else {
        coins[BC] = { index: holdings.info.balances.length };
        holdings.info.balances.push({
          asset: BC,
          free: trades[i].amount,
          locked: 0,
        });
      }
      if (coins[SC]) {
        holdings.info.balances[coins[SC].index].free -= trades[i].cost;
      } else {
        coins[SC] = { index: holdings.info.balances.length };
        holdings.info.balances.push({
          asset: SC,
          free: -trades[i].cost,
          locked: 0,
        });
      }
    } else if (
      allowableMaster.outgoing.includes(trades[i].side.toLowerCase())
    ) {
      const [SC, BC] = trades[i].symbol.split('/');
      if (coins[SC]) {
        holdings.info.balances[coins[SC].index].free -= trades[i].amount;
      } else {
        coins[SC] = { index: holdings.info.balances.length };
        holdings.info.balances.push({
          asset: SC,
          free: -trades[i].amount,
          locked: 0,
        });
      }

      if (coins[BC]) {
        holdings.info.balances[coins[BC].index].free += trades[i].cost;
      } else {
        coins[BC] = { index: holdings.info.balances.length };
        holdings.info.balances.push({
          asset: BC,
          free: trades[i].cost,
          locked: 0,
        });
      }
    }
  }

  for (let i = 0; i < holdings.info.balances.length; i++) {
    if (
      holdings.info.balances[i].free > 0 ||
      holdings.info.balances[i].locked > 0
    ) {
      try {
        const coinId = getCoinId(holdings.info.balances[i].asset);
        if (coinId) {
          const date = new Date();
          const result = await coinGeckoRequest(
            coinId,
            '' +
              date.getDate() +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getFullYear(),
          );

          holdings.info.balances[i] = {
            ...holdings.info.balances[i],
            currentPrice: result.market_data
              ? result.market_data.current_price.aud
              : 0,
          };
        } else {
          holdings.info.balances[i] = {
            ...holdings.info.balances[i],
            currentPrice: 0,
          };
        }
      } catch (e) {
        holdings.info.balances[i] = {
          ...holdings.info.balances[i],
          currentPrice: 0,
        };
      }
    } else {
      holdings.info.balances[i] = {
        ...holdings.info.balances[i],
        currentPrice: 0,
      };
    }
  }

  return holdings;
};

export const calculateInvestments = async (
  trades: Transaction[],
  fiscalYear: string,
) => {
  const previousHoldings = {};
  const coinHoldings = {};
  const sortedTrades = trades.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );

  for (let i = 0; i < sortedTrades.length; i++) {
    if (allowableMaster.incoming.includes(sortedTrades[i].side.toLowerCase())) {
      const fiscalYearTransaction = getFiscalYear(
        sortedTrades[i].datetime.toString(),
      );
      const isCurrentFiscalYear = checkFiscalYear(
        fiscalYear,
        fiscalYearTransaction,
      );

      if (isCurrentFiscalYear === -1) {
        if (sortedTrades[i].symbol.includes('/')) {
          const [boughtCoin, soledCoin] = sortedTrades[i].symbol.split('/');
          if (previousHoldings.hasOwnProperty(soledCoin)) {
            const prvCostBases =
              previousHoldings[soledCoin]['previousCostBases'];

            const costBasesCoin = previousAllCostBases(
              prvCostBases,
              sortedTrades[i].cost,
            );

            previousHoldings[soledCoin] = {
              amount:
                previousHoldings[soledCoin]['amount'] - sortedTrades[i].cost,
              totalCostBase:
                previousHoldings[soledCoin]['totalCostBase'] -
                costBasesCoin.totalCostBase,
              previousCostBases: costBasesCoin.costBases,
            };
          } else {
            previousHoldings[soledCoin] = {
              amount: -sortedTrades[i].cost,
              totalCostBase: 0,
              previousCostBases: [],
            };
          }
          if (previousHoldings.hasOwnProperty(boughtCoin)) {
            previousHoldings[boughtCoin] = {
              amount:
                previousHoldings[boughtCoin]['amount'] + sortedTrades[i].amount,
              totalCostBase:
                previousHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          } else {
            previousHoldings[boughtCoin] = {
              amount: sortedTrades[i].amount,
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          }
        } else {
          const boughtCoin = sortedTrades[i].symbol;
          if (previousHoldings.hasOwnProperty(boughtCoin)) {
            previousHoldings[boughtCoin] = {
              amount: previousHoldings[boughtCoin] + sortedTrades[i].cost,
              totalCostBase:
                previousHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          } else {
            previousHoldings[boughtCoin] = {
              amount: sortedTrades[i].amount,
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          }
        }
      } else if (isCurrentFiscalYear === 0) {
        if (sortedTrades[i].symbol.includes('/')) {
          const [boughtCoin, soledCoin] = sortedTrades[i].symbol.split('/');
          const previousHoldingForCoinSoled = previousHoldings[soledCoin]
            ? {
                amount: previousHoldings[soledCoin].amount,
                costBase: previousHoldings[soledCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };
          const previousHoldingForCoinBought = previousHoldings[boughtCoin]
            ? {
                amount: previousHoldings[boughtCoin].amount,
                costBase: previousHoldings[boughtCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };

          if (coinHoldings.hasOwnProperty(soledCoin)) {
            const costBasesCoin = previousAllCostBases(
              //@ts-ignore
              coinHoldings[soledCoin].previousCostBases,
              sortedTrades[i].cost,
            );

            coinHoldings[soledCoin] = {
              amount: coinHoldings[soledCoin].amount - sortedTrades[i].cost,
              soledQty: coinHoldings[soledCoin].soledQty + sortedTrades[i].cost,
              boughtQty: coinHoldings[soledCoin].boughtQty + 0,
              soledCostBase:
                coinHoldings[soledCoin].soledCostBase +
                costBasesCoin.totalCostBase,
              boughtCostBase: coinHoldings[soledCoin].boughtCostBase + 0,
              previousCostBases: costBasesCoin.costBases,
              totalCostBase: costBasesCoin.totalCostBase,
              previousHoldingForCoin: previousHoldingForCoinSoled,
            };
          } else {
            if (previousHoldings[soledCoin]) {
              const prvCostBases: [{ amount: number; costBase: number }] =
                previousHoldings[soledCoin]['previousCostBases'];

              const costBasesCoin = previousAllCostBases(
                //@ts-ignore
                prvCostBases,
                sortedTrades[i].cost,
              );
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].cost,
                soledQty: sortedTrades[i].cost,
                boughtQty: 0,
                soledCostBase: costBasesCoin.totalCostBase,
                boughtCostBase: 0,
                previousCostBases: costBasesCoin.costBases,
                totalCostBase: costBasesCoin.totalCostBase,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            } else {
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].cost,
                soledQty: sortedTrades[i].cost,
                boughtQty: 0,
                soledCostBase: 0,
                boughtCostBase: 0,
                previousCostBases: [],
                totalCostBase: 0,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            }
          }
          if (coinHoldings.hasOwnProperty(boughtCoin)) {
            coinHoldings[boughtCoin] = {
              amount: coinHoldings[boughtCoin].amount + sortedTrades[i].amount,
              soledQty: coinHoldings[boughtCoin].soledQty + 0,
              boughtQty:
                coinHoldings[boughtCoin].boughtQty + sortedTrades[i].amount,
              soledCostBase: coinHoldings[boughtCoin].soledCostBase + 0,
              boughtCostBase:
                coinHoldings[boughtCoin].boughtCostBase +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...coinHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                coinHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          } else {
            const previousHoldingsCostBases = previousHoldings[boughtCoin]
              ? previousHoldings[boughtCoin]['previousCostBases']
              : [];
            coinHoldings[boughtCoin] = {
              amount:
                (previousHoldings[boughtCoin]
                  ? previousHoldings[boughtCoin].amount
                  : 0) + sortedTrades[i].amount,
              soledQty: 0,
              boughtQty: sortedTrades[i].amount,
              soledCostBase: 0,
              boughtCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldingsCostBases,
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          }
        } else {
          const boughtCoin = sortedTrades[i].symbol;
          const previousHoldingForCoinBought = previousHoldings[boughtCoin]
            ? {
                amount: previousHoldings[boughtCoin].amount,
                costBase: previousHoldings[boughtCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };
          if (coinHoldings.hasOwnProperty(boughtCoin)) {
            coinHoldings[boughtCoin] = {
              amount: coinHoldings[boughtCoin].amount + sortedTrades[i].amount,
              soledQty: coinHoldings[boughtCoin].soledQty + 0,
              boughtQty:
                coinHoldings[boughtCoin].boughtQty + sortedTrades[i].amount,
              soledCostBase: coinHoldings[boughtCoin].soledCostBase + 0,
              boughtCostBase:
                coinHoldings[boughtCoin].boughtCostBase +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...coinHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                coinHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          } else {
            const previousHoldingsCostBases = previousHoldings[boughtCoin]
              ? previousHoldings[boughtCoin]['previousCostBases']
              : [];
            coinHoldings[boughtCoin] = {
              amount:
                (previousHoldings[boughtCoin]
                  ? previousHoldings[boughtCoin].amount
                  : 0) + sortedTrades[i].amount,
              soledQty: 0,
              boughtQty: sortedTrades[i].amount,
              soledCostBase: 0,
              boughtCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldingsCostBases,
                {
                  amount: sortedTrades[i].amount,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          }
        }
      }
    } else if (
      allowableMaster.outgoing.includes(sortedTrades[i].side.toLowerCase())
    ) {
      const fiscalYearTransaction = getFiscalYear(
        sortedTrades[i].datetime.toString(),
      );
      const isCurrentFiscalYear = checkFiscalYear(
        fiscalYear,
        fiscalYearTransaction,
      );
      if (isCurrentFiscalYear === -1) {
        if (sortedTrades[i].symbol.includes('/')) {
          const [soledCoin, boughtCoin] = sortedTrades[i].symbol.split('/');
          if (previousHoldings.hasOwnProperty(soledCoin)) {
            const prvCostBases =
              previousHoldings[soledCoin]['previousCostBases'];

            const costBasesCoin = previousAllCostBases(
              prvCostBases,
              sortedTrades[i].amount,
            );

            previousHoldings[soledCoin] = {
              amount:
                previousHoldings[soledCoin]['amount'] - sortedTrades[i].amount,
              totalCostBase:
                previousHoldings[soledCoin]['totalCostBase'] -
                costBasesCoin.totalCostBase,
              previousCostBases: costBasesCoin.costBases,
            };
          } else {
            previousHoldings[soledCoin] = {
              amount: -sortedTrades[i].amount,
              totalCostBase: 0,
              previousCostBases: [],
            };
          }
          if (previousHoldings.hasOwnProperty(boughtCoin)) {
            previousHoldings[boughtCoin] = {
              amount:
                previousHoldings[boughtCoin]['amount'] + sortedTrades[i].cost,
              totalCostBase:
                previousHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].cost,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          } else {
            previousHoldings[boughtCoin] = {
              amount: sortedTrades[i].cost,
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                {
                  amount: sortedTrades[i].cost,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
            };
          }
        } else {
          const soledCoin = sortedTrades[i].symbol;
          if (previousHoldings.hasOwnProperty(soledCoin)) {
            const prvCostBases =
              previousHoldings[soledCoin]['previousCostBases'];

            const costBasesCoin = previousAllCostBases(
              prvCostBases,
              sortedTrades[i].amount,
            );

            previousHoldings[soledCoin] = {
              amount:
                previousHoldings[soledCoin]['amount'] - sortedTrades[i].amount,
              totalCostBase:
                previousHoldings[soledCoin]['totalCostBase'] -
                costBasesCoin.totalCostBase,
              previousCostBases: costBasesCoin.costBases,
            };
          } else {
            previousHoldings[soledCoin] = {
              amount: -sortedTrades[i].amount,
              totalCostBase: 0,
              previousCostBases: [],
            };
          }
        }
      } else if (isCurrentFiscalYear === 0) {
        if (sortedTrades[i].symbol.includes('/')) {
          const [soledCoin, boughtCoin] = sortedTrades[i].symbol.split('/');
          const previousHoldingForCoinSoled = previousHoldings[soledCoin]
            ? {
                amount: previousHoldings[soledCoin].amount,
                costBase: previousHoldings[soledCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };
          const previousHoldingForCoinBought = previousHoldings[boughtCoin]
            ? {
                amount: previousHoldings[boughtCoin].amount,
                costBase: previousHoldings[boughtCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };
          if (coinHoldings.hasOwnProperty(soledCoin)) {
            const costBasesCoin = previousAllCostBases(
              //@ts-ignore
              coinHoldings[soledCoin].previousCostBases,
              sortedTrades[i].amount,
            );

            coinHoldings[soledCoin] = {
              amount: coinHoldings[soledCoin].amount + sortedTrades[i].amount,
              soledQty:
                coinHoldings[soledCoin].soledQty + sortedTrades[i].amount,
              boughtQty: coinHoldings[soledCoin].boughtQty + 0,
              soledCostBase:
                coinHoldings[soledCoin].soledCostBase +
                costBasesCoin.totalCostBase,
              boughtCostBase: coinHoldings[soledCoin].boughtCostBase + 0,
              previousCostBases: costBasesCoin.costBases,
              totalCostBase: costBasesCoin.totalCostBase,
              previousHoldingForCoin: previousHoldingForCoinSoled,
            };
          } else {
            if (previousHoldings[soledCoin]) {
              const prvCostBases: [{ amount: number; costBase: number }] =
                previousHoldings[soledCoin]['previousCostBases'];

              const costBasesCoin = previousAllCostBases(
                //@ts-ignore
                prvCostBases,
                sortedTrades[i].amount,
              );
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].amount,
                soledQty: sortedTrades[i].amount,
                boughtQty: 0,
                soledCostBase: costBasesCoin.totalCostBase,
                boughtCostBase: 0,
                previousCostBases: costBasesCoin.costBases,
                totalCostBase: costBasesCoin.totalCostBase,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            } else {
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].amount,
                soledQty: sortedTrades[i].amount,
                boughtQty: 0,
                soledCostBase: 0,
                boughtCostBase: 0,
                previousCostBases: [],
                totalCostBase: 0,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            }
          }
          if (coinHoldings.hasOwnProperty(boughtCoin)) {
            coinHoldings[boughtCoin] = {
              amount: coinHoldings[boughtCoin].amount + sortedTrades[i].cost,
              soledQty: coinHoldings[boughtCoin].soledQty + 0,
              boughtQty:
                coinHoldings[boughtCoin].boughtQty + sortedTrades[i].cost,
              soledCostBase: coinHoldings[boughtCoin].soledCostBase + 0,
              boughtCostBase:
                coinHoldings[boughtCoin].boughtCostBase +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...coinHoldings[boughtCoin]['previousCostBases'],
                {
                  amount: sortedTrades[i].cost,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                coinHoldings[boughtCoin]['totalCostBase'] +
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          } else {
            const previousHoldingsCostBases = previousHoldings[boughtCoin]
              ? previousHoldings[boughtCoin]['previousCostBases']
              : [];
            coinHoldings[boughtCoin] = {
              amount:
                (previousHoldings[boughtCoin]
                  ? previousHoldings[boughtCoin].amount
                  : 0) + sortedTrades[i].cost,
              soledQty: 0,
              boughtQty: sortedTrades[i].cost,
              soledCostBase: 0,
              boughtCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousCostBases: [
                ...previousHoldingsCostBases,
                {
                  amount: sortedTrades[i].cost,
                  costBase: sortedTrades[i].amount * sortedTrades[i].priceInAud,
                },
              ],
              totalCostBase:
                sortedTrades[i].amount * sortedTrades[i].priceInAud,
              previousHoldingForCoin: previousHoldingForCoinBought,
            };
          }
        } else {
          const soledCoin = sortedTrades[i].symbol;
          const previousHoldingForCoinSoled = previousHoldings[soledCoin]
            ? {
                amount: previousHoldings[soledCoin].amount,
                costBase: previousHoldings[soledCoin].totalCostBase,
              }
            : {
                amount: 0,
                costBase: 0,
              };
          if (coinHoldings.hasOwnProperty(soledCoin)) {
            const costBasesCoin = previousAllCostBases(
              //@ts-ignore
              coinHoldings[soledCoin].previousCostBases,
              sortedTrades[i].amount,
            );

            coinHoldings[soledCoin] = {
              amount: coinHoldings[soledCoin].amount + sortedTrades[i].amount,
              soledQty:
                coinHoldings[soledCoin].soledQty + sortedTrades[i].amount,
              boughtQty: coinHoldings[soledCoin].boughtQty + 0,
              soledCostBase:
                coinHoldings[soledCoin].soledCostBase +
                costBasesCoin.totalCostBase,
              boughtCostBase: coinHoldings[soledCoin].boughtCostBase + 0,
              previousCostBases: costBasesCoin.costBases,
              totalCostBase: costBasesCoin.totalCostBase,
              previousHoldingForCoin: previousHoldingForCoinSoled,
            };
          } else {
            if (previousHoldings[soledCoin]) {
              const prvCostBases: [{ amount: number; costBase: number }] =
                previousHoldings[soledCoin]['previousCostBases'];

              const costBasesCoin = previousAllCostBases(
                //@ts-ignore
                prvCostBases,
                sortedTrades[i].amount,
              );
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].amount,
                soledQty: sortedTrades[i].amount,
                boughtQty: 0,
                soledCostBase: costBasesCoin.totalCostBase,
                boughtCostBase: 0,
                previousCostBases: costBasesCoin.costBases,
                totalCostBase: costBasesCoin.totalCostBase,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            } else {
              coinHoldings[soledCoin] = {
                amount:
                  (previousHoldings[soledCoin]
                    ? previousHoldings[soledCoin].amount
                    : 0) - sortedTrades[i].amount,
                soledQty: sortedTrades[i].amount,
                boughtQty: 0,
                soledCostBase: 0,
                boughtCostBase: 0,
                previousCostBases: [],
                totalCostBase: 0,
                previousHoldingForCoin: previousHoldingForCoinSoled,
              };
            }
          }
        }
      }
    }
  }
  return coinHoldings;
};

const previousAllCostBases = (
  prvCostBases: [{ amount: number; costBase: number }] = [
    { amount: 0, costBase: 0 },
  ],
  amount: number,
) => {
  let soledAmount = amount;
  let totalCostBase = 0;
  for (let i = 0; i < prvCostBases.length; i++) {
    if (soledAmount !== 0 && prvCostBases[i].amount !== 0) {
      if (prvCostBases[i].amount - soledAmount >= 0) {
        prvCostBases[i].amount = prvCostBases[i].amount - soledAmount;
        soledAmount = 0;
        totalCostBase +=
          (prvCostBases[i].costBase / prvCostBases[i].amount) * soledAmount;
        prvCostBases[i].costBase =
          prvCostBases[i].costBase -
          (prvCostBases[i].costBase / prvCostBases[i].amount) * soledAmount;
      } else {
        prvCostBases[i].amount = 0;
        soledAmount = soledAmount - prvCostBases[i].amount;
        totalCostBase += prvCostBases[i].costBase;
        prvCostBases[i].costBase = 0;
      }
    }
  }
  return { costBases: prvCostBases, totalCostBase };
};

const checkFiscalYear = (currentYear: string, checkYear: string) => {
  const [y1, y2] = currentYear.split('-');
  const [year1, year2] = checkYear.split('-');
  if (+y2 < +year2) {
    return 1;
  } else if (+y1 === +year1 && +y2 === +year2) {
    return 0;
  } else if (+y1 > +year1) {
    return -1;
  }
};

const getFiscalYear = (transactionDate: string) => {
  const date = new Date(transactionDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month <= 6) {
    return '' + (+year - 1) + '-' + year;
  } else {
    return '' + year + '-' + (+year + 1);
  }
};
