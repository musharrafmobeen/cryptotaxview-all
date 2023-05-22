import {
  AppBar,
  Button,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import styles from "./../../resources/styles/helpers-styles/NavBarStyles";
import ctvNavLogo from "./../../resources/design-images/CTV-Monogram.svg";
import { Outlet } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  NotificationIcon,
  LockIcon,
  WarningIcon,
} from "./../../resources/design-icons/nav-icons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UserProfileListItem from "./UserProfileListItem";

function NavBar(props) {
  const { classes } = props;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [alterPlanShow, setAlterPlaneShow] = useState(false);

  const toggleAlterPlane = () => {
    setAlterPlaneShow(!alterPlanShow);
  };

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  return (
    <div>
      <AppBar elevation={0}>
        <Grid container spacing={1} className={classes.toolBar}>
          <Grid
            xs={2}
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={1} sx={{ paddingLeft: "14%" }}>
              <div className={classes.logoContainer}>
                <img src={ctvNavLogo} />
              </div>
            </Grid>
            <Grid item xs={1}>
              <div className={classes.planContainer}>
                <div className={classes.currentPlan} onClick={toggleAlterPlane}>
                  Personal{" "}
                  {alterPlanShow ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </div>
                <div
                  className={`${classes.alterPlan} ${classes.lockedPlan} ${
                    alterPlanShow ? "" : classes.hidden
                  }`}
                >
                  Professional <LockIcon />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={7}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={1} className={classes.navItem}>
              <div>Home</div>
            </Grid>
            <Grid item xs={2} className={classes.navItem}>
              <div>Integrations</div>
            </Grid>
            <Grid item xs={2} className={classes.navItem}>
              <div>Transactions</div>
            </Grid>
            <Grid
              item
              xs={1}
              className={`${classes.navItem} ${classes.active}`}
            >
              <div>Reports</div>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={3}
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            className={classes.navSection}
          >
            <button className={classes.btnActiveProfessional}>
              Activate Professional
            </button>
            <HelpOutlineIcon />
            <NotificationIcon />
            <Divider variant="fullWidth" orientation="vertical" />
            <div className={classes.rowDiv} onClick={openMenu}>
              <p>Name</p>
              {Boolean(menuAnchor) ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </div>
          </Grid>
        </Grid>
      </AppBar>
      <Outlet />
      <Menu
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        <MenuItem>
          <UserProfileListItem
            image={"src"}
            name={"Name"}
            email={"user.email@mail.com"}
          />
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText primary="My Profile" />
          <Tooltip title="Profile not completed" placement="bottom">
            <WarningIcon />
          </Tooltip>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText primary="Pricing & Plan" />
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText primary="Account Settings" />
        </MenuItem>
        <Divider />
        <MenuItem className={classes.signOutBtn}>
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary="Signout" />
        </MenuItem>
      </Menu>
    </div>
  );
}

export default withStyles(styles)(NavBar);
