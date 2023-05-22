import { coinGeckoRequest, getCoinId } from '../common/coingeckoFunctions';
import { newCoinIds } from './coingeckoCoinIds';
import { AlliedaccountsRepository } from '../../alliedAccounts/alliedAccounts.repository';
import { Injectable } from '@nestjs/common';
import { longTermDateCheck } from './longTermDateChecker';

// const alliedRepository = Repository<Alliedaccounts>

// const alliedAccounts = new AlliedaccountsRepository(
//   new Repository<Alliedaccounts>(),
// );

const allowableMaster = {
  incoming: [
    'reward',
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
    'realized profit',
    'fiat deposit',
    'borrow',
    'ignore',
    'distribution',
    'isolatedmargin loan',
    'large otc trading',
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
    'realized loss',
    'fiat withdrawal',
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

@Injectable()
export class TaxCalculationService {
  constructor(
    private readonly alliedAccountsRepository: AlliedaccountsRepository,
  ) {}

  taxCalculator = async (allTransactions, balances = []) => {
    const currentBalances = {};
    const latestExchangeRates = {};
    for (let i = 0; i < balances.length; i++) {
      if (currentBalances[balances[i].asset]) {
        currentBalances[balances[i].asset] += balances[i].free;
      } else {
        currentBalances[balances[i].asset] = balances[i].free;
      }
    }
    const transactions = allTransactions.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    const boughtCoins = {};
    const boughtCoins2 = {};
    let converted = false;
    let sendNo = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (!transactions.hasOwnProperty('taxType')) {
        transactions[i]['taxType'] = 'other trx';
      }
      if (
        transactions[i].side.toLowerCase() === 'send' &&
        !(await this.alliedAccountsRepository.findOne(
          transactions[i].user,
          transactions[i].accountAddress,
        ))
      ) {
        sendNo = i;
        transactions[i].side = 'sell';
        converted = true;
      }
      if (
        transactions[i].side.toLowerCase() === 'receive' &&
        transactions[i].accountAddress === ''
      ) {
        transactions[i].side = 'income';
      }
      if (
        allowableMaster.incoming.includes(transactions[i].side.toLowerCase())
      ) {
        if (transactions[i].symbol.includes('/')) {
          const [BC, SC] = transactions[i].symbol.split('/');
          const previousBalance = this.currentHolding(
            boughtCoins[BC] ? boughtCoins[BC] : [],
          );
          const previousBalance2 = this.currentHolding(
            boughtCoins[SC] ? boughtCoins[SC] : [],
          );
          if (
            transactions[i].priceInAUD ||
            (transactions[i].priceInAud &&
              (transactions[i].priceInAUD !== 0 ||
                transactions[i].priceInAud !== 0))
          ) {
            latestExchangeRates[BC] = transactions[i].priceInAUD;
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: transactions[i].priceInAUD
                ? transactions[i].priceInAUD
                : transactions[i].priceInAud,
              fifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              lifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance + transactions[i].amount,
              },
              previousCoinBalance: previousBalance,
              currentCoinBalance: previousBalance + transactions[i].amount,
              previousCoin2Balance: previousBalance2,
              currentCoin2Balance: previousBalance2 - transactions[i].cost,
              priceInAud_AT:
                transactions[i].amount * transactions[i].priceInAUD,
              priceInAud_AR:
                transactions[i].amount * transactions[i].priceInAUD,
            };
          } else {
            if (SC === 'AUD') {
              latestExchangeRates[BC] =
                transactions[i].cost / transactions[i].amount;
              transactions[i] = {
                ...transactions[i],
                fileName: transactions[i].fileName
                  ? transactions[i].fileName
                  : '',
                CGT: { fifo: 0, lifo: 0 },
                priceInAUD: transactions[i].cost / transactions[i].amount,
                priceInAud: transactions[i].cost / transactions[i].amount,
                fifoCGTDetail: {
                  boughtFor: transactions[i].cost,
                  soldFor: 0,
                },
                lifoCGTDetail: {
                  boughtFor: transactions[i].cost,
                  soldFor: 0,
                },
                fifoRelatedTransactions: [],
                lifoRelatedTransactions: [],
                isError: false,
                balance: {
                  previousBalance,
                  currentBalance: previousBalance + transactions[i].amount,
                },
                currentCoinBalance: previousBalance + transactions[i].amount,
                previousCoinBalance: previousBalance,
                previousCoin2Balance: previousBalance2,
                currentCoin2Balance: previousBalance2 - transactions[i].cost,
              };
            } else {
              for (let i = 0; i < 10000000; i++) {}
              try {
                let coinID = getCoinId(BC);
                if (!coinID) coinID = this.coinNotFound(BC);
                const date = new Date(transactions[i].datetime);
                let exchangeRates;
                try {
                  exchangeRates = await coinGeckoRequest(
                    coinID,
                    '' +
                      date.getDate() +
                      '-' +
                      (date.getMonth() + 1) +
                      '-' +
                      date.getFullYear(),
                  );
                  latestExchangeRates[BC] =
                    exchangeRates.market_data.current_price.aud;
                } catch (e) {
                  let coinID = getCoinId(SC);
                  if (!coinID) coinID = this.coinNotFound(SC);
                  const date = new Date(transactions[i].datetime);
                  exchangeRates = await coinGeckoRequest(
                    coinID,
                    '' +
                      date.getDate() +
                      '-' +
                      (date.getMonth() + 1) +
                      '-' +
                      date.getFullYear(),
                  );
                  latestExchangeRates[SC] =
                    exchangeRates.market_data.current_price.aud;
                }

                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: exchangeRates.market_data.current_price.aud,
                  priceInAud: exchangeRates.market_data.current_price.aud,
                  fifoCGTDetail: {
                    boughtFor:
                      transactions[i].amount *
                      exchangeRates.market_data.current_price.aud,
                    soldFor: 0,
                  },
                  lifoCGTDetail: {
                    boughtFor:
                      transactions[i].amount *
                      exchangeRates.market_data.current_price.aud,
                    soldFor: 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: false,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance + transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance + transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  previousCoin2Balance: previousBalance2,
                  currentCoin2Balance: previousBalance2 - transactions[i].cost,
                };
              } catch (e) {
                if (latestExchangeRates[BC] || latestExchangeRates[SC]) {
                  latestExchangeRates[BC] = latestExchangeRates[BC]
                    ? latestExchangeRates[BC]
                    : (latestExchangeRates[SC] * transactions[i].cost) /
                      transactions[i].amount;

                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { fifo: 0, lifo: 0 },
                    priceInAUD: latestExchangeRates[BC],
                    priceInAud: latestExchangeRates[BC],
                    fifoCGTDetail: {
                      boughtFor:
                        transactions[i].amount * latestExchangeRates[BC],
                      soldFor: 0,
                    },
                    lifoCGTDetail: {
                      boughtFor:
                        transactions[i].amount * latestExchangeRates[BC],
                      soldFor: 0,
                    },
                    fifoRelatedTransactions: [],
                    lifoRelatedTransactions: [],
                    isError: false,
                    balance: {
                      previousBalance,
                      currentBalance: previousBalance + transactions[i].amount,
                    },
                    currentCoinBalance:
                      previousBalance + transactions[i].amount,
                    previousCoinBalance: previousBalance,
                    previousCoin2Balance: previousBalance2,
                    currentCoin2Balance:
                      previousBalance2 - transactions[i].cost,
                  };
                } else {
                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { fifo: 0, lifo: 0 },
                    priceInAUD: 0,
                    priceInAud: 0,
                    fifoCGTDetail: {
                      boughtFor: transactions[i].amount * 0,
                      soldFor: 0,
                    },
                    lifoCGTDetail: {
                      boughtFor: transactions[i].amount * 0,
                      soldFor: 0,
                    },
                    fifoRelatedTransactions: [],
                    lifoRelatedTransactions: [],
                    isError: true,
                    balance: {
                      previousBalance,
                      currentBalance: previousBalance + transactions[i].amount,
                    },
                    currentCoinBalance:
                      previousBalance + transactions[i].amount,
                    previousCoinBalance: previousBalance,
                    previousCoin2Balance: previousBalance2,
                    currentCoin2Balance:
                      previousBalance2 - transactions[i].cost,
                  };
                }
              }
            }
          }
          if (boughtCoins[BC]) {
            boughtCoins[BC].push({ ...transactions[i], index: i });
            boughtCoins2[BC].push({ ...transactions[i], index: i });
          } else {
            boughtCoins[BC] = [{ ...transactions[i], index: i }];
            boughtCoins2[BC] = [{ ...transactions[i], index: i }];
          }
        } else {
          const BC = transactions[i].symbol;
          const previousBalance = this.currentHolding(
            boughtCoins[BC] ? boughtCoins[BC] : [],
          );

          if (
            transactions[i].priceInAUD ||
            (transactions[i].priceInAud &&
              (transactions[i].priceInAUD !== 0 ||
                transactions[i].priceInAud !== 0))
          ) {
            latestExchangeRates[BC] = transactions[i].priceInAUD
              ? transactions[i].priceInAUD
              : transactions[i].priceInAud;
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: transactions[i].priceInAUD
                ? transactions[i].priceInAUD
                : transactions[i].priceInAud,
              priceInAud: transactions[i].priceInAUD
                ? transactions[i].priceInAUD
                : transactions[i].priceInAud,
              fifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              lifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance + transactions[i].amount,
              },
              previousCoinBalance: previousBalance,
              currentCoinBalance: previousBalance + transactions[i].amount,
              previousCoin2Balance: 0,
              currentCoin2Balance: 0,
              priceInAud_AT:
                transactions[i].amount * transactions[i].priceInAUD
                  ? transactions[i].priceInAUD
                  : transactions[i].priceInAud,
              priceInAud_AR:
                transactions[i].amount * transactions[i].priceInAUD
                  ? transactions[i].priceInAUD
                  : transactions[i].priceInAud,
            };
          } else if (BC === 'AUD') {
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: 1,
              priceInAud: 1,
              fifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              lifoCGTDetail: {
                boughtFor: transactions[i].cost,
                soldFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance + transactions[i].amount,
              },
              previousCoinBalance: previousBalance,
              currentCoinBalance: previousBalance + transactions[i].amount,
              previousCoin2Balance: 0,
              currentCoin2Balance: 0,
              priceInAud_AT: transactions[i].amount * 1,
              priceInAud_AR: transactions[i].amount * 1,
            };
          } else {
            for (let i = 0; i < 10000000; i++) {}
            try {
              let coinID = getCoinId(BC);
              if (!coinID) coinID = this.coinNotFound(BC);
              const date = new Date(transactions[i].datetime);
              const exchangeRates = await coinGeckoRequest(
                coinID,
                '' +
                  date.getDate() +
                  '-' +
                  (date.getMonth() + 1) +
                  '-' +
                  date.getFullYear(),
              );
              latestExchangeRates[BC] =
                exchangeRates.market_data.current_price.aud;
              transactions[i] = {
                ...transactions[i],
                fileName: transactions[i].fileName
                  ? transactions[i].fileName
                  : '',
                CGT: { fifo: 0, lifo: 0 },
                priceInAUD: exchangeRates.market_data.current_price.aud,
                priceInAud: exchangeRates.market_data.current_price.aud,
                fifoCGTDetail: {
                  boughtFor:
                    transactions[i].amount *
                    exchangeRates.market_data.current_price.aud,
                  soldFor: 0,
                },
                lifoCGTDetail: {
                  boughtFor:
                    transactions[i].amount *
                    exchangeRates.market_data.current_price.aud,
                  soldFor: 0,
                },
                fifoRelatedTransactions: [],
                lifoRelatedTransactions: [],
                isError: false,
                balance: {
                  previousBalance,
                  currentBalance: previousBalance + transactions[i].amount,
                },
                currentCoinBalance: previousBalance + transactions[i].amount,
                previousCoinBalance: previousBalance,
                previousCoin2Balance: 0,
                currentCoin2Balance: 0,
              };
            } catch (e) {
              if (latestExchangeRates[BC]) {
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: latestExchangeRates[BC],
                  priceInAud: latestExchangeRates[BC],
                  fifoCGTDetail: {
                    boughtFor: transactions[i].amount * latestExchangeRates[BC],
                    soldFor: 0,
                  },
                  lifoCGTDetail: {
                    boughtFor: transactions[i].amount * latestExchangeRates[BC],
                    soldFor: 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: false,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance + transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance + transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  previousCoin2Balance: 0,
                  currentCoin2Balance: 0,
                };
              } else {
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: 0,
                  priceInAud: 0,
                  fifoCGTDetail: {
                    boughtFor: transactions[i].amount * 0,
                    soldFor: 0,
                  },
                  lifoCGTDetail: {
                    boughtFor: transactions[i].amount * 0,
                    soldFor: 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: true,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance + transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance + transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  previousCoin2Balance: 0,
                  currentCoin2Balance: 0,
                };
              }
            }
          }
          if (boughtCoins[BC]) {
            boughtCoins[BC].push({ ...transactions[i], index: i });
            boughtCoins2[BC].push({ ...transactions[i], index: i });
          } else {
            boughtCoins[BC] = [{ ...transactions[i], index: i }];
            boughtCoins2[BC] = [{ ...transactions[i], index: i }];
          }
        }
      } else if (transactions[i].side.toLowerCase() === 'sell') {
        // if (i === sendNo) console.log(transactions[i]);
        const [SC, BC] = transactions[i].symbol.split('/');
        const previousBalance = this.currentHolding(
          boughtCoins[SC] ? boughtCoins[SC] : [],
        );
        const previousBalance2 = this.currentHolding(
          boughtCoins[BC] ? boughtCoins[BC] : [],
        );
        if (
          transactions[i].hasOwnProperty('priceInAud') &&
          transactions[i].priceInAud &&
          transactions[i].priceInAud !== 0
        ) {
          latestExchangeRates[SC] = transactions[i].priceInAud;
          transactions[i] = {
            ...transactions[i],
            fileName: transactions[i].fileName ? transactions[i].fileName : '',
            CGT: { fifo: 0, lifo: 0 },
            priceInAUD: transactions[i].priceInAud,
            fifoCGTDetail: {
              boughtFor: 0,
              soldFor: transactions[i].priceInAUD * transactions[i].amount,
            },
            lifoCGTDetail: {
              boughtFor: 0,
              soldFor: transactions[i].priceInAUD * transactions[i].amount,
            },
            fifoRelatedTransactions: [],
            lifoRelatedTransactions: [],
            isError: false,
            balance: {
              previousBalance,
              currentBalance: previousBalance - transactions[i].amount,
            },
            currentCoinBalance: previousBalance - transactions[i].amount,
            previousCoinBalance: previousBalance,
            currentCoin2Balance: previousBalance2 + transactions[i].cost,
            previousCoin2Balance: previousBalance2,
          };
        } else {
          if (BC === 'AUD') {
            latestExchangeRates[SC] =
              transactions[i].cost / transactions[i].amount;
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: transactions[i].cost / transactions[i].amount,
              fifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].price * transactions[i].amount,
              },
              lifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].price * transactions[i].amount,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance - transactions[i].amount,
              },
              currentCoinBalance: previousBalance - transactions[i].amount,
              previousCoinBalance: previousBalance,
              currentCoin2Balance: previousBalance2 + transactions[i].cost,
              previousCoin2Balance: previousBalance2,
            };
          } else {
            for (let i = 0; i < 10000000; i++) {}
            try {
              let exchangeRates;
              try {
                let coinID = getCoinId(SC);
                if (!coinID) coinID = this.coinNotFound(SC);
                const date = new Date(transactions[i].datetime);
                exchangeRates = await coinGeckoRequest(
                  coinID,
                  '' +
                    date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear(),
                );
                latestExchangeRates[SC] =
                  exchangeRates.market_data.current_price.aud;
              } catch (e) {
                let coinID = getCoinId(BC);
                if (!coinID) coinID = this.coinNotFound(BC);
                const date = new Date(transactions[i].datetime);
                exchangeRates = await coinGeckoRequest(
                  coinID,
                  '' +
                    date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear(),
                );
                latestExchangeRates[BC] =
                  exchangeRates.market_data.current_price.aud;
              }

              transactions[i] = {
                ...transactions[i],
                fileName: transactions[i].fileName
                  ? transactions[i].fileName
                  : '',
                CGT: { fifo: 0, lifo: 0 },
                priceInAUD: exchangeRates.market_data.current_price.aud,
                fifoCGTDetail: {
                  boughtFor: 0,
                  soldFor:
                    transactions[i].amount *
                    exchangeRates.market_data.current_price.aud,
                },
                lifoCGTDetail: {
                  boughtFor: 0,
                  soldFor:
                    transactions[i].amount *
                    exchangeRates.market_data.current_price.aud,
                },
                fifoRelatedTransactions: [],
                lifoRelatedTransactions: [],
                isError: false,
                balance: {
                  previousBalance,
                  currentBalance: previousBalance - transactions[i].amount,
                },
                currentCoinBalance: previousBalance - transactions[i].amount,
                previousCoinBalance: previousBalance,
                currentCoin2Balance: previousBalance2 + transactions[i].cost,
                previousCoin2Balance: previousBalance2,
              };
            } catch (e) {
              if (latestExchangeRates[SC] || latestExchangeRates[BC]) {
                latestExchangeRates[SC] = latestExchangeRates[SC]
                  ? latestExchangeRates[SC]
                  : (latestExchangeRates[BC] * transactions[i].cost) /
                    transactions[i].amount;
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: latestExchangeRates[SC],
                  fifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * latestExchangeRates[SC],
                  },
                  lifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * latestExchangeRates[SC],
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: false,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance - transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance - transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  currentCoin2Balance: previousBalance2 + transactions[i].cost,
                  previousCoin2Balance: previousBalance2,
                };
              } else {
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: 0,
                  fifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  lifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: true,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance - transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance - transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  currentCoin2Balance: previousBalance2 + transactions[i].cost,
                  previousCoin2Balance: previousBalance2,
                };
              }
            }
          }
        }

        if (
          boughtCoins[SC] &&
          boughtCoins[SC].length > 0 &&
          boughtCoins[SC].at(-1).amount > 0
        ) {
          let totalAmountForRelatedTransactions = 0;
          for (let k = 0; k < boughtCoins[SC].length; k++) {
            totalAmountForRelatedTransactions += boughtCoins[SC][k].amount;
          }
          let amount = parseFloat(transactions[i].amount.toFixed(6));

          if (
            parseFloat(totalAmountForRelatedTransactions.toFixed(6)) >= amount
          ) {
            let amount2 = parseFloat(transactions[i].amount.toFixed(6));
            let relatedTransactions = [];
            let cgt = 0;
            let boughtFor = 0;

            for (let y = 0; y < boughtCoins[SC].length; y++) {
              if (amount > 0 && boughtCoins[SC][y].amount > 0) {
                if (
                  parseFloat(boughtCoins[SC][y].amount.toFixed(6)) >=
                  (amount.toString().length > 6
                    ? parseFloat(amount.toString().slice(0, 7))
                    : amount)
                ) {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });

                  if (
                    allowableMaster.incoming.includes(
                      boughtCoins[SC][y].side.toLowerCase(),
                    )
                  ) {
                    cgt +=
                      amount * transactions[i].priceInAUD -
                      amount * boughtCoins[SC][y].priceInAUD;

                    boughtFor += amount * boughtCoins[SC][y].priceInAUD;

                    boughtCoins[SC][y].amount -= amount;
                  } else {
                    cgt +=
                      amount * transactions[i].priceInAUD -
                      amount *
                        (boughtCoins[SC][y].priceInAUD /
                          (1 / boughtCoins[SC][y].cost) /
                          boughtCoins[SC][y].amount);

                    boughtFor +=
                      amount *
                      (boughtCoins[SC][y].priceInAUD /
                        (1 / boughtCoins[SC][y].cost) /
                        boughtCoins[SC][y].amount);

                    boughtCoins[SC][y].amount -= amount;
                  }

                  amount = 0;
                  let longTerm = false;
                  for (let x = 0; x < fifoRelatedTransactions.length; x++) {
                    if (
                      longTermDateCheck(
                        new Date(),
                        new Date(fifoRelatedTransactions[x].datetime),
                      )
                    ) {
                      longTerm = true;
                      break;
                    }
                  }
                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { ...transactions[i].CGT, fifo: cgt },
                    fifoCGTDetail: {
                      ...transactions[i].fifoCGTDetail,
                      boughtFor: boughtFor,
                      soldFor:
                        transactions[i].amount * transactions[i].priceInAUD,
                    },
                    fifoRelatedTransactions: relatedTransactions,
                    taxType: longTerm ? 'long term' : 'short term',
                  };
                } else {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });

                  if (
                    allowableMaster.incoming.includes(
                      boughtCoins[SC][y].side.toLowerCase(),
                    )
                  ) {
                    cgt +=
                      boughtCoins[SC][y].amount * transactions[i].priceInAUD -
                      boughtCoins[SC][y].amount * boughtCoins[SC][y].priceInAUD;

                    boughtFor +=
                      boughtCoins[SC][y].amount * boughtCoins[SC][y].priceInAUD;

                    amount -= boughtCoins[SC][y].amount;
                  } else {
                    cgt +=
                      boughtCoins[SC][y].amount * transactions[i].priceInAUD -
                      boughtCoins[SC][y].amount *
                        ((boughtCoins[SC][y].priceInAUD *
                          boughtCoins[SC][y].cost) /
                          boughtCoins[SC][y].amount);

                    boughtFor +=
                      boughtCoins[SC][y].amount *
                      ((boughtCoins[SC][y].priceInAUD *
                        boughtCoins[SC][y].cost) /
                        boughtCoins[SC][y].amount);

                    // if (transactions[i].symbol === 'BNB/USDT') {
                    //   console.log('boughtFor', boughtFor);
                    //   console.log(
                    //     boughtCoins[SC][y].amount,
                    //     boughtCoins[SC][y].priceInAUD,
                    //     boughtCoins[SC][y].cost,
                    //   );
                    // }

                    amount -= boughtCoins[SC][y].amount;
                  }

                  boughtCoins[SC][y].amount = 0;
                }
              }
            }

            relatedTransactions = [];
            cgt = 0;
            boughtFor = 0;
            for (let z = boughtCoins2[SC].length - 1; z >= 0; z--) {
              if (amount2 > 0) {
                if (
                  parseFloat(boughtCoins2[SC][z].amount.toFixed(6)) >=
                  (amount2.toString().length > 6
                    ? parseFloat(amount2.toString().slice(0, 7))
                    : amount2)
                ) {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins2[SC][z].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][z].amount,
                  });
                  cgt +=
                    amount2 * transactions[i].priceInAUD -
                    amount2 * boughtCoins2[SC][z].priceInAUD;

                  boughtFor +=
                    transactions[i].amount * boughtCoins2[SC][z].priceInAUD;
                  boughtCoins2[SC][z].amount -= amount2;
                  amount2 = 0;
                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { ...transactions[i].CGT, lifo: cgt },
                    lifoCGTDetail: {
                      ...transactions[i].lifoCGTDetail,
                      boughtFor: boughtFor,
                      soldFor:
                        transactions[i].amount * transactions[i].priceInAUD,
                    },
                    lifoRelatedTransactions: relatedTransactions,
                    isError: false,
                  };
                } else {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins2[SC][z].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][z].amount,
                  });
                  cgt +=
                    boughtCoins2[SC][z].amount * transactions[i].priceInAUD -
                    boughtCoins2[SC][z].amount * boughtCoins2[SC][z].priceInAUD;
                  boughtFor +=
                    boughtCoins2[SC][z].amount * boughtCoins2[SC][z].priceInAUD;
                  amount2 -= boughtCoins2[SC][z].amount;
                  boughtCoins2[SC][z].amount = 0;
                }
              }
            }
          } else {
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { lifo: 0, fifo: 0 },
              fifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              lifoRelatedTransactions: [],
              isError: true,
            };
          }
        } else {
          transactions[i] = {
            ...transactions[i],
            fileName: transactions[i].fileName ? transactions[i].fileName : '',
            CGT: { lifo: 0, fifo: 0 },
            fifoCGTDetail: {
              soldFor: 0,
              boughtFor: 0,
            },
            fifoRelatedTransactions: [],
            lifoCGTDetail: {
              soldFor: 0,
              boughtFor: 0,
            },
            lifoRelatedTransactions: [],
            isError: true,
          };
        }
        const changeAmount = transactions[i].cost;
        const changeCost = transactions[i].amount;
        if (boughtCoins[BC]) {
          boughtCoins[BC].push({
            ...transactions[i],
            index: i,
            amount: changeAmount,
            cost: changeCost,
            // priceInAUD: (transactions[i].priceInAUD * changeCost) / changeAmount,
            priceInAUD: transactions[i].priceInAUD,
          });
          boughtCoins2[BC].push({
            ...transactions[i],
            index: i,
            amount: changeAmount,
            cost: changeCost,
            // priceInAUD: (transactions[i].priceInAUD * changeCost) / changeAmount,
            priceInAUD: transactions[i].priceInAUD,
          });
        } else {
          boughtCoins[BC] = [
            {
              ...transactions[i],
              index: i,
              amount: changeAmount,
              cost: changeCost,
              // priceInAUD:
              //   (transactions[i].priceInAUD * changeCost) / changeAmount,
              priceInAUD: transactions[i].priceInAUD,
            },
          ];
          boughtCoins2[BC] = [
            {
              ...transactions[i],
              index: i,
              amount: changeAmount,
              cost: changeCost,
              // priceInAUD:
              // (transactions[i].priceInAUD * changeCost) / changeAmount,
              priceInAUD: transactions[i].priceInAUD,
            },
          ];
        }
      } else if (
        allowableMaster.outgoing.includes(transactions[i].side.toLowerCase())
      ) {
        if (transactions[i].symbol.includes('/')) {
          const [SC, BC] = transactions[i].symbol.split('/');
          const previousBalance = this.currentHolding(
            boughtCoins[SC] ? boughtCoins[SC] : [],
          );

          const previousBalance2 = this.currentHolding(
            boughtCoins[BC] ? boughtCoins[BC] : [],
          );

          if (
            transactions[i].hasOwnProperty('priceInAud') &&
            transactions[i].priceInAud &&
            transactions[i].priceInAud !== 0
          ) {
            latestExchangeRates[SC] = transactions[i].priceInAud;
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: transactions[i].priceInAud,
              fifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].priceInAUD * transactions[i].amount,
              },
              lifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].priceInAUD * transactions[i].amount,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance - transactions[i].amount,
              },
              currentCoinBalance: previousBalance - transactions[i].amount,
              previousCoinBalance: previousBalance,
              currentCoin2Balance: previousBalance2 - transactions[i].cost,
              previousCoin2Balance: previousBalance2,
            };
          } else {
            if (BC === 'AUD') {
              latestExchangeRates[SC] =
                transactions[i].cost / transactions[i].amount;
              transactions[i] = {
                ...transactions[i],
                fileName: transactions[i].fileName
                  ? transactions[i].fileName
                  : '',
                CGT: { fifo: 0, lifo: 0 },
                priceInAUD: transactions[i].cost / transactions[i].amount,
                fifoCGTDetail: {
                  boughtFor: 0,
                  soldFor: transactions[i].price * transactions[i].amount,
                },
                lifoCGTDetail: {
                  boughtFor: 0,
                  soldFor: transactions[i].price * transactions[i].amount,
                },
                fifoRelatedTransactions: [],
                lifoRelatedTransactions: [],
                isError: false,
                balance: {
                  previousBalance,
                  currentBalance: previousBalance - transactions[i].amount,
                },
                currentCoinBalance: previousBalance - transactions[i].amount,
                previousCoinBalance: previousBalance,
                currentCoin2Balance: previousBalance2 - transactions[i].cost,
                previousCoin2Balance: previousBalance2,
              };
            } else {
              for (let i = 0; i < 10000000; i++) {}
              try {
                let coinID = getCoinId(SC);
                if (!coinID) coinID = this.coinNotFound(SC);
                const date = new Date(transactions[i].datetime);
                const exchangeRates = await coinGeckoRequest(
                  coinID,
                  '' +
                    date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear(),
                );
                latestExchangeRates[SC] =
                  exchangeRates.market_data.current_price.aud;
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: exchangeRates.market_data.current_price.aud,
                  fifoCGTDetail: {
                    boughtFor: 0,
                    soldFor:
                      transactions[i].amount *
                      exchangeRates.market_data.current_price.aud,
                  },
                  lifoCGTDetail: {
                    boughtFor: 0,
                    soldFor:
                      transactions[i].amount *
                      exchangeRates.market_data.current_price.aud,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: false,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance - transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance - transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  currentCoin2Balance: previousBalance2 - transactions[i].cost,
                  previousCoin2Balance: previousBalance2,
                };
              } catch (e) {
                if (latestExchangeRates[SC]) {
                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { fifo: 0, lifo: 0 },
                    priceInAUD: latestExchangeRates[SC],
                    fifoCGTDetail: {
                      boughtFor: 0,
                      soldFor: transactions[i].amount * latestExchangeRates[SC],
                    },
                    lifoCGTDetail: {
                      boughtFor: 0,
                      soldFor: transactions[i].amount * latestExchangeRates[SC],
                    },
                    fifoRelatedTransactions: [],
                    lifoRelatedTransactions: [],
                    isError: false,
                    balance: {
                      previousBalance,
                      currentBalance: previousBalance - transactions[i].amount,
                    },
                    currentCoinBalance:
                      previousBalance - transactions[i].amount,
                    previousCoinBalance: previousBalance,
                    currentCoin2Balance:
                      previousBalance2 - transactions[i].cost,
                    previousCoin2Balance: previousBalance2,
                  };
                } else {
                  transactions[i] = {
                    ...transactions[i],
                    fileName: transactions[i].fileName
                      ? transactions[i].fileName
                      : '',
                    CGT: { fifo: 0, lifo: 0 },
                    priceInAUD: 0,
                    fifoCGTDetail: {
                      boughtFor: 0,
                      soldFor: transactions[i].amount * 0,
                    },
                    lifoCGTDetail: {
                      boughtFor: 0,
                      soldFor: transactions[i].amount * 0,
                    },
                    fifoRelatedTransactions: [],
                    lifoRelatedTransactions: [],
                    isError: true,
                    balance: {
                      previousBalance,
                      currentBalance: previousBalance - transactions[i].amount,
                    },
                    currentCoinBalance:
                      previousBalance - transactions[i].amount,
                    previousCoinBalance: previousBalance,
                    currentCoin2Balance:
                      previousBalance2 - transactions[i].cost,
                    previousCoin2Balance: previousBalance2,
                  };
                }
              }
            }
          }

          if (
            boughtCoins[SC] &&
            boughtCoins[SC].length > 0 &&
            boughtCoins[SC].at(-1).amount > 0
          ) {
            let amount = transactions[i].amount;
            let relatedTransactions = [];

            for (let y = 0; y < boughtCoins[SC].length; y++) {
              if (amount > 0 && boughtCoins[SC][y].amount > 0) {
                if (
                  parseFloat(boughtCoins[SC][y].amount.toFixed(6)) >=
                  (amount.toString().length > 6
                    ? parseFloat(amount.toString().slice(0, 7))
                    : amount)
                ) {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });
                  boughtCoins[SC][y].amount -= amount;
                  amount = 0;
                  transactions[i] = {
                    ...transactions[i],

                    fifoRelatedTransactions: relatedTransactions,
                    isError: false,
                  };
                } else {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });
                  amount -= boughtCoins[SC][y].amount;
                  boughtCoins[SC][y].amount = 0;
                }
              }
            }
          } else {
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { lifo: 0, fifo: 0 },
              fifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              lifoRelatedTransactions: [],
              isError: true,
            };
          }

          const changeAmount = transactions[i].cost;
          const changeCost = transactions[i].amount;
          if (boughtCoins[BC]) {
            boughtCoins[BC].push({
              ...transactions[i],
              index: i,
              amount: changeAmount,
              cost: changeCost,
              priceInAUD: transactions[i].priceInAUD,
            });
            boughtCoins2[BC].push({
              ...transactions[i],
              index: i,
              amount: changeAmount,
              cost: changeCost,
              priceInAUD: transactions[i].priceInAUD,
            });
          } else {
            boughtCoins[BC] = [
              {
                ...transactions[i],
                index: i,
                amount: changeAmount,
                cost: changeCost,
                priceInAUD: transactions[i].priceInAUD,
              },
            ];
            boughtCoins2[BC] = [
              {
                ...transactions[i],
                index: i,
                amount: changeAmount,
                cost: changeCost,
                priceInAUD: transactions[i].priceInAUD,
              },
            ];
          }
        } else {
          for (let i = 0; i < 10000000; i++) {}
          const SC = transactions[i].symbol;
          const previousBalance = this.currentHolding(
            boughtCoins[SC] ? boughtCoins[SC] : [],
          );
          if (
            transactions[i].hasOwnProperty('priceInAud') &&
            transactions[i].priceInAud &&
            transactions[i].priceInAud !== 0
          ) {
            latestExchangeRates[SC] = transactions[i].priceInAud;
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { fifo: 0, lifo: 0 },
              priceInAUD: transactions[i].priceInAud,
              priceInAud: transactions[i].priceInAud,
              fifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].amount,
              },
              lifoCGTDetail: {
                boughtFor: 0,
                soldFor: transactions[i].amount,
              },
              fifoRelatedTransactions: [],
              lifoRelatedTransactions: [],
              isError: false,
              balance: {
                previousBalance,
                currentBalance: previousBalance - transactions[i].amount,
              },
              currentCoinBalance: previousBalance - transactions[i].amount,
              previousCoinBalance: previousBalance,
              previousCoin2Balance: 0,
              currentCoin2Balance: 0,
            };
          } else {
            try {
              let exchangeRate = 0;
              if (transactions[i].priceInAud) {
                exchangeRate = transactions[i].priceInAud;
              } else {
                let coinID = getCoinId(SC);
                if (!coinID) coinID = this.coinNotFound(SC);
                const date = new Date(transactions[i].datetime);
                const exchangeRates = await coinGeckoRequest(
                  coinID,
                  '' +
                    date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear(),
                );
                exchangeRate = exchangeRates.market_data.current_price.aud;
              }

              latestExchangeRates[SC] = exchangeRate;

              transactions[i] = {
                ...transactions[i],
                fileName: transactions[i].fileName
                  ? transactions[i].fileName
                  : '',
                CGT: { fifo: 0, lifo: 0 },
                priceInAUD: exchangeRate,
                priceInAud: exchangeRate,
                fifoCGTDetail: {
                  boughtFor: 0,
                  soldFor: transactions[i].amount,
                },
                lifoCGTDetail: {
                  boughtFor: 0,
                  soldFor: transactions[i].amount,
                },
                fifoRelatedTransactions: [],
                lifoRelatedTransactions: [],
                isError: false,
                balance: {
                  previousBalance,
                  currentBalance: previousBalance - transactions[i].amount,
                },
                currentCoinBalance: previousBalance - transactions[i].amount,
                previousCoinBalance: previousBalance,
                previousCoin2Balance: 0,
                currentCoin2Balance: 0,
              };
            } catch (e) {
              if (latestExchangeRates[SC]) {
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: latestExchangeRates[SC],
                  priceInAud: latestExchangeRates[SC],
                  fifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  lifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: false,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance - transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance - transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  previousCoin2Balance: 0,
                  currentCoin2Balance: 0,
                };
              } else {
                transactions[i] = {
                  ...transactions[i],
                  fileName: transactions[i].fileName
                    ? transactions[i].fileName
                    : '',
                  CGT: { fifo: 0, lifo: 0 },
                  priceInAUD: 0,
                  priceInAud: 0,
                  fifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  lifoCGTDetail: {
                    boughtFor: 0,
                    soldFor: transactions[i].amount * 0,
                  },
                  fifoRelatedTransactions: [],
                  lifoRelatedTransactions: [],
                  isError: true,
                  balance: {
                    previousBalance,
                    currentBalance: previousBalance - transactions[i].amount,
                  },
                  currentCoinBalance: previousBalance - transactions[i].amount,
                  previousCoinBalance: previousBalance,
                  previousCoin2Balance: 0,
                  currentCoin2Balance: 0,
                };
              }
            }
          }

          if (
            boughtCoins[SC] &&
            boughtCoins[SC].length > 0 &&
            boughtCoins[SC].at(-1).amount > 0
          ) {
            let amount = transactions[i].amount;
            let relatedTransactions = [];

            for (let y = 0; y < boughtCoins[SC].length; y++) {
              if (amount > 0 && boughtCoins[SC][y].amount > 0) {
                if (
                  parseFloat(boughtCoins[SC][y].amount.toFixed(6)) >=
                  (amount.toString().length > 6
                    ? parseFloat(amount.toString().slice(0, 7))
                    : amount)
                ) {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });
                  boughtCoins[SC][y].amount -= amount;
                  amount = 0;
                  transactions[i] = {
                    ...transactions[i],
                    fifoRelatedTransactions: relatedTransactions,
                  };
                } else {
                  const {
                    fifoRelatedTransactions,
                    lifoRelatedTransactions,
                    ...relatedTRX
                  } = transactions[boughtCoins[SC][y].index];
                  relatedTransactions.push({
                    ...relatedTRX,
                    availableBalance: boughtCoins[SC][y].amount,
                  });
                  amount -= boughtCoins[SC][y].amount;
                  boughtCoins[SC][y].amount = 0;
                }
              }
            }
          } else {
            transactions[i] = {
              ...transactions[i],
              fileName: transactions[i].fileName
                ? transactions[i].fileName
                : '',
              CGT: { lifo: 0, fifo: 0 },
              fifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              fifoRelatedTransactions: [],
              lifoCGTDetail: {
                soldFor: 0,
                boughtFor: 0,
              },
              lifoRelatedTransactions: [],
              isError: true,
            };
          }
        }
      } else {
        transactions[i] = {
          ...transactions[i],
          fileName: transactions[i].fileName ? transactions[i].fileName : '',
          CGT: { lifo: 0, fifo: 0 },
          fifoCGTDetail: {
            soldFor: 0,
            boughtFor: 0,
          },
          fifoRelatedTransactions: [],
          lifoCGTDetail: {
            soldFor: 0,
            boughtFor: 0,
          },
          lifoRelatedTransactions: [],
          isError: true,
          priceInAUD: 0,
          priceInAud: 0,
          balance: {
            previousBalance: 0,
            currentBalance: 0,
          },
          currentCoinBalance: 0,
          previousCoinBalance: 0,
          previousCoin2Balance: 0,
          currentCoin2Balance: 0,
        };
      }
      if (converted) {
        // transactions[i].side = 'send';
        converted = false;
      }
    }

    // const arrLength = Object.keys(currentBalances).length;
    const coinCounts = {};
    let count = 0;
    for (let i = 0; i < transactions.length; i++) {
      count += 1;
      let soldCoin;
      let boughtCoin;
      let currentBoughtCoinBalance = 0;
      let currentSoldCoinBalance = 0;
      // if (arrLength < 1) {
      //   transactions[i] = {
      //     ...transactions[i],
      //     currentBoughtCoinBalance,
      //     currentSoldCoinBalance,
      //   };
      // } else {
      if (
        allowableMaster.incoming.includes(transactions[i].side.toLowerCase())
      ) {
        [boughtCoin, soldCoin] = transactions[i].symbol.split('/');
        if (coinCounts[boughtCoin]) {
          coinCounts[boughtCoin] += coinCounts[boughtCoin];
        } else {
          coinCounts[boughtCoin] = 1;
        }
        if (coinCounts[soldCoin]) {
          coinCounts[soldCoin] += coinCounts[soldCoin];
        } else {
          coinCounts[soldCoin] = 1;
        }
        if (currentBalances[boughtCoin]) {
          currentBoughtCoinBalance = currentBalances[boughtCoin];
          currentBalances[boughtCoin] -= transactions[i].amount;
        } else {
          currentBalances[boughtCoin] = transactions[i].amount;
          currentBoughtCoinBalance = currentBalances[boughtCoin];
        }
        if (currentBalances[soldCoin]) {
          currentSoldCoinBalance = currentBalances[soldCoin];
          currentBalances[soldCoin] -= transactions[i].cost;
        } else {
          currentSoldCoinBalance = 0;
          currentBalances[soldCoin] = -transactions[i].cost;
        }
      } else {
        [soldCoin, boughtCoin] = transactions[i].symbol.split('/');
        if (coinCounts[boughtCoin]) {
          coinCounts[boughtCoin] += coinCounts[boughtCoin];
        } else {
          coinCounts[boughtCoin] = 1;
        }
        if (coinCounts[soldCoin]) {
          coinCounts[soldCoin] += coinCounts[soldCoin];
        } else {
          coinCounts[soldCoin] = 1;
        }
        if (currentBalances[boughtCoin]) {
          currentBoughtCoinBalance = currentBalances[boughtCoin];
          currentBalances[boughtCoin] -= transactions[i].cost;
        } else {
          currentBalances[boughtCoin] = transactions[i].cost;
          currentBoughtCoinBalance = currentBalances[boughtCoin];
        }
        if (currentBalances[soldCoin]) {
          currentSoldCoinBalance = currentBalances[soldCoin];
          currentBalances[soldCoin] += transactions[i].amount;
        } else {
          currentBalances[soldCoin] = transactions[i].amount;
          currentSoldCoinBalance = currentBalances[soldCoin];
        }
      }

      transactions[i] = {
        timestamp: new Date(transactions[i].datetime).getTime(),
        ...transactions[i],
        fileName: transactions[i].fileName ? transactions[i].fileName : '',
        currentBoughtCoinBalance,
        currentSoldCoinBalance,
      };
    }
    // }

    return transactions;
  };

  taxCalculatorLifo = async (allTransactions) => {
    const transactions = allTransactions.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );
    const boughtCoins = {};
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].side.toLowerCase() === 'buy') {
        const [boughtCoin, soledCoin] = transactions[i].symbol.split('/');
        if (soledCoin !== 'AUD') {
          for (let i = 0; i < 10000000; i++) {}
          let coinID = getCoinId(boughtCoin);
          if (!coinID) coinID = this.coinNotFound(boughtCoin);
          const date = new Date(transactions[i].datetime);
          const exchangeRates = await coinGeckoRequest(
            coinID,
            '' +
              (date.getDay() + 1) +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getFullYear(),
          );
          transactions[i] = {
            ...transactions[i],
            CGT: 0,
            priceInAUD: exchangeRates.market_data.current_price.aud,
            cgtDetail: {
              boughtFor: transactions[i].cost,
              soledFor: 0,
            },
          };
        } else {
          transactions[i] = {
            ...transactions[i],
            CGT: 0,
            priceInAUD: 1 / transactions[i].price,
            cgtDetail: {
              boughtFor: transactions[i].cost,
              soledFor: 0,
            },
          };
        }

        if (boughtCoins[boughtCoin])
          boughtCoins[boughtCoin].push({ ...transactions[i] });
        else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
      } else if (transactions[i].side.toLowerCase() === 'sell') {
        const [soledCoin, boughtCoin] = transactions[i].symbol.split('/');

        if (boughtCoin !== 'AUD' && soledCoin !== 'AUD') {
          for (let i = 0; i < 10000000; i++) {}
          let coinID = getCoinId(soledCoin);
          if (!coinID) coinID = this.coinNotFound(soledCoin);
          const date = new Date(transactions[i].datetime);
          const exchangeRates = await coinGeckoRequest(
            coinID,
            '' +
              (date.getDay() + 1) +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getFullYear(),
          );
          transactions[i] = {
            ...transactions[i],
            CGT: 0,
            priceInAUD: exchangeRates.market_data.current_price.aud,
            cgtDetail: {
              boughtFor: transactions[i].cost,
              soledFor: transactions[i].cost,
            },
          };
        } else {
          transactions[i] = {
            ...transactions[i],
            CGT: 0,
            priceInAUD: 1 / transactions[i].price,
            cgtDetail: {
              boughtFor: transactions[i].cost,
              soledFor: transactions[i].cost,
            },
          };
        }

        if (boughtCoins[boughtCoin])
          boughtCoins[boughtCoin].push({ ...transactions[i] });
        else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
        if (boughtCoins[soledCoin]) {
          let amount = transactions[i].amount;
          let CGT = 0;
          let relatedTransactions = [];
          for (let j = boughtCoins[soledCoin].length - 1; j >= 0; j--) {
            if (amount > 0) {
              if (boughtCoins[soledCoin][j].amount >= amount) {
                relatedTransactions.push(boughtCoins[soledCoin][j]);
                CGT +=
                  transactions[i].amount * transactions[i].priceInAUD -
                  transactions[i].amount * boughtCoins[soledCoin][j].priceInAUD;
                boughtCoins[soledCoin][j].amount -= amount;
                amount = 0;
                transactions[i] = {
                  ...transactions[i],
                  CGT,
                  cgtDetail: {
                    boughtFor:
                      transactions[i].amount *
                      boughtCoins[soledCoin][j].priceInAUD,
                    soledFor:
                      transactions[i].amount * transactions[i].priceInAUD,
                  },
                  relatedTransactions,
                };
              } else {
                relatedTransactions.push(boughtCoins[soledCoin][j]);
                CGT +=
                  boughtCoins[soledCoin][j].amount *
                    transactions[i].priceInAUD -
                  boughtCoins[soledCoin][j].amount *
                    boughtCoins[soledCoin][j].priceInAUD;

                amount -= boughtCoins[soledCoin][j].amount;
                boughtCoins[soledCoin][j].amount = 0;
              }
            }
          }
        }
      } else {
        transactions[i] = {
          ...transactions[i],
          CGT: 0,
          cgtDetail: {
            boughtFor: 0,
            soledFor: 0,
          },
          relatedTransactions: [],
        };
      }
    }
    return transactions;
  };

  coinNotFound = (symbol) => {
    return newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0]
      ? newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0].id
      : undefined;
  };

  currentHolding = (trades) => {
    const types = {
      buy: 0,
      sell: 1,
    };
    let sortedTrades = [];

    for (let i = 0; i < trades.length; i++) {
      sortedTrades.push({ ...trades[i] });
    }

    sortedTrades = sortedTrades.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    let totalBalance = 0;
    for (let i = 0; i < sortedTrades.length; i++) {
      if (types[sortedTrades[i].side.toLowerCase()] === 0) {
        totalBalance += sortedTrades[i].amount;
      } else if (types[sortedTrades[i].side.toLowerCase()] === 1) {
        totalBalance += sortedTrades[i].amount;
      }
    }

    return totalBalance;
  };
}

// const taxCalculator = async (allTransactions, balances = []) => {
//   const currentBalances = {};
//   for (let i = 0; i < balances.length; i++) {
//     if (currentBalances[balances[i].asset]) {
//       currentBalances[balances[i].asset] += balances[i].free;
//     } else {
//       currentBalances[balances[i].asset] = balances[i].free;
//     }
//   }
//   const transactions = allTransactions.sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
//   );

//   const boughtCoins = {};
//   const boughtCoins2 = {};
//   for (let i = 0; i < transactions.length; i++) {
//     if (transactions[i].side.toLowerCase() === 'buy') {
//       const [boughtCoin, soledCoin] = transactions[i].symbol.split('/');
//       if (soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(boughtCoin);
//         if (!coinID) coinID = coinNotFound(boughtCoin);
//         const date = new Date(transactions[i].datetime);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );

//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: 1 / transactions[i].price,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       }

//       if (boughtCoins[boughtCoin]) {
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//         boughtCoins2[boughtCoin].push({ ...transactions[i] });
//       } else {
//         boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//         boughtCoins2[boughtCoin] = [{ ...transactions[i] }];
//       }
//     } else if (transactions[i].side.toLowerCase() === 'sell') {
//       const [soledCoin, boughtCoin] = transactions[i].symbol.split('/');

//       if (boughtCoin !== 'AUD' && soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(soledCoin);
//         if (!coinID) coinID = coinNotFound(soledCoin);
//         const date = new Date(transactions[i].datetime);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );
//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           priceInAUD: 1 / transactions[i].price,
//           CGT: { fifo: 0, lifo: 0 },
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       }

//       if (boughtCoins[boughtCoin]) {
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//         boughtCoins2[boughtCoin].push({ ...transactions[i] });
//       } else {
//         boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//         boughtCoins2[boughtCoin] = [{ ...transactions[i] }];
//       }
//       if (boughtCoins[soledCoin]) {
//         let amount = transactions[i].amount;
//         let CGT = 0;
//         let relatedTransactions = [];
//         for (let j = 0; j < boughtCoins[soledCoin].length; j++) {
//           if (amount > 0) {
//             if (boughtCoins[soledCoin][j].amount >= amount) {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins[soledCoin][j].priceInAUD;
//               boughtCoins[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: { ...transactions[i].CGT, fifo: CGT },
//                 fifoCGTDetail: {
//                   boughtFor:
//                     transactions[i].amount *
//                     boughtCoins[soledCoin][j].priceInAUD,
//                   soledFor: transactions[i].amount * transactions[i].priceInAUD,
//                 },
//                 fifoRelatedTransactions: relatedTransactions,
//               };
//             } else {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 boughtCoins[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins[soledCoin][j].amount *
//                   boughtCoins[soledCoin][j].priceInAUD;

//               amount -= boughtCoins[soledCoin][j].amount;
//               boughtCoins[soledCoin][j].amount = 0;
//             }
//           }
//         }
//         amount = transactions[i].amount;
//         CGT = 0;
//         relatedTransactions = [];
//         for (let j = boughtCoins2[soledCoin].length - 1; j >= 0; j--) {
//           if (amount > 0) {
//             if (boughtCoins2[soledCoin][j].amount >= amount) {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins2[soledCoin][j].priceInAUD;
//               boughtCoins2[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: { ...transactions[i].CGT, lifo: CGT },
//                 lifoCGTDetail: {
//                   boughtFor:
//                     transactions[i].amount *
//                     boughtCoins2[soledCoin][j].priceInAUD,
//                   soledFor: transactions[i].amount * transactions[i].priceInAUD,
//                 },
//                 lifoRelatedTransactions: relatedTransactions,
//               };
//             } else {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 boughtCoins2[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins2[soledCoin][j].amount *
//                   boughtCoins2[soledCoin][j].priceInAUD;

//               amount -= boughtCoins2[soledCoin][j].amount;
//               boughtCoins2[soledCoin][j].amount = 0;
//             }
//           }
//         }
//       }
//     } else {
//       transactions[i] = {
//         ...transactions[i],
//         CGT: { fifo: 0, lifo: 0 },
//         lifoCGTDetail: {
//           boughtFor: 0,
//           soledFor: 0,
//         },
//         fifoCGTDetail: {
//           boughtFor: 0,
//           soledFor: 0,
//         },
//         fifoRelatedTransactions: [],
//         lifoRelatedTransactions: [],
//       };
//     }
//   }

//   const arrLength = Object.keys(currentBalances).length;
//   const coinCounts = {};
//   for (let i = transactions.length - 1; i >= 0; i--) {
//     let soldCoin;
//     let boughtCoin;
//     let currentBoughtCoinBalance = 0;
//     let currentSoldCoinBalance = 0;
//     if (arrLength < 1) {
//       transactions[i] = {
//         ...transactions[i],
//         currentBoughtCoinBalance,
//         currentSoldCoinBalance,
//       };
//     } else {
//       if (transactions[i].side.toLowerCase() === 'buy') {
//         [boughtCoin, soldCoin] = transactions[i].symbol.split('/');
//         if (coinCounts[boughtCoin]) {
//           coinCounts[boughtCoin] += coinCounts[boughtCoin];
//         } else {
//           coinCounts[boughtCoin] = 1;
//         }
//         if (coinCounts[soldCoin]) {
//           coinCounts[soldCoin] += coinCounts[soldCoin];
//         } else {
//           coinCounts[soldCoin] = 1;
//         }
//         if (currentBalances[boughtCoin]) {
//           currentBoughtCoinBalance = currentBalances[boughtCoin];
//           currentBalances[boughtCoin] -= transactions[i].amount;
//         } else {
//           currentBalances[boughtCoin] = transactions[i].amount;
//           currentBoughtCoinBalance = currentBalances[boughtCoin];
//         }
//         if (currentBalances[soldCoin]) {
//           currentSoldCoinBalance = currentBalances[soldCoin];
//           currentBalances[soldCoin] += transactions[i].cost;
//         } else {
//           currentBalances[soldCoin] = transactions[i].cost;
//           currentSoldCoinBalance = currentBalances[soldCoin];
//         }
//       } else {
//         [soldCoin, boughtCoin] = transactions[i].symbol.split('/');
//         if (coinCounts[boughtCoin]) {
//           coinCounts[boughtCoin] += coinCounts[boughtCoin];
//         } else {
//           coinCounts[boughtCoin] = 1;
//         }
//         if (coinCounts[soldCoin]) {
//           coinCounts[soldCoin] += coinCounts[soldCoin];
//         } else {
//           coinCounts[soldCoin] = 1;
//         }
//         if (currentBalances[boughtCoin]) {
//           currentBoughtCoinBalance = currentBalances[boughtCoin];
//           currentBalances[boughtCoin] -= transactions[i].cost;
//         } else {
//           currentBalances[boughtCoin] = transactions[i].cost;
//           currentBoughtCoinBalance = currentBalances[boughtCoin];
//         }
//         if (currentBalances[soldCoin]) {
//           currentSoldCoinBalance = currentBalances[soldCoin];
//           currentBalances[soldCoin] += transactions[i].amount;
//         } else {
//           currentBalances[soldCoin] = transactions[i].amount;
//           currentSoldCoinBalance = currentBalances[soldCoin];
//         }
//       }

//       transactions[i] = {
//         ...transactions[i],
//         currentBoughtCoinBalance,
//         currentSoldCoinBalance,
//       };
//     }
//   }

//   return transactions;
// };

// const taxCalculatorLifo = async (allTransactions) => {
//   const transactions = allTransactions.sort(
//     (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
//   );
//   const boughtCoins = {};
//   for (let i = 0; i < transactions.length; i++) {
//     if (transactions[i].side.toLowerCase() === 'buy') {
//       const [boughtCoin, soledCoin] = transactions[i].symbol.split('/');
//       if (soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(boughtCoin);
//         if (!coinID) coinID = this.coinNotFound(boughtCoin);
//         const date = new Date(transactions[i].datetime);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           cgtDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: 1 / transactions[i].price,
//           cgtDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//         };
//       }

//       if (boughtCoins[boughtCoin])
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//       else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//     } else if (transactions[i].side.toLowerCase() === 'sell') {
//       const [soledCoin, boughtCoin] = transactions[i].symbol.split('/');

//       if (boughtCoin !== 'AUD' && soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(soledCoin);
//         if (!coinID) coinID = this.coinNotFound(soledCoin);
//         const date = new Date(transactions[i].datetime);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           cgtDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: 1 / transactions[i].price,
//           cgtDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//         };
//       }

//       if (boughtCoins[boughtCoin])
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//       else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//       if (boughtCoins[soledCoin]) {
//         let amount = transactions[i].amount;
//         let CGT = 0;
//         let relatedTransactions = [];
//         for (let j = boughtCoins[soledCoin].length - 1; j >= 0; j--) {
//           if (amount > 0) {
//             if (boughtCoins[soledCoin][j].amount >= amount) {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins[soledCoin][j].priceInAUD;
//               boughtCoins[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT,
//                 cgtDetail: {
//                   boughtFor:
//                     transactions[i].amount *
//                     boughtCoins[soledCoin][j].priceInAUD,
//                   soledFor: transactions[i].amount * transactions[i].priceInAUD,
//                 },
//                 relatedTransactions,
//               };
//             } else {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 boughtCoins[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins[soledCoin][j].amount *
//                   boughtCoins[soledCoin][j].priceInAUD;

//               amount -= boughtCoins[soledCoin][j].amount;
//               boughtCoins[soledCoin][j].amount = 0;
//             }
//           }
//         }
//       }
//     } else {
//       transactions[i] = {
//         ...transactions[i],
//         CGT: 0,
//         cgtDetail: {
//           boughtFor: 0,
//           soledFor: 0,
//         },
//         relatedTransactions: [],
//       };
//     }
//   }
//   return transactions;
// };

// const taxCalculatorCSV = async (allTransactions) => {
//   let error = false;
//   const transactions = allTransactions;
//   const boughtCoins = {};
//   for (let i = 0; i < transactions.length; i++) {
//     if (transactions[i].type.toLowerCase() === 'buy') {
//       const [boughtCoin, soledCoin] = transactions[i].market.split('/');
//       if (soledCoin !== 'AUD') {
//         try {
//           for (let i = 0; i < 1000000000; i++) {}
//           let coinID = getCoinId(boughtCoin);
//           if (!coinID) coinID = coinNotFound(boughtCoin);
//           const date = new Date(transactions[i].transactionDate);
//           const exchangeRates = await coinGeckoRequest(
//             coinID,
//             '' +
//               (date.getDay() + 1) +
//               '-' +
//               (date.getMonth() + 1) +
//               '-' +
//               date.getFullYear(),
//           );
//           transactions[i] = {
//             ...transactions[i],
//             CGT: 0,
//             priceInAUD: exchangeRates.market_data.current_price.aud,
//           };
//         } catch (e) {
//           error = true;
//           transactions[i] = {
//             ...transactions[i],
//             CGT: 0,
//             priceInAUD: 0,
//           };
//         }
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: 1 / transactions[i].rateIncFee,
//         };
//       }

//       if (boughtCoins[boughtCoin])
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//       else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//     } else if (transactions[i].type.toLowerCase() === 'sell') {
//       const [soledCoin, boughtCoin] = transactions[i].market.split('/');
//       if (boughtCoin !== 'AUD' && soledCoin !== 'AUD') {
//         try {
//           for (let i = 0; i < 1000000000; i++) {}
//           let coinID = getCoinId(soledCoin);
//           if (!coinID) coinID = coinNotFound(soledCoin);
//           if (coinID === undefined) {
//             coinID = getCoinId(boughtCoin);
//             if (!coinID) coinID = coinNotFound(boughtCoin);
//             if (coinID !== undefined) {
//               const date = new Date(transactions[i].transactionDate);
//               const exchangeRates = await coinGeckoRequest(
//                 coinID,
//                 '' +
//                   (date.getDay() + 1) +
//                   '-' +
//                   (date.getMonth() + 1) +
//                   '-' +
//                   date.getFullYear(),
//               );
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: 0,
//                 priceInAUD: exchangeRates.market_data
//                   ? exchangeRates.market_data.current_price.aud
//                   : 0 * transactions[i].rateIncFee,
//               };
//             } else {
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: 0,
//                 priceInAUD: 0,
//               };
//             }
//           } else {
//             const date = new Date(transactions[i].transactionDate);
//             const exchangeRates = await coinGeckoRequest(
//               coinID,
//               '' +
//                 (date.getDay() + 1) +
//                 '-' +
//                 (date.getMonth() + 1) +
//                 '-' +
//                 date.getFullYear(),
//             );
//             transactions[i] = {
//               ...transactions[i],
//               CGT: 0,
//               priceInAUD: exchangeRates.market_data
//                 ? exchangeRates.market_data.current_price.aud
//                 : 0 * transactions[i].rateIncFee,
//             };
//           }
//         } catch (e) {
//           error = true;
//           transactions[i] = {
//             ...transactions[i],
//             CGT: 0,
//             priceInAUD: 0,
//           };
//         }
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: 0,
//           priceInAUD: 1 / transactions[i].rateIncFee,
//         };
//       }

//       if (boughtCoins[boughtCoin])
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//       else boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//       if (boughtCoins[soledCoin]) {
//         let amount = transactions[i].amount;
//         let CGT = 0;
//         for (let j = 0; j < boughtCoins[soledCoin].length; j++) {
//           if (amount > 0) {
//             if (boughtCoins[soledCoin][j].amount >= amount) {
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins[soledCoin][j].priceInAUD;
//               boughtCoins[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT,
//               };
//             } else {
//               CGT +=
//                 boughtCoins[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins[soledCoin][j].amount *
//                   boughtCoins[soledCoin][j].priceInAUD;

//               amount -= boughtCoins[soledCoin][j].amount;
//               boughtCoins[soledCoin][j].amount = 0;
//             }
//           }
//         }
//       }
//     }
//   }
//   return transactions;
// };

// const taxCalculatorCSV = async (allTransactions) => {
//   const transactions = allTransactions.sort(
//     (a, b) =>
//       new Date(a.transactionDate).getTime() -
//       new Date(b.transactionDate).getTime(),
//   );
//   const boughtCoins = {};
//   const boughtCoins2 = {};
//   for (let i = 0; i < transactions.length; i++) {
//     if (transactions[i].type.toLowerCase() === 'buy') {
//       const [boughtCoin, soledCoin] = transactions[i].market.split('/');
//       if (soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(boughtCoin);
//         if (!coinID) coinID = coinNotFound(boughtCoin);
//         const date = new Date(transactions[i].transactionDate);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );
//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: 1 / transactions[i].price,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: 0,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       }

//       if (boughtCoins[boughtCoin]) {
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//         boughtCoins2[boughtCoin].push({ ...transactions[i] });
//       } else {
//         boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//         boughtCoins2[boughtCoin] = [{ ...transactions[i] }];
//       }
//     } else if (transactions[i].type.toLowerCase() === 'sell') {
//       const [soledCoin, boughtCoin] = transactions[i].market.split('/');

//       if (boughtCoin !== 'AUD' && soledCoin !== 'AUD') {
//         for (let i = 0; i < 10000000; i++) {}
//         let coinID = getCoinId(soledCoin);
//         if (!coinID) coinID = coinNotFound(soledCoin);
//         const date = new Date(transactions[i].transactionDate);
//         const exchangeRates = await coinGeckoRequest(
//           coinID,
//           '' +
//             (date.getDay() + 1) +
//             '-' +
//             (date.getMonth() + 1) +
//             '-' +
//             date.getFullYear(),
//         );
//         transactions[i] = {
//           ...transactions[i],
//           CGT: { fifo: 0, lifo: 0 },
//           priceInAUD: exchangeRates.market_data.current_price.aud,
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       } else {
//         transactions[i] = {
//           ...transactions[i],
//           priceInAUD: 1 / transactions[i].price,
//           CGT: { fifo: 0, lifo: 0 },
//           fifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           lifoCGTDetail: {
//             boughtFor: transactions[i].cost,
//             soledFor: transactions[i].cost,
//           },
//           fifoRelatedTransactions: [],
//           lifoRelatedTransactions: [],
//         };
//       }

//       if (boughtCoins[boughtCoin]) {
//         boughtCoins[boughtCoin].push({ ...transactions[i] });
//         boughtCoins2[boughtCoin].push({ ...transactions[i] });
//       } else {
//         boughtCoins[boughtCoin] = [{ ...transactions[i] }];
//         boughtCoins2[boughtCoin] = [{ ...transactions[i] }];
//       }
//       if (boughtCoins[soledCoin]) {
//         let amount = transactions[i].amount;
//         let CGT = 0;
//         let relatedTransactions = [];
//         for (let j = 0; j < boughtCoins[soledCoin].length; j++) {
//           if (amount > 0) {
//             if (boughtCoins[soledCoin][j].amount >= amount) {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins[soledCoin][j].priceInAUD;
//               boughtCoins[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: { ...transactions[i].CGT, fifo: CGT },
//                 fifoCGTDetail: {
//                   boughtFor:
//                     transactions[i].amount *
//                     boughtCoins[soledCoin][j].priceInAUD,
//                   soledFor: transactions[i].amount * transactions[i].priceInAUD,
//                 },
//                 fifoRelatedTransactions: relatedTransactions,
//               };
//             } else {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 boughtCoins[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins[soledCoin][j].amount *
//                   boughtCoins[soledCoin][j].priceInAUD;

//               amount -= boughtCoins[soledCoin][j].amount;
//               boughtCoins[soledCoin][j].amount = 0;
//             }
//           }
//         }
//         amount = transactions[i].amount;
//         CGT = 0;
//         relatedTransactions = [];
//         for (let j = boughtCoins2[soledCoin].length - 1; j >= 0; j--) {
//           if (amount > 0) {
//             if (boughtCoins2[soledCoin][j].amount >= amount) {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 transactions[i].amount * transactions[i].priceInAUD -
//                 transactions[i].amount * boughtCoins2[soledCoin][j].priceInAUD;
//               boughtCoins2[soledCoin][j].amount -= amount;
//               amount = 0;
//               transactions[i] = {
//                 ...transactions[i],
//                 CGT: { ...transactions[i].CGT, lifo: CGT },
//                 lifoCGTDetail: {
//                   boughtFor:
//                     transactions[i].amount *
//                     boughtCoins2[soledCoin][j].priceInAUD,
//                   soledFor: transactions[i].amount * transactions[i].priceInAUD,
//                 },
//                 lifoRelatedTransactions: relatedTransactions,
//               };
//             } else {
//               relatedTransactions.push(boughtCoins[soledCoin][j]);
//               CGT +=
//                 boughtCoins2[soledCoin][j].amount * transactions[i].priceInAUD -
//                 boughtCoins2[soledCoin][j].amount *
//                   boughtCoins2[soledCoin][j].priceInAUD;

//               amount -= boughtCoins2[soledCoin][j].amount;
//               boughtCoins2[soledCoin][j].amount = 0;
//             }
//           }
//         }
//       }
//     } else {
//       transactions[i] = {
//         ...transactions[i],
//         CGT: { fifo: 0, lifo: 0 },
//         lifoCGTDetail: {
//           boughtFor: 0,
//           soledFor: 0,
//         },
//         fifoCGTDetail: {
//           boughtFor: 0,
//           soledFor: 0,
//         },
//         fifoRelatedTransactions: [],
//         lifoRelatedTransactions: [],
//       };
//     }
//   }
//   return transactions;
// };

// const coinNotFound = (symbol) => {
//   return newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0]
//     ? newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0].id
//     : undefined;
// };

// export { taxCalculatorCSV, taxCalculatorLifo };
