import {
  // Backdrop,
  // Breadcrumbs,
  // Button,
  CircularProgress,
  // IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  // TablePagination,
  TableRow,
  // Tooltip,
  // Typography,
  withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { drawerSelectionChanged } from "../../store/ui/drawer";
import { currencySelectionChanged } from "../../store/ui/exchanges";
import styles from "../../styles/viewsStyles/TransactionsTableStyles";
import configData from "./.././../config.json";
// import { Link, withRouter } from "react-router-dom";
// import { Visibility } from "@material-ui/icons";
// import { loadTransactions } from "../../store/transactions/transactions";
// import { RefreshIcon } from "./../../resources/design-icons";
import {
  formatDate,
  // formatAmount,
  // getCurrencyIcon,
} from "./../../utils/utilities";
// import coinbaseLogo from "../../resources/design-images/coinbase.svg";
// import binanceLogo from "../../resources/design-images/binance.svg";
import axios from "axios";

function TransactionsTable(props) {
  const { classes } = props;
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [swyftxData, setSwytxData] = useState([]);

  const dispatch = useDispatch();
  const exchange = useSelector((state) => state.ui.currency.selection);

  useEffect(() => {}, [exchange]);
  useEffect(() => {
    dispatch(currencySelectionChanged("binance"));
  }, []);
  const baseUrl = configData.url.baseURL;
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
  useEffect(() => {
    if (exchange === "binance") {
      setData([]);
      axios.get(`${baseUrl}/exchanges/depositWithdrawalHistory`).then((res) => {
        let filteredData = res.data.data;
        setData(filteredData);
      });
    } else if (exchange === "swyftx") {
      setData([]);
      axios.get(`${baseUrl}/swyftx`).then((res) => {
        console.log("Res", res.data.flat());
        let filteredData = res.data.flat();
        filteredData = filteredData.filter(
          (data) => data.side === "deposit" || data.side === "withdrawl"
        );
        setSwytxData(filteredData);
        setDataCount(swyftxData.length);
      });
    } else if (exchange === "coinspot") {
      setData([]);
      let one = axios.get(`${baseUrl}/exchanges/coinspot-deposits`);
      let two = axios.get(`${baseUrl}/exchanges/coinspot-widthdrawals`);
      axios.all([one, two]).then(
        axios.spread((...res) => {
          let res1 = res[0];
          let res2 = res[1];
          let filteredData1 = res1.data.deposits;
          let filteredData2 = res2.data.withdrawals;
          filteredData1.map((d) => {
            return filteredData2.push(d);
          });
          setData(filteredData2);
          setDataCount(data.length);
        })
      );
    } else if (exchange === "coinbase") {
      setData([]);
      axios.get(`${baseUrl}/exchanges/coinbase-deposits`).then((res) => {
        let filteredData = res.data.flat();
        filteredData = filteredData.filter(
          (data) => data.side === "deposit" || data.side === "withdrawl"
        );
        setData(filteredData);
        setDataCount(data.length);
      });
    } else {
      setData([]);
    }
  }, [exchange]);
  useEffect(() => {}, [data]);
  useEffect(() => {
    setData([]);
    dispatch(drawerSelectionChanged("deposit-withdrawl"));
    axios.get(`${baseUrl}/exchanges/binance-trades`).then((res) => {
      let filteredData = res.data.flat();
      filteredData = filteredData.filter(
        (data) => data.side === "deposit" || data.side === "withdrawl"
      );
      setData(filteredData);
      setDataCount(data.length);
    });
  }, []);
  console.log("exchange", exchange);
  console.log("data", data);
  const renderTransactions = () => {
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell colSpan={6} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    else if (transactionsError)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell colSpan={6} align="center">
            {transactionsErrorMsg}
          </TableCell>
        </TableRow>
      );
    console.log("vvv", data);
    console.log("vvffffv", swyftxData);
    // let listToBeShown = data.sort((a, b) =>
    //   b.datetime.localeCompare(a.datetime)
    // );

    const list =
      swyftxData.length <= 0 ? (
        <TableRow component={Paper}></TableRow>
      ) : (
        swyftxData.map((data, count) => (
          <TableRow key={count} component={Paper}>
            <TableCell align="center">{formatDate(data.datetime)}</TableCell>
            <TableCell align="center">{data.info.symbol}</TableCell>
            <TableCell align="center">{data.side.toUpperCase()}</TableCell>
            <TableCell align="center">{data.amount.toFixed(4)}</TableCell>
            <TableCell align="center">{data.fee.cost}</TableCell>
            <TableCell align="center">
              {(data.amount.toFixed(4) - data.fee.cost).toFixed(4)}
            </TableCell>
          </TableRow>
        ))
      );

    return list;
  };

  const renderBinanceData = () => {
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell colSpan={6} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );

    const list = data.map((data, count) => (
      <TableRow key={count} component={Paper}>
        <TableCell align="center">{formatDate(data.updateTime)}</TableCell>
        <TableCell align="center">{data.fiatCurrency}</TableCell>
        <TableCell align="center">{data.method}</TableCell>
        <TableCell align="center">{data.amount}</TableCell>
        <TableCell align="center">{data.totalFee}</TableCell>
        <TableCell align="center">{data.orderNo}</TableCell>
      </TableRow>
    ));
    return list;
  };

  const renderCoinspotData = () => {
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell colSpan={6} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    const list = data.map((data, count) => (
      <TableRow key={count} component={Paper}>
        <TableCell align="center">{formatDate(data.timestamp)}</TableCell>
        <TableCell align="center">{data.status}</TableCell>
        <TableCell align="center">{data.type}</TableCell>
        <TableCell align="center">AUD</TableCell>
        <TableCell align="center">{data.amount}</TableCell>
      </TableRow>
    ));
    return list;
  };

  return (
    <div>
      <div className={classes.pageHeading}>
        <h1>
          Deposit/Withdrawal{" "}
          {"(" +
            `${exchange === "swyftx" ? swyftxData.length : data.length}` +
            ")"}{" "}
        </h1>
      </div>
      {exchange === "swyftx" ? (
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead component={Paper}>
                <TableRow className={classes.tableHeading}>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">Symbol</TableCell>
                  <TableCell align="center">Withdraw/ Deposit</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Fee </TableCell>
                  <TableCell align="center">Total Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTransactions()}</TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </div>
      ) : exchange === "binance" ? (
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead component={Paper}>
                <TableRow className={classes.tableHeading}>
                  <TableCell align="center">Time </TableCell>
                  <TableCell align="center">Fiat Currency</TableCell>
                  <TableCell align="center">Method</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Fee </TableCell>
                  <TableCell align="center">Order No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderBinanceData()}</TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </div>
      ) : exchange === "coinspot" ? (
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead component={Paper}>
                <TableRow className={classes.tableHeading}>
                  <TableCell align="center">Time </TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center"> Fiat Currency</TableCell>
                  <TableCell align="center">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderCoinspotData()}</TableBody>
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
                  <TableCell align="center">Time </TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Amount</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>{renderCoinspotData()}</TableBody> */}
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default withStyles(styles)(TransactionsTable);
