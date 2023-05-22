import { Paper, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../../resources/styles/helpers-styles/dashboard-cards/WelcomeCardStyles";
import {
  WalletIcon,
  ReportIcon,
  ReviewIcon,
} from "./../../../resources/design-icons/welcome-card-icons";

function WelcomeCard(props) {
  const { classes } = props;
  return (
    <Paper className={classes.welcomeCardPaper} elevation={0}>
      <div className={classes.logoContainer}></div>
      <div className={classes.welcomeTextContainer}>
        <div>
          <div className={classes.textHeadingRow}>
            <Typography className={`${classes.heading} ${classes.coloredText}`}>
              Welcome,&nbsp;
            </Typography>
            <Typography className={classes.heading}> Amelia!</Typography>
          </div>
          <div>
            <Typography>
              &nbsp;you're almost ready with personal account.
            </Typography>
          </div>
        </div>
        <div>
          <div className={classes.actionTextContainer}>
            <WalletIcon />
            <Typography>
              <a className={classes.linkedText}>Connect</a> Exchanges, Wallets
              and Blockchains
            </Typography>
          </div>
          <div className={classes.actionTextContainer}>
            <ReviewIcon />
            <Typography>
              Review your <a className={classes.linkedText}>Transactions</a>
            </Typography>
          </div>
          <div className={classes.actionTextContainer}>
            <ReportIcon />
            <Typography>
              Generate and Download <a className={classes.linkedText}>Report</a>
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(WelcomeCard);
