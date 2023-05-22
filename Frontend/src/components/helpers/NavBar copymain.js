import {
  AppBar,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import styles from "../../resources/styles/helpers-styles/NavBarStyles";
import ctvNavLogo from "../../resources/forms/ctvNavLogo.svg";
import { Outlet } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationIcon from "../../resources/design-icons/nav-icons/NotificationIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";

function NavBar(props) {
  const { classes } = props;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const signedInUser = useSelector((state) => state.auth.user);

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleSignOut = (e) => {
    localStorage.clear("token");
    window.location.href = "/";
  };

  return (
    <div>
      <AppBar elevation={0}>
        <Grid container spacing={1} className={classes.toolBar}>
          <Grid item xs={2}>
            <img
              src={ctvNavLogo}
              alt="Crypto Tax View"
              className={classes.ctvNavLogo}
            />
          </Grid>
          <Grid
            container
            item
            xs={8}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={1} className={classes.navItem}>
              <div>Personal</div>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={2}
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            className={classes.navSection}
          >
            <HelpOutlineIcon />
            <NotificationIcon />
            <Divider variant="fullWidth" orientation="vertical" />
            <div className={classes.rowDiv} onClick={openMenu}>
              <p className={classes.capitalize}>{`${
                signedInUser.profile ? signedInUser.profile.firstName : ""
              }`}</p>
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
        {signedInUser.profile ? (
          <MenuItem>
            <ListItemIcon></ListItemIcon>
            <ListItemText
              className={classes.capitalize}
              primary={`${signedInUser.profile.firstName}`}
            />
          </MenuItem>
        ) : (
          <></>
        )}
        <MenuItem>
          <ListItemText primary="My Profile" />
          <ListItemIcon></ListItemIcon>
        </MenuItem>
        <MenuItem>
          <ListItemText primary="Pricing & Plan" />
        </MenuItem>
        <MenuItem>
          <ListItemText primary="Account Settings" />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleSignOut(e);
          }}
          className={classes.signOutBtn}
        >
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
