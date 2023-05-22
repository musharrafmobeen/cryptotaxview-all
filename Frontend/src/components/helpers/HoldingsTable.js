import {
  Avatar,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect } from "react";
import styles from "../../resources/styles/helpers-styles/HoldingsTableStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  getBinanceHoldings,
  getCoinbaseHoldings,
  getSwyftxHoldings,
  getCoinspotHoldings,
  clearHoldingsData,
  getBinanceHoldingsProfessional,
  getCoinbaseHoldingsProfessional,
  getCoinspotHoldingsProfessional,
  getSwyftxHoldingsProfessional,
} from "../../store/holdings/holdings";
import { roundNumberDecimal } from "../../services/roundNumberDecimal";
import loadingImage from "../../resources/design-images/AJ_rocket.gif";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@material-ui/icons";

function HoldingsTable(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = props;
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const path = window.location.pathname.split("/");
  const renderHoldings = (data) => {
    const list = data.map((coin, idx) => (
      <TableRow key={idx} component={Paper} className={classes.dataRow}>
        <TableCell className={classes.capitalize}>{coin.exchange}</TableCell>
        <TableCell>
          {roundNumberDecimal(
            Number(coin.borrowed) + Number(coin.free) + Number(coin.locked),
            4
          )}{" "}
          {coin.asset}
        </TableCell>
        <TableCell>
          {coin.currentPrice !== 0 ? (
            roundNumberDecimal(Number(coin.currentPrice), 4) + " AUD"
          ) : (
            <i>N/A</i>
          )}
        </TableCell>
        <TableCell>
          {coin.currentPrice !== 0 ? (
            roundNumberDecimal(
              (Number(coin.borrowed) +
                Number(coin.free) +
                Number(coin.locked)) *
                coin.currentPrice,
              4
            ) + " AUD"
          ) : (
            <i>N/A</i>
          )}
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  // const [binanceData, setBinanceData] = useState([]);
  const holdingData = useSelector((state) => state.entities.holdings.data);

  useEffect(() => {
    dispatch(clearHoldingsData());
    if (isPersonalPlan) {
      dispatch(getBinanceHoldings());
      dispatch(getCoinbaseHoldings());
      dispatch(getCoinspotHoldings());
      dispatch(getSwyftxHoldings());
    } else {
      dispatch(getBinanceHoldingsProfessional(path[path.length - 1]));
      dispatch(getCoinbaseHoldingsProfessional(path[path.length - 1]));
      dispatch(getCoinspotHoldingsProfessional(path[path.length - 1]));
      dispatch(getSwyftxHoldingsProfessional(path[path.length - 1]));
    }
  }, []);

  const isLoading = useSelector((state) => state.entities.holdings.isLoading);
  //end of relative code to render holdings rows in table body.
  //**********************************************************************************

  return (
    <Paper className={classes.tableRoot} elevation={0}>
      {isPersonalPlan ? (
        <></>
      ) : (
        <div className={classes.paperHeadProfessionalContainer}>
          <div className={classes.content}>
            <div
              className={classes.homeBackBtn}
              onClick={() => {
                navigate("/home");
              }}
            >
              <ArrowBackIos />{" "}
              <div className={classes.homeBackBtnText}>Home</div>
            </div>
            <Divider orientation="vertical" flexItem />
          </div>
          <div className={classes.professionalProfile}>
            <Divider orientation="vertical" flexItem />
            <Avatar
              src={"image-url-here"}
              alt={
                window.location.pathname.split("/")[
                  window.location.pathname.split("/").length - 1
                ]
              }
            />
            <div className={classes.verticalContainer}>
              <div className={classes.firstName}>
                {
                  window.location.pathname.split("/")[
                    window.location.pathname.split("/").length - 2
                  ]
                }
              </div>
              <div className={classes.email}>
                {
                  window.location.pathname.split("/")[
                    window.location.pathname.split("/").length - 1
                  ]
                }
              </div>
            </div>
          </div>
        </div>
      )}
      {isPersonalPlan ? <></> : <Divider />}
      <div className={classes.pageHeaderRow}>
        <p className={classes.pageHeading}>Holdings</p>
        <div className={classes.sortSelector}>
          <p>Sort By</p>
          <select
            className={classes.sortSelect}
            value="all"
            disabled
            notched={false}
          >
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <div className={classes.tableContainer}>
        <TableContainer
          classes={{ root: classes.customTableContainer }}
          className={classes.tableContainer}
        >
          <Table stickyHeader>
            <TableHead className={classes.tableHead}>
              <TableRow className={classes.headerRow}>
                <TableCell>Exchange</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price (unit)</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {isLoading ? (
                <TableRow>
                  <TableCell colspan={4}>
                    <div className={classes.loadingImage}>
                      <img
                        width="100px"
                        height="100px"
                        src={loadingImage}
                        alt="Loading"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
              {holdingData.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colspan={4}>
                    <div className={classes.errorGettingHoldings}>
                      {
                        "Exchange is not integrated or holding are not available from exchanges!"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
              {holdingData.length ? renderHoldings(holdingData) : ""}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(HoldingsTable);
