import {
  // Backdrop,
  // Breadcrumbs,
  Button,
  CircularProgress,
  // IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  FormHelperText,
  TableContainer,
  Input,
  MenuItem,
  TableFooter,
  TableHead,
  Select,
  InputLabel,
  FormControl,
  // TablePagination,
  TableRow,
  // Tooltip,
  // Typography,
  withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import configData from "./.././../config.json";
import { useDispatch, useSelector } from "react-redux";
import { drawerSelectionChanged } from "../../store/ui/drawer";
import styles from "../../styles/viewsStyles/TransactionsTableStyles";
import { useEthers, useEtherBalance, useTransactions } from "@usedapp/core";
// import { Link, withRouter } from "react-router-dom";
import { ArrowForward } from "@material-ui/icons";
// import { loadTransactions } from "../../store/transactions/transactions";
// import { RefreshIcon } from "./../../resources/design-icons";
import {
  formatDate,
  // formatAmount,
  // getCurrencyIcon,
} from "./../../utils/utilities";
import coinbaseLogo from "../../resources/design-images/coinbase.svg";
import binanceLogo from "../../resources/design-images/binance.svg";
import axios from "axios";
const baseUrl = configData.url.baseURL;
function TransactionsTable(props) {
  const [metaData, setMetaData] = useState([]);
  const { classes } = props;
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [csvFile, setCsvFile] = useState();
  const [response, setResponse] = useState([]);
  // let data=[];
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  const { activateBrowserWallet, account } = useEthers();
  const dispatch = useDispatch();
  const exchange = useSelector((state) => state.ui.currency.selection);
  const transactions = useSelector((state) => state.entities.transactions.list);
  const Binancetransactions = useSelector(
    (state) => state.entities.transactions.binanceList
  );
  const Alltransactions = useSelector(
    (state) => state.entities.transactions.allList
  );
  const transactionsLoading = useSelector(
    (state) => state.entities.transactions.loading
  );
  const transactionsError = useSelector(
    (state) => state.entities.transactions.isError
  );
  const transactionsErrorMsg = useSelector(
    (state) => state.entities.transactions.errorMessage
  );

  // useEffect(() => {
  //   dispatch(drawerSelectionChanged("Transactions"));
  //   if (transactions.length === 0) dispatch(loadTransactions(exchange));
  // }, []);

  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const [stackingHistory, setStackingHistory] = useState(false);
  const [setSwytx, setSwytxData] = useState([]);

  const handelStackingHistory = () => {
    setStackingHistory(!stackingHistory);
  };
  function csvJSON(csv) {
    var lines = csv.split("\n");

    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return JSON.stringify(result); //JSON
  }
  const handelCSV = (file) => {
    let formData = new FormData();

    formData.append("file", file);
    axios
      .post(`${baseUrl}/order-history-import/upload`, formData)
      .then((res) => {
        alert("File uploaded");
      })
      .catch((e) => {
        console.log("Error b:", e);
      });
    const reader = new FileReader();
    reader.onload = function (file) {
      setCsvFile(
        file.target?.result
          .replace(/"/g, "")
          .replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
      );
      let list = csvJSON(
        file.target?.result
          .replace(/"/g, "")
          .replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
      );
      list.replace("\r", "");
      let a = JSON.parse(list);

      list = a.map((obj, idx) => {
        const reObj = {
          amount: parseFloat(obj.Amount),
          fee: {
            cost: parseFloat(obj["Fee AUD (inc GST)"]),
          },
          cost: parseFloat(obj["Total (inc GST)"]),
          datetime: obj["Transaction Date"],
          side: obj.Type,
          status: "closed",
          symbol: obj.Market,
          price: parseFloat(obj["Fee AUD (inc GST)"]),
          exchangeRate: parseFloat(obj["Rate ex. fee"]),
        };

        return reObj;
      });

      setData(list);
    };
    reader.readAsText(file);
  };

  // const metamaskAccounts = async () => {
  //   const ethereum = window.ethereum;
  //   const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  //   axios
  //     .get(
  //       `https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${accounts[0]}&startblock=0&endblock=99999999&sort=asc&apikey=KHM61FRBSBJB48Y64F98ZSMI5JMPI7JPY7`
  //     )
  //     .then((res) => {
  //       console.log("adrak", res.data);
  //     });
  //   return accounts;
  // };

  // useEffect(() => {
  //   console.log("metamask accounts", metamaskAccounts());
  // }, []);

  useEffect(() => {
    setData([]);
  }, [exchange]);

  const renderTrade = (data) => {
    // let symbol = data.symbol.split("/");
    if (data.side === "buy") {
      return (
        <div>
          <div>
            {parseFloat(data.cost.toFixed(4)).toLocaleString()}{" "}
            {data.symbol.split("/")[1]}{" "}
            <span>
              <ArrowForward />
            </span>{" "}
            {parseFloat(data.amount.toFixed(4)).toLocaleString()}{" "}
            {data.symbol.split("/")[0]}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            {data.cost === 0 ? (
              <div>
                {parseFloat(data.amount).toFixed(4)} {data.symbol}
              </div>
            ) : (
              <div>
                {" "}
                {parseFloat(data.amount).toFixed(4).toLocaleString()}{" "}
                {data.symbol.split("/")[0]} <ArrowForward />{" "}
                {parseFloat(
                  data.cost ? data.cost.toFixed(4) : ""
                ).toLocaleString()}
                {data.symbol.split("/")[1]}
              </div>
            )}
            {/* {parseFloat(data.amount).toFixed(4)} {symbol[0]} <ArrowForward />{" "}
            {parseFloat(data.cost ? data.cost : "").toFixed(4)}
            {symbol[1]} */}
          </div>
        </div>
      );
    }

    const refreshData = () => {
      // if (!transactionsLoading) dispatch(loadTransactions(exchange));
      axios.get(`${baseUrl}/exchanges/binance-trades`).then((res) => {
        setData(res.data.flat());
        setDataCount(data.length);
      });
    };
  };

  const refreshData = () => {
    // if (!transactionsLoading) dispatch(loadTransactions(exchange));
    axios.get(`${baseUrl}/exchanges/binance-trades`).then((res) => {
      setData(res.data.flat());
      setDataCount(data.length);
    });
  };
  const getCoinBaseTotal = () => {
    let sum = 0;
    for (var transaction of transactions) {
      sum += parseInt(transaction.amount, 10);
    }
    return sum;
  };

  const getBinanceTotal = () => {
    let sum = 0;
    for (var transaction of data) {
      sum += parseInt(transaction.cost, 10);
    }
    return sum;
  };

  const getBinanceTotalBuy = () => {
    let sum = 0;
    for (var transaction of data) {
      if (transaction.side === "buy")
        sum += parseInt(transaction.cost + transaction.fee.cost, 10);
    }
    return sum;
  };

  const getBinanceTotalSell = () => {
    let sum = 0;
    for (var transaction of data) {
      if (transaction.side === "sell")
        sum += parseInt(transaction.cost + transaction.fee.cost, 10);
    }
    return sum;
  };

  const getAmountTotal = () => {
    let sum = 0;
    for (var transaction of data) {
      sum += parseInt(transaction.cost, 10);
    }
    return sum;
  };
  const handelCsv = () => {
    console.log("Hitting");
  };
  useEffect(() => {
    if (exchange === "binance") {
      setData([]);
      let one = axios.get(`${baseUrl}/exchanges/binance-trades`);
      let two = axios.get(`${baseUrl}/exchanges/asset-dividend`);
      let three = axios.get(`${baseUrl}/exchanges/depositWithdrawalHistory`);
      axios.all([one, two, three]).then(
        axios.spread((...res) => {
          let res1 = res[0];
          let res2 = res[1];
          let res3 = res[2];
          let filteredData1 = res1.data.flat();
          filteredData1 = filteredData1.filter(
            (data) => data.side === "buy" || data.side === "sell"
          );
          let filteredData3 = res3.data.data;
          let filteredData2 = res2.data.rows.map((i) => {
            let n = new Date(i.timestamp).toISOString();
            i["symbol"] = i.asset;
            i["datetime"] = n;
            i["cost"] = 0;
            if (i.symbol === "PURSE") {
              i["side"] = "Reward";
            } else if (i.symbol === "PUNDIX") {
              i["side"] = "Airdrop";
            } else if (i.symbol === "DOT") {
              i["side"] = i.enInfo;
            }
            i["fee"] = { cost: 0 };
            return i;
          });
          filteredData2.map((r) => {
            return filteredData1.push(r);
          });
          filteredData3.map((i) => {
            i["timestamp"] = i.updateTime;
            i["side"] = i.method;
            i["fee"] = { cost: i.totalFee };
            i["cost"] = 0;
            return i;
          });
          filteredData3.map((r) => filteredData1.push(r));
          setData(filteredData1);

          setDataCount(data.length);
        })
      );
    } else if (exchange === "swyftx") {
      setData([]);
      let one = axios.get(`${baseUrl}/swyftx`);
      let two = axios.get(`${baseUrl}/swyftx/stackinghistory`);
      axios.all([one, two]).then(
        axios.spread((...res) => {
          let res1 = res[0];
          let res2 = res[1];
          let filteredData1 = res1.data.flat();
          let filteredData2 = res2.data.sort(
            (a, b) => b.timestamp - a.timestamp
          );
          // filteredData1 = filteredData1.filter(
          //   (data) => data.side === "buy" || data.side === "sell"
          // );
          setData(filteredData1);
          setSwytxData(filteredData2);
          setDataCount(data.length);
        })
      );
    } else if (exchange === "coinbase") {
      axios
        .get(`${baseUrl}/exchanges/coinbase-transactions-file`)
        .then((res) => {
          let filteredData = res.data.flat();
          filteredData = filteredData.filter(
            (data) => data.side === "buy" || data.side === "sell"
          );
          setData(filteredData);
          setDataCount(data.length);
        });
    } else if (exchange === "coinspot") {
      let one = axios.get(`${baseUrl}/exchanges/coinspot-trades`);
      let two = axios.get(`${baseUrl}/exchanges/coinspot-deposits`);
      let three = axios.get(`${baseUrl}/exchanges/coinspot-widthdrawals`);
      axios.all([one, two, three]).then((res) => {
        let res1 = res[0];
        let res2 = res[1];
        let res3 = res[2];

        setTimeout(() => {}, 2000);
        let filteredData1 = res[0].data ? res[0].data.flat() : [];
        filteredData1 = filteredData1.filter(
          (data) => data.side === "buy" || data.side === "sell"
        );
        let filteredData2 = res[1].data
          ? res[1].data.deposits.map((i) => {
              i["side"] = i.type;
              i["method"] = i.status;
              i["fee"] = { cost: 0 };
              i["cost"] = 0;
              return i;
            })
          : [];
        filteredData2.map((r) => filteredData1.push(r));
        setData(filteredData1);
        setDataCount(data.length);
      });
    } else if (exchange === "metamask") {
      const metamaskAccounts = async () => {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        axios
          .get(
            `https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${accounts[0]}&startblock=0&endblock=99999999&sort=asc&apikey=KHM61FRBSBJB48Y64F98ZSMI5JMPI7JPY7`
          )
          .then((res) => {
            setMetaData(res.data.result);
          });
        return accounts;
      };
      metamaskAccounts();
    } else {
      setData([]);
      setMetaData([]);
    }
  }, [exchange]);

  // useEffect(() => {
  //   let filteredData1 = response.length > 0 ? response[0].data.flat() : [];
  //   filteredData1 = filteredData1.filter(
  //     (data) => data.side === "buy" || data.side === "sell"
  //   );
  //   let filteredData2 =
  //     response.length > 0
  //       ? response[1].data.deposits.map((i) => {
  //           i["side"] = i.type;
  //           i["method"] = i.status;
  //           i["fee"] = { cost: 0 };
  //           return i;
  //         })
  //       : [];
  //   filteredData2.map((r) => filteredData1.push(r));
  //   console.log("FilteredDataUpdated :", filteredData1);
  //   setData(filteredData1);
  //   setDataCount(data.length);
  // }, [response]);

  useEffect(() => {
    dispatch(drawerSelectionChanged("Transactions"));
    axios.get(`${baseUrl}/exchanges/binance-trades`).then((res) => {
      setData(res.data.flat());
      setDataCount(data.length);
    });
  }, []);
  const renderSwyftx = () => {
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell className={classes.tableRow} colSpan={7} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    else if (transactionsError)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell className={classes.tableRow} colSpan={6} align="center">
            {transactionsErrorMsg}
          </TableCell>
        </TableRow>
      );
    let listToBeShown = data.sort((a, b) => b.timestamp - a.timestamp);
    const list = listToBeShown.map((data, count) => (
      <TableRow key={data.id} component={Paper} className={classes.tableRow}>
        <TableCell className={classes.tableRowPadding} align="center">
          {formatDate(data.datetime)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.side.toUpperCase()}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {exchange === "swyftx"
            ? data.side === "deposit" || "withdrawal"
              ? data.amount
              : parseFloat(data.price).toFixed(6)
            : data.method}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {/* {switch(exchange){
            case 'Binance':
              `${data.amount} ${da}`
          }}
           */}
          {renderTrade(data)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {(data.fee.cost = "2" ? data.fee.cost : "")}{" "}
          {exchange === "swyftx"
            ? data.side === "deposit"
              ? data.symbol
              : data.side === "buy"
              ? data.symbol.split("/")[0]
              : data.side === "sell"
              ? data.symbol.split("/")[1]
              : ""
            : data.fee.currency}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {`${
            data.cost === 0 ? "" : (data.amount - data.fee.cost).toFixed(4)
          } ${
            data.cost === 0
              ? ""
              : data.side === "buy"
              ? data.symbol.split("/")[0]
              : data.symbol.split("/")[1]
          }`}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.CGT}
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  const renderTransactions = () => {
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell className={classes.tableRow} colSpan={7} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    else if (transactionsError)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell className={classes.tableRow} colSpan={6} align="center">
            {transactionsErrorMsg}
          </TableCell>
        </TableRow>
      );
    console.log("data", data);
    let listToBeShown =
      exchange === "metamask"
        ? metaData.sort((a, b) => b.timestamp - a.timestamp)
        : data.sort((a, b) => b.timestamp - a.timestamp);
    const list = listToBeShown.map((data, count) => (
      <TableRow key={data.id} component={Paper} className={classes.tableRow}>
        <TableCell className={classes.tableRowPadding} align="center">
          {formatDate(data.datetime)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.side.toUpperCase()}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {exchange === "binance"
            ? data.price
            : exchange === "swyftx"
            ? data.side === "deposit" || "withdrawal"
              ? data.amount
              : parseFloat(data.price).toFixed(6)
            : data.method
            ? ""
            : parseFloat(data.price).toFixed(6)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {/* {switch(exchange){
            case 'Binance':
              `${data.amount} ${da}`
          }}
           */}
          {data.method
            ? exchange === "binance"
              ? `${data.amount} ${data.info.symbol}`
              : exchange === "coinspot"
              ? `${data.amount}`
              : `${data.amount}`
            : renderTrade(data)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {(data.fee.cost = "2" ? data.fee.cost : "")}{" "}
          {exchange === "swyftx"
            ? data.side === "buy"
              ? data.symbol.split("/")[0]
              : data.symbol.split("/")[1]
            : data.fee.currency}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {exchange === "coinspot"
            ? data.amount
            : data.cost === 0
            ? ""
            : data.side === "buy"
            ? `${(data.amount - data.fee.cost).toFixed(4)} ${
                exchange === "swyftx"
                  ? data.side === "buy"
                    ? data.symbol.split("/")[0]
                    : data.symbol.split("/")[1]
                  : exchange === "coinspot"
                  ? data.symbol.split("/")[0]
                  : data.fee.currency
              }`
            : `${(data.cost - data.fee.cost).toFixed(4)} ${data.fee.currency}`}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.CGT}
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };
  const renderStackingHistory = () => {
    const list = setSwytx.map((data, idx) => (
      <TableRow key={idx} component={Paper} className={classes.tableRow}>
        <TableCell className={classes.tableRowPadding} align="center">
          {formatDate(data.timestamp)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.amount.toFixed(8)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.asset}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.assetId}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.swyftxValue.toFixed(8)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.type}
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  const renderMetamask = () => {
    //  console.log("type", type);
    //  if (type === "high to low") {
    //    // console.log("sorted for data gigi", data);
    //    let sortedData = data.sort((a, b) => b.price - a.price);
    //    console.log("real sorted data", sortedData);
    //    setData(sortedData);
    //  } else if (type === "low to high") {
    //    let sortedData = data.sort((a, b) => a.price - b.price);
    //    setData(sortedData);
    //    console.log("data sorted", sortedData);
    //  }
    const list = metaData.map((data, idx) => (
      <TableRow key={idx} component={Paper} className={classes.tableRow}>
        {data.hash && (
          <TableCell className={classes.tableRowPadding} align="center">
            {data.hash.substring(0, 10) + "..."}
          </TableCell>
        )}
        <TableCell className={classes.tableRowPadding} align="center">
          {"Transfer"}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.blockNumber}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {(Date.now() - new Date(formatDate(data.timestamp)).getTime())
            .toString()
            .toHHMMSS()}
        </TableCell>
        {data.from && (
          <TableCell className={classes.tableRowPadding} align="center">
            {data.from.substring(0, 10) + "..."}
          </TableCell>
        )}
        {data.to && (
          <TableCell className={classes.tableRowPadding} align="center">
            {data.to.substring(0, 10) + "..."}
          </TableCell>
        )}
        <TableCell className={classes.tableRowPadding} align="center">
          {parseFloat(data.value) / 1000000000000000000}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {parseFloat(data.gasPrice) / 1000000000000}
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  // const sortArray = (type) => {
  //   if (data.length === 0)
  //     return (
  //       <TableRow component={Paper} className={classes.infoDataRow}>
  //         <TableCell className={classes.tableRow} colSpan={7} align="center">
  //           <CircularProgress />
  //         </TableCell>
  //       </TableRow>
  //     );
  //   else if (transactionsError)
  //     return (
  //       <TableRow component={Paper} className={classes.infoDataRow}>
  //         <TableCell className={classes.tableRow} colSpan={6} align="center">
  //           {transactionsErrorMsg}
  //         </TableCell>
  //       </TableRow>
  //     );
  //   console.log("real data", data);
  //   let listToBeShown =
  //     type === "high to low"
  //       ? data.sort((a, b) => b.price - a.price)
  //       : data.sort((a, b) => a.price - b.price);
  //   console.log("sorted data", data);
  //   const list = listToBeShown.map((data, count) => (
  //     <TableRow key={data.id} component={Paper} className={classes.tableRow}>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {formatDate(data.datetime)}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {data.side.toUpperCase()}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {exchange === "binance"
  //           ? data.price
  //           : exchange === "swyftx"
  //           ? data.side === "deposit" || "withdrawal"
  //             ? data.amount
  //             : parseFloat(data.price).toFixed(6)
  //           : data.method
  //           ? ""
  //           : parseFloat(data.price).toFixed(6)}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {/* {switch(exchange){
  //           case 'Binance':
  //             `${data.amount} ${da}`
  //         }}
  //          */}
  //         {data.method
  //           ? exchange === "binance"
  //             ? `${data.amount} ${data.info.symbol}`
  //             : exchange === "coinspot"
  //             ? `${data.amount}`
  //             : `${data.amount}`
  //           : renderTrade(data)}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {(data.fee.cost = "2" ? data.fee.cost : "")}{" "}
  //         {exchange === "swyftx"
  //           ? data.side === "buy"
  //             ? data.symbol.split("/")[0]
  //             : data.symbol.split("/")[1]
  //           : data.fee.currency}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {exchange === "coinspot"
  //           ? data.amount
  //           : data.cost === 0
  //           ? ""
  //           : data.side === "buy"
  //           ? `${(data.amount - data.fee.cost).toFixed(4)} ${
  //               exchange === "swyftx"
  //                 ? data.side === "buy"
  //                   ? data.symbol.split("/")[0]
  //                   : data.symbol.split("/")[1]
  //                 : exchange === "coinspot"
  //                 ? data.symbol.split("/")[0]
  //                 : data.fee.currency
  //             }`
  //           : `${(data.cost - data.fee.cost).toFixed(4)} ${data.fee.currency}`}
  //       </TableCell>
  //       <TableCell className={classes.tableRowPadding} align="center">
  //         {data.CGT}
  //       </TableCell>
  //     </TableRow>
  //   ));
  //   return list;
  // };
  return (
    <div>
      <div className={classes.pageHeading}>
        {exchange === "swyftx" ? (
          stackingHistory ? (
            <h1>Stacking History {"(" + setSwytx.length + ")"} </h1>
          ) : (
            <h1>Transactions {"(" + data.length + ")"} </h1>
          )
        ) : (
          <h1>Transactions {"(" + data.length + ")"} </h1>
        )}

        {exchange === "metamask" ? (
          <button onClick={() => activateBrowserWallet()}>Refresh</button>
        ) : exchange === "swyftx" ? (
          <Button variant="outlined" onClick={() => handelStackingHistory()}>
            {stackingHistory ? "back" : "Stacking History"}
          </Button>
        ) : (
          ""
        )}
      </div>

      <div className={classes.dateHeading}>
        {data.length > 0 ? (
          `From ${formatDate(data[0].timestamp)} ${"  "} To ${formatDate(
            data.at(-1).timestamp
          )}`
        ) : (
          <p> </p>
        )}
      </div>
      <FormControl>
        <input
          aria-describedby="my-helper-text"
          type="file"
          multiple
          accept="text/csv"
          className="customBtn"
          onChange={(e) => {
            handelCSV(e.target.files[0]);
          }}
        />
        <FormHelperText id="my-helper-text">Import CSV</FormHelperText>
      </FormControl>
      {/* <div>
        <InputLabel>Filter by price</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
          onChange={(e) => sortArray(e.target.value)}
        >
          <MenuItem value="high to low">high to low(price)</MenuItem>
          <MenuItem value="low to high">low to high(price)</MenuItem>
          <MenuItem value="date revirse">date revirse</MenuItem>
        </Select>
      </div> */}
      {exchange === "metamask" ? (
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead component={Paper}>
                <TableRow className={classes.tableHeading}>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    TxnHash
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Method
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Block
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Age
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    From
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    To
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Value
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    TxnFee
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderMetamask()}</TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </div>
      ) : exchange === "swyftx" ? (
        stackingHistory ? (
          <div className={classes.tableContainer}>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead component={Paper}>
                  <TableRow className={classes.tableHeading}>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Asset
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Asset Id
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      swyftxValue
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderStackingHistory()}</TableBody>
                <TableFooter></TableFooter>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className={classes.tableContainer}>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead component={Paper}>
                  <TableRow className={classes.tableHeading}>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Trade
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Fee{" "}
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Balance
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPadding}
                      // className={classes.tableRow}
                      align="center"
                    >
                      Gain/Loss
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderSwyftx()}</TableBody>
                <TableFooter></TableFooter>
              </Table>
            </TableContainer>
          </div>
        )
      ) : (
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead component={Paper}>
                <TableRow className={classes.tableHeading}>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Time
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Type
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Trade
                  </TableCell>

                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Fee{" "}
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Balance
                  </TableCell>
                  <TableCell
                    className={classes.tableRowPadding}
                    // className={classes.tableRow}
                    align="center"
                  >
                    Gain/Loss
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTransactions(data)}</TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default withStyles(styles)(TransactionsTable);
// obj={
//   price='asc',
//   time:''
// }
