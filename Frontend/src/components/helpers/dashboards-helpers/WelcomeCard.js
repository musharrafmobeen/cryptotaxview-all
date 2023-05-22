import { Paper, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../resources/styles/helpers-styles/dashboard-cards/WelcomeCardStyles";

import { useNavigate } from "react-router-dom";
import { changeSubNavBar } from "../../../store/ui/pageSubNavBar";
import IntegrationsIcon from "../../../resources/design-icons/welcome-card-icons/connect.svg";
import TransactionsIcon from "../../../resources/design-icons/welcome-card-icons/transaction.svg";
import ReportsIcon from "../../../resources/design-icons/welcome-card-icons/report.svg";

function WelcomeCard(props) {
  const user = useSelector((state) => state.auth.user);
  const { classes } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigate = (route) => () => {
    navigate(`/${route}`);
    dispatch(changeSubNavBar(route));
  };
  return (
    <Paper className={classes.welcomeCardPaper} elevation={0}>
      <div className={classes.logoContainer}></div>
      <div className={classes.welcomeTextContainer}>
        <div>
          <div className={classes.textHeadingRow}>
            <Typography className={`${classes.heading} ${classes.coloredText}`}>
              Welcome,&nbsp;
            </Typography>
            <Typography className={classes.heading}>
              {" "}
              <span className={classes.capitalize}>
                {user.profile?.firstName}
              </span>
            </Typography>
          </div>
          <div>
            <Typography>
              &nbsp;you're almost ready with personal account.
            </Typography>
          </div>
        </div>
        <div>
          <div className={classes.actionTextContainer}>
            <img src={IntegrationsIcon} alt={"integrations-icon"} />
            <Typography>
              <span
                className={classes.linkedText}
                onClick={handleNavigate("integrations")}
              >
                Connect
              </span>{" "}
              Exchanges, Wallets and Blockchains
            </Typography>
          </div>
          <div className={classes.actionTextContainer}>
            <img src={TransactionsIcon} alt={"transactions-icon"} />
            <Typography>
              Review your{" "}
              <span
                className={classes.linkedText}
                onClick={handleNavigate("transactions")}
              >
                Transactions
              </span>
            </Typography>
          </div>
          <div className={classes.actionTextContainer}>
            <img src={ReportsIcon} alt={"reports-icon"} />
            <Typography>
              Generate and Download{" "}
              <span
                className={classes.linkedText}
                onClick={handleNavigate("reports")}
              >
                Report
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(WelcomeCard);
