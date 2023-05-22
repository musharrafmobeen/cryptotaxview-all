import {
  Grid,
  Tab,
  Tabs,
  Button,
  Divider,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";

import { useState } from "react";
import { withStyles } from "@mui/styles";
import styles from "../../resources/styles/helpers-styles/TransactionSubComponentStyles";
import { roundNumberDecimal } from "../../services/roundNumberDecimal";
import { formatFullDate } from "../../services/date-formatter";
import { checkAllowedSide } from "../../services/getAllowedSides";
// import { calculateOpeningAndClosingBalance } from "../../services/calculateOpeningAndClosingBalance";
function TransactionSubComponent(props) {
  const [subNavBar, setSubNavBar] = useState("details");
  const { classes } = props;
  const { data } = props;
  const handleChange = (event, newValue) => {
    setSubNavBar(`${newValue}`);
  };
  const renderDetailRows = (label, value) => {
    return (
      <Grid item xs={4}>
        <div className={classes.rowDetailContainer}>
          <div className={classes.rowDetailLabel}>
            <p>{label}</p>
          </div>
          <div className={classes.rowDetailValue}>
            <p>{value}</p>
          </div>
        </div>
      </Grid>
    );
  };
  return (
    <Grid
      container
      xs={12}
      display={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      <Grid item xs={1} />
      <Grid item xs={4}>
        <Tabs value={subNavBar} onChange={handleChange} aria-label="Nav Bar">
          <Tab
            className={`${
              subNavBar === "details" ? classes.navItemActive : classes.navItem
            }`}
            value="details"
            label="Details"
          />
          <Tab
            className={`${
              subNavBar === "holdings" ? classes.navItemActive : classes.navItem
            }`}
            value="holdings"
            label="Holdings"
          />
          <Tab
            className={`${
              subNavBar === "calculation"
                ? classes.navItemActive
                : classes.navItem
            }`}
            value="calculation"
            label="Calculation"
          />
        </Tabs>
      </Grid>
      <Grid container display={"row"} justifyContent={"flex-end"} xl={5} xs={4}>
        <div className={classes.uuid}>#{data.id}</div>
      </Grid>
      <Grid item xl={1} xs={2}>
        <div className={classes.buttonGroup}>
          <Button className={classes.actionButton} disabled>
            Edit
          </Button>
          <Button className={classes.btnCancel} disabled>
            Delete
          </Button>
        </div>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {subNavBar === "calculation" ? (
        <Grid container xs={12}>
          <Grid item xs={1} />
          <Grid item xs={10} className={classes.mainContainer}>
            <TableContainer className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableRow
                  className={
                    data.isError
                      ? classes.tableHeadRowError
                      : classes.tableHeadRow
                  }
                >
                  <TableCell>Date</TableCell>
                  <TableCell>Pair</TableCell>
                  <TableCell>Side</TableCell>
                  <TableCell>Bought {data.symbol.split("/")[0]}</TableCell>
                  <TableCell>Available {data.symbol.split("/")[0]}</TableCell>
                  <TableCell>Cost Base Total (AUD)</TableCell>
                  <TableCell>Cost Base Available (AUD)</TableCell>
                  {/* <TableCell>View</TableCell> */}
                </TableRow>
                <TableBody>
                  {data.fifoRelatedTransactions.length ? (
                    data.fifoRelatedTransactions.map((trx) => {
                      return (
                        <TableRow className={classes.tableRow}>
                          <TableCell>{formatFullDate(trx.datetime)}</TableCell>
                          <TableCell>{trx.symbol}</TableCell>
                          <TableCell className={classes.capitalize}>
                            {trx.side}
                          </TableCell>
                          <TableCell>
                            {roundNumberDecimal(
                              checkAllowedSide(trx?.side) === 1
                                ? trx.amount
                                : trx.cost,
                              3
                            )}
                          </TableCell>
                          <TableCell>
                            {roundNumberDecimal(
                              checkAllowedSide(trx?.side) === 1
                                ? trx.availableBalance
                                : trx.cost,
                              3
                            )}
                          </TableCell>
                          <TableCell>
                            {roundNumberDecimal(trx.amount * trx.priceInAud, 2)}
                          </TableCell>
                          <TableCell>
                            {roundNumberDecimal(
                              checkAllowedSide(trx?.side) === 1
                                ? trx.availableBalance * trx.priceInAud
                                : ((trx.amount * trx.priceInAud) / trx.cost) *
                                    trx.availableBalance,
                              3
                            )}
                          </TableCell>

                          {/* <TableCell>
                            <VisibilityIcon />
                          </TableCell> */}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className={classes.tableRow}>
                      <TableCell colSpan={7} align="center">
                        No Related Transactions Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      ) : (
        <></>
      )}
      {subNavBar === "holdings" ? (
        <Grid xs={12} container>
          <Grid item xs={1} />
          <Grid container xs={10} className={classes.mainContainer}>
            <Grid item xs={12}>
              <p className={classes.holdingsHeading}>
                Every change in your asset balances due to this transaction is
                listed below.
              </p>
            </Grid>
            {renderDetailRows(
              "Asset",
              checkAllowedSide(data?.side) === 1
                ? data?.assetReceived
                : data?.assetTraded
            )}

            {Math.abs(data?.balance?.previousBalance) < 0.000001
              ? renderDetailRows("Opening Balance", 0)
              : renderDetailRows(
                  "Opening Balance",
                  roundNumberDecimal(data?.balance?.previousBalance, 3)
                )}
            {Math.abs(data?.balance?.currentBalance) < 0.000001
              ? renderDetailRows("Closing Balance", 0)
              : renderDetailRows(
                  "Closing Balance",
                  roundNumberDecimal(data?.balance?.currentBalance, 3)
                )}
            {data?.symbol.includes("/") ? (
              renderDetailRows(
                "Asset",
                checkAllowedSide(data?.side) === 2
                  ? data?.assetReceived
                  : data?.assetTraded
              )
            ) : (
              <></>
            )}
            {data?.symbol.includes("/") ? (
              renderDetailRows(
                "Opening Balance",
                roundNumberDecimal(data?.currentSoldCoinBalance, 3)
              )
            ) : (
              <></>
            )}

            {data?.symbol.includes("/") ? (
              renderDetailRows(
                "Closing Balance",
                `${
                  checkAllowedSide(data?.side) === 2
                    ? roundNumberDecimal(
                        data.currentSoldCoinBalance + data.cost,
                        3
                      )
                    : roundNumberDecimal(
                        data.currentSoldCoinBalance - data.cost,
                        3
                      )
                }`
              )
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={1} />
        </Grid>
      ) : (
        <></>
      )}
      {subNavBar === "details" ? (
        <Grid xs={12} container>
          <Grid item xs={1} />
          <Grid container xs={10} className={classes.mainContainer}>
            <Grid container xs={12}>
              <div className={classes.detailsHeadingContainer}>
                <h3>{data?.side}</h3>
                <p>{formatFullDate(data?.datetime)}</p>
              </div>
            </Grid>

            {renderDetailRows(
              "Fiat Value",
              `$ ${roundNumberDecimal(data?.priceInAud, 3)} per AUD`
            )}
            {renderDetailRows(
              "Fee",
              ` ${roundNumberDecimal(data?.fee?.cost, 3)} ${
                data?.fee?.currency
              }`
            )}
            {renderDetailRows("", null)}
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
}
export default withStyles(styles)(TransactionSubComponent);
