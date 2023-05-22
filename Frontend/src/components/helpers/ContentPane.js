import { withStyles } from "@mui/styles";
import React from "react";
import styles from "./../../resources/styles/helpers-styles/ContentPaneStyles";
import ctv_monogram_grey from "./../../resources/design-images/ctv-monogram-grey.svg";

function ContentPane(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <div className={classes.childPropContainer}>{props.children}</div>
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          <span>
            <img src={ctv_monogram_grey} alt="ctv-logo" />
          </span>
          <span className={classes.linkItem}>Updates</span>
          <span className={classes.linkItem}>Contact</span>
          <span className={classes.linkItem}>Help & Support</span>
        </div>
        <p className={classes.linkItemLast}>
          Copyright &copy; {new Date().getFullYear()} CryptoTaxView
        </p>
      </div>
    </div>
  );
}

export default withStyles(styles)(ContentPane);
