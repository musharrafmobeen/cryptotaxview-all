import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  FormHelperText,
  TableCell,
  FormControl,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  RadioGroup,
  withStyles,
  Button,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { drawerSelectionChanged } from "../../store/ui/drawer";
import configData from "./.././../config.json";
import styles from "../../styles/viewsStyles/TransactionsTableStyles";

import { ArrowForward } from "@material-ui/icons";

import { formatDate } from "../../utils/utilities";

import axios from "axios";
import { saveAs } from "file-saver";

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
function TransactionsTable(props) {
  const { classes } = props;
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [orderType, setOrderType] = useState("closed");
  const [csvFile, setCsvFile] = useState();

  const handleOrderType = (e) => {
    setOrderType(e.target.value);
  };
  const baseUrl = configData.url.baseURL;
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
  useEffect(() => {}, [orderType]);

  const dispatch = useDispatch();
  let exchange = useSelector((state) => state.ui.currency.selection);

  useEffect(() => {
    setData([]);
  }, [exchange]);

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

  const importCSV = () => {
    <input aria-describedby="my-helper-text" type="file" multiple />;
  };
  const downloadReport = () => {
    if (exchange === "binance") {
      axios
        .get(`${baseUrl}/exchanges/binance-excel`, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          let todayDate = new Date();
          link.setAttribute(
            "download",
            "Report Binance " +
              todayDate.getDate() +
              "-" +
              (todayDate.getMonth() + 1) +
              "-" +
              todayDate.getFullYear() +
              ".xlsx"
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
    } else {
      if (exchange === "swyftx") {
        axios
          .get(`${baseUrl}/swyftx/swyftx-excel`, {
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            let todayDate = new Date();
            link.setAttribute(
              "download",
              "Report Swyftx " +
                todayDate.getDate() +
                "-" +
                (todayDate.getMonth() + 1) +
                "-" +
                todayDate.getFullYear() +
                ".xlsx"
            ); //or any other extension
            document.body.appendChild(link);
            link.click();
          });
      }
    }
  };

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
      axios.get(`${baseUrl}/exchanges/orders`).then((res) => {
        setData(res.data.flat());
        setDataCount(data.length);
      });
    } else if (exchange === "swyftx") {
      axios.get(`${baseUrl}/swyftx/orders-file`).then((res) => {
        setData(res.data.flat());
        setDataCount(data.length);
      });
    } else if (exchange === "coinspot") {
      axios.get(`${baseUrl}/exchanges/coinspot-orders`).then((res) => {
        setData(res.data.flat());
        setDataCount(data.length);
      });
    } else {
      axios.get(`${baseUrl}/exchanges/orders`).then((res) => {
        setData(res.data.flat());
        setDataCount(data.length);
      });
    }
  }, [exchange]);

  useEffect(() => {}, [data]);

  useEffect(() => {
    dispatch(drawerSelectionChanged("Orders"));
    if (exchange === "binance") {
      axios.get(`${baseUrl}/exchanges/orders`).then((res) => {
        // console.log(res.data.flat())
        setData(res.data.flat());
        setDataCount(data.length);
      });
    } else if (exchange === "swyftx") {
      axios.get(`${baseUrl}/swyftx/orders-file`).then((res) => {
        // console.log(res.data.flat())
        setData(res.data.flat());
        setDataCount(data.length);
      });
    } else if (exchange === "coinspot") {
      axios.get(`${baseUrl}/exchanges/coinspot-orders`);
    } else {
      exchange = "binance";
      axios.get(`${baseUrl}/exchanges/orders`).then((res) => {
        // console.log(res.data.flat())
        setData(res.data.flat());
        setDataCount(data.length);
      });
    }
  }, []);

  const renderTrade = (data) => {
    // if(Object.keys(data).contains())
    let symbol = data.symbol.split("/");
    if (data.side === "buy") {
      return (
        <div>
          <div>
            {data.cost} {symbol[1]} <ArrowForward />{" "}
            {`${data.amount}
            ${symbol[0]}`}
          </div>
          <div>
            {data.price} AUD/{symbol[0]}
          </div>
          <div>{}</div>
        </div>
      );
    } else if (data.side === "Buy") {
      return (
        <div>
          <div>
            {data.cost} {symbol[1]} <ArrowForward />{" "}
            {`${data.amount} ${symbol[0]}`}
          </div>
          <div>
            {data.exchangeRate} {symbol[1]}{" "}
            {/* {`${data.exchangeRate.toFixed(4)} ${symbol[0]}`} */}
          </div>
          <div>{}</div>
        </div>
      );
    } else if (data.side === "Sell") {
      return (
        <div>
          <div>
            {data.amount} {symbol[0]} <ArrowForward />{" "}
            {`${data.cost + data.fee.cost} ${symbol[1]}`}
          </div>
          <div>
            {" "}
            {data.cost} {symbol[1]} {`${data.exchangeRate} ${symbol[0]}`}
          </div>
          <div>{}</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            {data.amount} {symbol[0]} <ArrowForward />{" "}
            {`${data.cost} ${symbol[1]}`}
          </div>
          <div>
            {data.price} AUD/{symbol[0]}
          </div>
          <div>{}</div>
        </div>
      );
    }
  };

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

    let listToBeShown = data;

    const list = listToBeShown.map((data, count) => (
      <TableRow key={data.id} component={Paper}>
        <TableCell className={classes.tableRowPadding} align="center">
          {formatDate(data.datetime)}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.side?.toUpperCase()}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data?.symbol ? renderTrade(data) : <div>{data.symbol}</div>}
        </TableCell>

        <TableCell className={classes.tableRowPadding} align="center">
          {data.fee?.cost} {data.symbol.split("/")[1]}
        </TableCell>
        <TableCell className={classes.tableRowPadding} align="center">
          {data.side === "Sell"
            ? data.cost
            : data.side === "Buy"
            ? data.Amount
            : data.side === "buy"
            ? data.amount
            : data.cost}
        </TableCell>
      </TableRow>
    ));

    return list;
  };

  return (
    <div>
      <div className={classes.pageHeading}>
        <h1>Orders {"(" + data.length + ")"} </h1>
        <RadioGroup
          aria-label="Order Type"
          name="orderType"
          value={orderType}
          onChange={handleOrderType}
          row={true}
          className={classes.radioGroup}
        ></RadioGroup>
        {exchange === "coinspot" ? (
          <></>
        ) : (
          <Button className={classes.selectedButton} onClick={downloadReport}>
            Download Report
          </Button>
        )}
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
      </div>

      <div className={classes.dateHeading}>
        {console.log("ccc", data)}
        {data.length > 0 ? (
          `From ${formatDate(data[0].timestamp)} ${"  "} To ${formatDate(
            data.at(-1).timestamp
          )}`
        ) : (
          <p> </p>
        )}
      </div>

      <div className={classes.tableContainer}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead component={Paper}>
              <TableRow className={classes.tableHeading}>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Trade</TableCell>
                <TableCell align="center">Fee </TableCell>
                <TableCell align="center">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTransactions()}</TableBody>
            <TableFooter></TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default withStyles(styles)(TransactionsTable);
