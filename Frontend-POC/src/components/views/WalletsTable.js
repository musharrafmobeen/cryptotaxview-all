import {
  Backdrop,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { drawerSelectionChanged } from "../../store/ui/drawer";
import styles from "../../styles/viewsStyles/TransactionsTableStyles";
import { Link, withRouter } from "react-router-dom";
import { Visibility } from "@material-ui/icons";
import { loadWallets } from "../../store/wallets/wallets";
import { RefreshIcon } from "../../resources/design-icons";
import { formatAmount, getCurrencyIcon } from "./../../utils/utilities";
import configData from "./.././../config.json";
import axios from "axios"; //saqib

function WalletsTable(props) {
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const exchange = useSelector((state) => state.ui.currency.selection);
  const { classes } = props;

  useEffect(() => {
    setData([]);
  }, [exchange]);
  const baseUrl = configData.url.baseURL;
  useEffect(() => {
    if (exchange === "binance") {
      let one = axios.get(`${baseUrl}/exchanges/binanceAccountSnapShot/MARGIN`);
      let two = axios.get(`${baseUrl}/exchanges/account`);
      axios.all([one, two]).then(
        axios.spread((...res) => {
          let res1 = res[0];
          let res2 = res[1];
          let filteredData1 = res1.data.snapshotVos[0].data.userAssets;
          let filteredData2 = res2.data.info.balances.filter(
            (data) => data.free > 0 || data.locked > 0
          );
          filteredData2.map((d) => filteredData1.push(d));
          setData(filteredData1);
          console.log("Dataddd", filteredData1);
        })
      );
    } else if (exchange === "coinbase") {
      setData([]);
      axios.get(`${baseUrl}/exchanges/coinbase-accounts`).then((res) => {
        let filteredData = res.data.info.balances;

        setData(filteredData);
        setDataCount(data.length);
      });
    } else if (exchange === "swyftx") {
      setData([]);
      axios.get(`${baseUrl}/swyftx/account`).then((res) => {
        let filteredData = res.data.info.balances.filter(
          (data) => data.free > 0 || data.locked > 0
        );
        setData(filteredData);
        setDataCount(data.length);
      });
    } else if (exchange === "coinspot") {
      setData([]);
      axios.get(`${baseUrl}/exchanges/coinspot-account`).then((res) => {
        let filteredData = res.data.info.balances.filter(
          (data) => data.free > 0 || data.locked > 0
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
    dispatch(drawerSelectionChanged("Wallet"));
    if (exchange === "binance") {
      let one = axios.get(`${baseUrl}/exchanges/binanceAccountSnapShot/MARGIN`);
      let two = axios.get(`${baseUrl}/exchanges/account`);
      axios.all([one, two]).then(
        axios.spread((...res) => {
          let res1 = res[0];
          let res2 = res[1];
          let filteredData1 = res1.data.snapshotVos[0].data.userAssets.filter(
            (data) => data.free > 0 || data.locked > 0
          );
          let filteredData2 = res2.data.info.balances.filter(
            (data) => data.free > 0 || data.locked > 0
          );
          filteredData2.map((d) => filteredData1.push(d));
          setData(filteredData1);
          console.log("binanacedata", filteredData1);
        })
      );
    } else if (exchange === "swyftx") {
      axios.get(`${baseUrl}/swyftx/account`).then((res) => {
        let filteredData = res.data.info.balances.filter(
          (data) => data.free > 0 || data.locked > 0
        );
        console.log("swyftxdata", filteredData);
        setData(filteredData);
        setDataCount(data.length);
      });
    } else if (exchange === "coinbase") {
      axios.get(`${baseUrl}/exchanges/coinbase-accounts`).then((res) => {
        console.log("coinbase", res);
        let filteredData = res.data.info.balances;
        setData(filteredData);
        setDataCount(data.length);
      });
    } else if (exchange === "coinspot") {
      setData([]);
      axios.get(`${baseUrl}/exchanges/coinspot-account`).then((res) => {
        console.log("coinspot", res);
        let filteredData = res.data.info.balances.filter(
          (data) => data.free > 0 || data.locked > 0
        );
        setData(filteredData);
        setDataCount(data.length);
      });
    } else {
      setData([]);
    }
  }, []);

  const dispatch = useDispatch();
  const wallets = useSelector((state) => state.entities.wallets.list);
  const walletsLoading = useSelector((state) => state.entities.wallets.loading);
  const walletsError = useSelector((state) => state.entities.wallets.isError);
  const walletsErrorMsg = useSelector(
    (state) => state.entities.wallets.errorMessage
  );

  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // const refreshData = () => {
  //   if (!walletsLoading) dispatch(loadWallets());
  //   axios.get("http://192.168.18.15:5000/exchanges/account")
  //   .then((res)=>{
  //     console.log(res.json)
  //   })
  // };

  const renderWallets = () => {
    console.log("bihco", data);
    if (data.length === 0)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell colSpan={6} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    else if (walletsError)
      return (
        <TableRow component={Paper} className={classes.infoDataRow}>
          <TableCell
            colSpan={6}
            align="center"
            className={classes.textInfoCell}
          >
            {walletsErrorMsg}
          </TableCell>
        </TableRow>
      );

    const list = data.map((wallet, count) => (
      <TableRow key={data.id} component={Paper}>
        <TableCell align="center">{wallet.asset}</TableCell>
        <TableCell align="center">{parseFloat(wallet.free)}</TableCell>
        <TableCell align="center">{parseFloat(wallet.locked)}</TableCell>
        <TableCell align="center">
          {parseFloat(wallet.currentPrice ? wallet.currentPrice : 0)}
        </TableCell>
      </TableRow>
    ));

    return list;
  };

  return (
    <div>
      <div className={classes.pageHeading}>
        <h1>Holdings {"(" + data.length + ")"}</h1>
      </div>

      <div className={classes.tableContainer}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead component={Paper}>
              <TableRow className={classes.tableHeading}>
                <TableCell align="center">Assets</TableCell>
                <TableCell align="center">Free</TableCell>
                <TableCell align="center">Locked</TableCell>
                <TableCell align="center">Current Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderWallets()}</TableBody>
          </Table>
        </TableContainer>
      </div>
      {data.timestamp}
    </div>
  );
}

export default withStyles(styles)(WalletsTable);
