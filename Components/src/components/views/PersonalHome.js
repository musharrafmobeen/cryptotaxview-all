import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../resources/styles/views-styles/PersonalHomeStyles";
import HoldingsTable from "../helpers/HoldingsTable";
import ctv_logo from "../../resources/design-images/ctv-logo-cropped.svg";
import {
  WalletIcon,
  ReviewIcon,
  ReportIcon,
} from "./../../resources/design-icons/welcome-card-icons";
import TabPanelCard from "../helpers/TabPanelCard";
import WelcomeCard from "./../helpers/dashboards-helpers/WelcomeCard"
import ReportTabsCard from "./../helpers/dashboards-helpers/ReportTabsCard"

function PersonalHome(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <div className={classes.cardsColumn}>
        <div className={classes.welcomeCard}>
          <WelcomeCard />
        </div>
        <div className={classes.reportsTabCard}>
          <ReportTabsCard />
        </div>
      </div>
      <div className={classes.tableContainer}>
        <HoldingsTable />
      </div>
    </div>
  );
}

export default withStyles(styles)(PersonalHome);
