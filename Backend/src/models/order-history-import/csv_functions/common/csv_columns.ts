export const columns = {
  'Transaction Date,Type,Market,Amount,Rate inc. fee,Rate ex. fee,Fee,Fee AUD (inc GST),GST AUD,Total AUD,Total (inc GST)':
    (transaction, exchange, userID) => {
      const currency = transaction.market.split('/')[1];
      return {
        datetime: transaction.transactionDate,
        side: transaction.type.toLowerCase(),
        symbol: transaction.market,
        amount: transaction.amount,
        fee: { cost: transaction.fee, currency },
        cost: transaction.totalIncGst,
        price: transaction.rateIncFee,
        priceInAud: transaction.totalAud / transaction.amount,
        exchange,
        user: userID,
        source: 'csv',
      };
    },
};
