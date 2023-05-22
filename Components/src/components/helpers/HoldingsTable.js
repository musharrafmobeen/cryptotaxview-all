import {
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import React from "react";
import styles from "../../resources/styles/helpers-styles/HoldingsTableStyles";

const dummyHoldingData = {
  currency: "Binance",
  quantity: 0.00978291,
  price: 601.7,
  value: 5.89,
};

const useStyles = makeStyles({
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
});

function HoldingsTable(props) {
  const { classes } = props;
  const customSelectClasses = useStyles();

  /**
   * Method and relative code to render Holdings data rows in table body.
   */
  const data = [
    { ...dummyHoldingData, id: 0 },
    { ...dummyHoldingData, id: 1 },
    { ...dummyHoldingData, id: 2 },
    { ...dummyHoldingData, id: 3 },
    { ...dummyHoldingData, id: 4 },
    { ...dummyHoldingData, id: 5 },
    { ...dummyHoldingData, id: 6 },
    { ...dummyHoldingData, id: 7 },
    { ...dummyHoldingData, id: 8 },
    { ...dummyHoldingData, id: 9 },
    { ...dummyHoldingData, id: 10 },
    { ...dummyHoldingData, id: 11 },
    { ...dummyHoldingData, id: 12 },
    { ...dummyHoldingData, id: 13 },
    { ...dummyHoldingData, id: 14 },
    { ...dummyHoldingData, id: 15 },
  ];

  //Method to render data rows.
  const renderHoldings = () => {
    const list = data.map((holding) => (
      <TableRow key={holding.id} component={Paper} className={classes.dataRow}>
        <TableCell>{holding.currency}</TableCell>
        <TableCell>{holding.quantity}</TableCell>
        <TableCell>${holding.price}</TableCell>
        <TableCell>${holding.value}</TableCell>
      </TableRow>
    ));
    return list;
  };

  //end of relative code to render holdings rows in table body.
  //**********************************************************************************

  return (
    <Paper className={classes.root} elevation={0}>
      <div className={classes.pageHeaderRow}>
        <h4 className={classes.pageHeading}>Holdings</h4>
        <div className={classes.sortSelector}>
          <p>Sort By</p>
          <select className={classes.sortSelect} value="all" notched={false}>
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
                <TableCell>Currency</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {renderHoldings()}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(HoldingsTable);
