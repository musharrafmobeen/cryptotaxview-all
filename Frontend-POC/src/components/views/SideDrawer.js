import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Paper,
  Avatar,
  Switch,
  Drawer,
  AppBar,
  Toolbar,
  Tooltip,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  Hidden,
  Menu,
  MenuItem,
  Backdrop,
  CircularProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { LocalAtm } from "@material-ui/icons";

import logo_closed from "./../../resources/design-images/cryptax-logo.svg";
import logo_full from "./../../resources/design-images/Cryptax-logo-text.svg";
import SearchIcon from "@material-ui/icons/Search";

import {
  TransactionsIcon,
  WalletsIcon,
  PortfolioIcon,
  CapitalGainsIcon,
} from "./../../resources/design-icons";

import styles from "../../styles/viewsStyles/SideDrawerStyles";
import { DrawerWidthContext } from "../../contexts/DrawerWidthContext";

import { InputBase } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { drawerSelectionChanged } from "../../store/ui/drawer";
import { currencySelectionChanged } from "../../store/ui/exchanges";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

function SideDrawer(props) {
  const { classes } = props;

  const dispatch = useDispatch();
  const selection = useSelector((state) => state.ui.drawer.selection);
  const currencyType = useSelector((state) => state.ui.currency.selection);

  useEffect(() => {
    dispatch(currencySelectionChanged("binance"));
  }, []);

  const theme = useTheme();

  const { isCollapsed, changeDrawerWidth } = useContext(DrawerWidthContext);

  const iconColor = "#788497";
  const appBgColor = "#2B406A"; //"#45a62d";//"#674FFF";

  const handleDrawerOpen = () => {
    changeDrawerWidth();
  };

  const handleDrawerClose = () => {
    changeDrawerWidth();
  };
  const handleCurrencyTypeChange = (e) => {
    dispatch(currencySelectionChanged(e.target.value));
  };
  return (
    <>
      {/* {Object.keys(currentUser).length === 0 ? returnToHome() : ""} */}
      {/* {userRole !== 'Admin' && <Redirect to="/" />} */}
      {/* <Backdrop
                className={classes.backdrop} open={isLoading}
            >
                <CircularProgress color="inherit" thickness={4.9} />
            </Backdrop> */}
      <div className={classes.root}>
        <CssBaseline />
        <div
          className={
            !isCollapsed
              ? classes.drawerIconButtonHolderCollapsed
              : classes.drawerIconButtonHolderOpen
          }
        >
          <div>
            {!isCollapsed ? (
              <IconButton
                onClick={handleDrawerOpen}
                className={classes.drawerIconButton}
              >
                <ChevronRightIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleDrawerClose}
                className={classes.drawerIconButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
          </div>
        </div>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isCollapsed,
            [classes.drawerClose]: !isCollapsed,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isCollapsed,
              [classes.drawerClose]: !isCollapsed,
            }),
          }}
        >
          {!isCollapsed ? (
            <img src={logo_closed} className={classes.drawerLogo} />
          ) : (
            <img src={logo_full} className={classes.drawerLogo} />
          )}
          <Divider />
          <List>
            <Tooltip title="Transactions">
              <ListItem
                button
                key={"Transactions"}
                onClick={() => {
                  props.history.push("/transactions");
                }}
                style={
                  selection === "Transactions"
                    ? { backgroundColor: appBgColor, color: "white" }
                    : {}
                }
              >
                <ListItemIcon>
                  <TransactionsIcon
                    style={
                      selection === "Transactions"
                        ? { color: "white" }
                        : { color: iconColor }
                    }
                  />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Orders">
              <ListItem
                button
                key={"Orders"}
                onClick={() => {
                  props.history.push("/orders");
                }}
                style={
                  selection === "Orders"
                    ? { backgroundColor: appBgColor, color: "white" }
                    : {}
                }
              >
                <ListItemIcon>
                  <CapitalGainsIcon
                    style={
                      selection === "Orders"
                        ? { color: "white" }
                        : { color: iconColor }
                    }
                  />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Deposit/Withdraw">
              <ListItem
                button
                key={"Deposit/Withdrawl"}
                onClick={() => {
                  props.history.push("/deposit-withdrawl");
                }}
                style={
                  selection === "deposit-withdrawl"
                    ? { backgroundColor: appBgColor, color: "white" }
                    : {}
                }
              >
                <ListItemIcon>
                  <LocalAtm
                    style={
                      selection === "deposit-withdrawl"
                        ? { color: "white" }
                        : { color: iconColor }
                    }
                  />
                </ListItemIcon>
                <ListItemText primary="Deposit/Withdrawal" />
              </ListItem>
            </Tooltip>
            <Tooltip title="Wallet">
              <ListItem
                button
                key={"Wallet"}
                onClick={() => {
                  props.history.push("/wallets");
                }}
                style={
                  selection === "Wallet"
                    ? { backgroundColor: appBgColor, color: "white" }
                    : {}
                }
              >
                <ListItemIcon>
                  <PortfolioIcon
                    style={
                      selection === "Wallet"
                        ? { color: "white" }
                        : { color: iconColor }
                    }
                  />
                </ListItemIcon>
                <ListItemText primary="Holdings" />
              </ListItem>
            </Tooltip>
          </List>
        </Drawer>
        <main className={classes.content}>
          <Paper style={{ margin: "10px", borderRadius: "10px" }}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                color: "black",
              }}
            >
              <Toolbar>
                <div>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Exchange</FormLabel>
                    <RadioGroup
                      aria-label="Exchange"
                      name="currencyType"
                      value={currencyType}
                      onChange={handleCurrencyTypeChange}
                      row={true}
                      className={classes.radioGroup}
                    >
                      <div className={classes.radioButton}>
                        <FormControlLabel
                          value="binance"
                          control={<Radio />}
                          label="Binance"
                        />
                      </div>
                      <div className={classes.radioButton}>
                        <FormControlLabel
                          value="swyftx"
                          control={<Radio />}
                          label="Swyftx"
                        />
                      </div>
                      <div className={classes.radioButton}>
                        {window.location.pathname === "/orders" ? (
                          ""
                        ) : (
                          <FormControlLabel
                            value="coinbase"
                            control={<Radio />}
                            label="Coinbase"
                          />
                        )}
                      </div>
                      <div className={classes.radioButton}>
                        <FormControlLabel
                          value="coinspot"
                          control={<Radio />}
                          label="Coinspot"
                        />
                      </div>
                      <div className={classes.radioButton}>
                        {window.location.pathname === "/orders" ? (
                          ""
                        ) : window.location.pathname ===
                          "/deposit-withdrawl" ? (
                          ""
                        ) : window.location.pathname === "/wallets" ? (
                          ""
                        ) : (
                          <FormControlLabel
                            value="metamask"
                            control={<Radio />}
                            label="Metamask"
                          />
                        )}
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
                {/* <div>
                  <h4>Import csv</h4>
                </div> */}
                <div className={classes.grow} />
                <div className={classes.userMenuIcon}></div>
              </Toolbar>
            </AppBar>
          </Paper>
        </main>
      </div>
    </>
  );
}

export default withRouter(withStyles(styles)(SideDrawer));
