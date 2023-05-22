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
          <a>
            <img src={ctv_monogram_grey} alt="ctv-logo" />
          </a>
          <a className={classes.linkItem}>Updates</a>
          <a className={classes.linkItem}>Contact</a>
          <a className={classes.linkItem}>Help & Support</a>
        </div>
        <p className={classes.linkItemLast}>
          Copyright &copy; {new Date().getFullYear()} CryptoTaxView
        </p>
      </div>
    </div>
  );
}

export default withStyles(styles)(ContentPane);
