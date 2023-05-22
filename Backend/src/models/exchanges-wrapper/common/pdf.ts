import * as pdf from 'pdf-creator-node';
import * as fs from 'fs';
import * as path from 'path';

export const createPDF = async (trades, filename, algorithm, financialYear) => {
  const html = fs.readFileSync(
    path.join(
      __dirname +
        '/../../../../src/models/exchanges-wrapper/common/pdf_template.html',
    ),
    'utf8',
  );

  const [year1, year2] = financialYear.split('-');
  const financialYearDate = `1st July ${year1} - 30th June ${year2}`;
  // `${year1}-7-1 00:00:00`, `${year2}-6-30 00:00:00`;

  let totalLoss = 0;
  let totalGain = 0;
  let totalCGT = 0;
  let shortTerm = 0;
  let longTerm = 0;
  const otherTrades = [];
  const shortTermTrades = [];
  const longTermTrades = [];
  for (let i = 0; i < trades.length; i++) {
    if (trades[i].cgt.fifo > 0) {
      totalGain += trades[i].cgt.fifo;
      totalCGT += trades[i].cgt.fifo;
    } else {
      totalLoss -= Math.abs(trades[i].cgt.fifo);
      totalCGT -= Math.abs(trades[i].cgt.fifo);
    }
    const date = new Date(trades[i].datetime);
    const side = trades[i].side.split('');
    side[0] = side[0].toUpperCase();

    const exchange = trades[i].exchange.split('');
    exchange[0] = exchange[0].toUpperCase();
    const trade = {
      ...trades[i],
      exchange: exchange.join(''),
      side: side.join(''),
      price: parseFloat(trades[i].price).toFixed(8),
      amount: parseFloat(trades[i].amount).toFixed(8),
      cost: parseFloat(trades[i].cost).toFixed(8),
      fee: {
        ...trades[i].fee,
        cost: parseFloat(trades[i].fee.cost).toFixed(8),
      },
      cgt: {
        ...trades[i].cgt,
        fifo: parseFloat(trades[i].cgt.fifo).toFixed(8),
      },
      datetime:
        date.getDate() +
        '/' +
        date.getMonth() +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes(),
    };
    if (trades[i].taxType === 'other trx') {
      otherTrades.push(trade);
    } else if (trades[i].taxType === 'long term') {
      longTermTrades.push(trade);
      longTerm += +trade.cgt.fifo > 0 ? +trade.cgt.fifo : 0;
    } else if (trades[i].taxType === 'short term') {
      shortTermTrades.push(trade);
      shortTerm += +trade.cgt.fifo > 0 ? +trade.cgt.fifo : 0;
    }
  }
  // trades = trades.map((trade, index) => {
  //   if (trade.cgt.fifo > 0) {
  //     totalGain += trade.cgt.fifo;
  //     totalCGT += trade.cgt.fifo;
  //   } else {
  //     totalLoss -= Math.abs(trade.cgt.fifo);
  //     totalCGT -= Math.abs(trade.cgt.fifo);
  //   }
  //   const date = new Date(trade.datetime);
  //   const side = trade.side.split('');
  //   side[0] = side[0].toUpperCase();

  //   const exchange = trade.exchange.split('');
  //   exchange[0] = exchange[0].toUpperCase();
  //   return {
  //     ...trade,
  //     exchange: exchange.join(''),
  //     side: side.join(''),
  //     price: parseFloat(trade.price).toFixed(8),
  //     amount: parseFloat(trade.amount).toFixed(8),
  //     cost: parseFloat(trade.cost).toFixed(8),
  //     fee: {
  //       ...trade.fee,
  //       cost: parseFloat(trade.fee.cost).toFixed(8),
  //     },
  //     cgt: { ...trade.cgt, fifo: parseFloat(trade.cgt.fifo).toFixed(8) },
  //     datetime:
  //       date.getDate() +
  //       '/' +
  //       date.getMonth() +
  //       '/' +
  //       date.getFullYear() +
  //       ' ' +
  //       date.getHours() +
  //       ':' +
  //       date.getMinutes(),
  //   };
  // });
  const fileName = `${filename}.pdf`;
  const options = {
    format: 'A2',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '45mm',
      contents: '<div style="text-align: center;">Tax Calculation</div>',
    },
    footer: {
      height: '28mm',
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page',
      },
    },
  };

  const document = {
    html: html,
    data: {
      financialYearDate,
      datetime: new Date().toUTCString(),
      totalLoss: Math.abs(totalLoss).toFixed(2),
      totalGain: totalGain.toFixed(2),
      totalCGT: totalCGT.toFixed(2),
      otherTrades,
      longTermTrades,
      shortTermTrades,
      shortTerm: shortTerm.toFixed(2),
      longTerm: longTerm.toFixed(2),
      totalType: totalCGT > 0 ? 'Gain' : 'Loss',
    },
    path: __dirname + `../../../../${fileName}`,
    type: '',
  };

  const data = await pdf.create(document, options);

  return fileName;
};

export const createPDFTransactions = async (
  trades,
  filename,
  algorithm,
  financialYear,
) => {
  const html = fs.readFileSync(
    path.join(
      __dirname +
        '/../../../../src/models/exchanges-wrapper/common/pdf_transactions_template.html',
    ),
    'utf8',
  );

  const [year1, year2] = financialYear.split('-');
  const financialYearDate = `1st July ${year1} - 30th June ${year2}`;
  // `${year1}-7-1 00:00:00`, `${year2}-6-30 00:00:00`;

  // let totalLoss = 0;
  // let totalGain = 0;
  // let totalCGT = 0;
  // let shortTerm = 0;
  // let longTerm = 0;
  // const otherTrades = [];
  // const shortTermTrades = [];
  // const longTermTrades = [];
  // for (let i = 0; i < trades.length; i++) {
  //   if (trades[i].cgt.fifo > 0) {
  //     totalGain += trades[i].cgt.fifo;
  //     totalCGT += trades[i].cgt.fifo;
  //   } else {
  //     totalLoss -= Math.abs(trades[i].cgt.fifo);
  //     totalCGT -= Math.abs(trades[i].cgt.fifo);
  //   }
  //   const date = new Date(trades[i].datetime);
  //   const side = trades[i].side.split('');
  //   side[0] = side[0].toUpperCase();

  //   const exchange = trades[i].exchange.split('');
  //   exchange[0] = exchange[0].toUpperCase();
  //   const trade = {
  //     ...trades[i],
  //     exchange: exchange.join(''),
  //     side: side.join(''),
  //     price: parseFloat(trades[i].price).toFixed(8),
  //     amount: parseFloat(trades[i].amount).toFixed(8),
  //     cost: parseFloat(trades[i].cost).toFixed(8),
  //     fee: {
  //       ...trades[i].fee,
  //       cost: parseFloat(trades[i].fee.cost).toFixed(8),
  //     },
  //     cgt: {
  //       ...trades[i].cgt,
  //       fifo: parseFloat(trades[i].cgt.fifo).toFixed(8),
  //     },
  //     datetime:
  //       date.getDate() +
  //       '/' +
  //       date.getMonth() +
  //       '/' +
  //       date.getFullYear() +
  //       ' ' +
  //       date.getHours() +
  //       ':' +
  //       date.getMinutes(),
  //   };
  //   if (trades[i].taxType === 'other trx') {
  //     otherTrades.push(trade);
  //   } else if (trades[i].taxType === 'long term') {
  //     longTermTrades.push(trade);
  //     longTerm += +trade.cgt.fifo > 0 ? +trade.cgt.fifo : 0;
  //   } else if (trades[i].taxType === 'short term') {
  //     shortTermTrades.push(trade);
  //     shortTerm += +trade.cgt.fifo > 0 ? +trade.cgt.fifo : 0;
  //   }
  // }

  const fileName = `${filename}.pdf`;
  const options = {
    format: 'A2',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '45mm',
      contents: '<div style="text-align: center;">Tax Calculation</div>',
    },
    footer: {
      height: '28mm',
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page',
      },
    },
  };

  const document = {
    html: html,
    data: {
      financialYearDate,
      datetime: new Date().toUTCString(),
      trades: trades.map((trade) => ({
        ...trade,
        datetime: new Date(trade.datetime).toUTCString(),
      })),
    },
    path: __dirname + `../../../../${fileName}`,
    type: '',
  };

  const data = await pdf.create(document, options);

  return fileName;
};

export const createPDFInvestment = async (
  holdings,
  filename,
  algorithm,
  financialYear,
) => {
  console.log(holdings);
  const html = fs.readFileSync(
    path.join(
      __dirname +
        '/../../../../src/models/exchanges-wrapper/common/pdf_investment_template.html',
    ),
    'utf8',
  );

  const [year1, year2] = financialYear.split('-');
  const financialYearDate = `1st July ${year1} - 30th June ${year2}`;
  // `${year1}-7-1 00:00:00`, `${year2}-6-30 00:00:00`;

  const fileName = `${filename}.pdf`;
  const options = {
    format: 'A2',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '45mm',
      contents: '<div style="text-align: center;">Tax Calculation</div>',
    },
    footer: {
      height: '28mm',
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page',
      },
    },
  };
  //  exchange,
  //         currency: holdingCoins[i],
  //         opBalQT: holding['previousHoldingForCoin']['amount'],
  //         opCostBase: holding['previousHoldingForCoin']['costBase'],
  //         purchasesQTY: holding['boughtQty'],
  //         purchasePrice: holding['boughtCostBase'],
  //         saleQTY: holding['soledQty'],
  //         costOfSoldQty: holding['soledCostBase'],
  //         closingBalQT: holding['amount'],
  //         closingCostBase:
  //           holding['previousHoldingForCoin']['costBase'] +
  //           holding['boughtCostBase'] -
  //           holding['soledCostBase'],
  //         marketValue: holding['amount'] * exchangeRate,
  //         unrealized:
  //           holding['amount'] * exchangeRate -
  //           (holding['previousHoldingForCoin']['costBase'] +
  //             holding['boughtCostBase'] -
  //             holding['soledCostBase']),

  const document = {
    html: html,
    data: {
      financialYearDate,
      datetime: new Date().toUTCString(),
      holdings,
    },
    path: __dirname + `../../../../${fileName}`,
    type: '',
  };

  const data = await pdf.create(document, options);

  return fileName;
};
