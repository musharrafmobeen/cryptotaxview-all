import {
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState, useRef } from "react";
import styles from "../../resources/styles/helpers-styles/NavBarStyles";
import ctvNavLogo from "../../resources/design-images/CTV-Monogram.svg";
import { Outlet } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { NotificationIcon } from "../../resources/design-icons/nav-icons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UserProfileListItem from "./UserProfileListItem";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
import { changePlan } from "../../store/auth/auth";
import { ROLES } from "../../services/rolesVerifyingService";

function NavBar(props) {
  const { classes } = props;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [alterPlanShow, setAlterPlaneShow] = useState(false);

  const signedInUser = useSelector((state) => state.auth.user);
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);

  const path = window.location.pathname.split("/");

  const ref = useRef(null);
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleSignOut = (e) => {
    localStorage.clear("token");
    window.location.href = "/";
  };
  const handelProfile = () => {
    navigate("/profile");
    dispatch(changeSubNavBar(""));
  };
  const accountSettings = () => {
    navigate("/account_settings");
  };

  const navigate = useNavigate();

  const pageSubNavBar = useSelector(
    (state) => state.ui.pageSubNavBar.selection
  );

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    if (isPersonalPlan) {
      localStorage.setItem("navRoute", newValue);

      dispatch(changeSubNavBar(newValue));
      navigate(`/${newValue}`);
    } else {
      const route =
        newValue + "/" + path[path.length - 2] + "/" + path[path.length - 1];
      localStorage.setItem("navRoute", route);
      dispatch(changeSubNavBar(newValue));
      navigate(route);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      toggleAlterPlane(false);
    }
  };

  const toggleAlterPlane = (val) => {
    setAlterPlaneShow(val);
  };

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  return (
    <div>
      {/* <AppBar elevation={0}> */}
      <Grid container className={classes.toolBar}>
        <Grid item xs={1}>
          <div className={classes.logoContainer}>
            <img src={ctvNavLogo} alt="Logo" />
          </div>
        </Grid>
        <Grid
          container
          display={"row"}
          justifyContent={"start"}
          alignItems={"center"}
          xs={2}
        >
          <div className={classes.planContainer}>
            <div
              className={classes.currentPlan}
              onClick={() => {
                toggleAlterPlane(!alterPlanShow);
              }}
              ref={ref}
            >
              {isPersonalPlan ? "Personal" : "Professional"}

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
              onClick={() => {
                // if (signedInUser.role.shortCode === "PFLU") {
                dispatch(changePlan());
                localStorage.setItem("plan", !isPersonalPlan);
                dispatch(changeSubNavBar("home"));
                navigate("/home");
                localStorage.setItem("navRoute", "home");
                // }
              }}
            >
              {!isPersonalPlan
                ? "Personal"
                : // : signedInUser.role.shortCode === "PU" ||
                  //   signedInUser.role.shortCode === "CU" ||
                  //   signedInUser.role.shortCode === "PUX"
                  // ? "Activate Professional"
                  "Professional"}
              {/* <LockIcon className={classes.LockIcon} /> */}
            </div>
          </div>
        </Grid>

        <Grid
          container
          item
          xs={6}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {(isPersonalPlan ||
            (path[path.length - 1] !== "home" &&
              path[path.length - 1] !== "pricing-and-plan")) &&
          signedInUser.role.shortCode !== "SAU" ? (
            <div className={classes.navTabContainer}>
              <Tabs
                value={pageSubNavBar}
                onChange={handleChange}
                aria-label="Nav Bar"
              >
                {isPersonalPlan ? (
                  <Tab
                    className={`${
                      pageSubNavBar === "home"
                        ? classes.navItemActive
                        : classes.navItem
                    }`}
                    value="home"
                    label="Home"
                  />
                ) : (
                  <Tab
                    className={`${
                      pageSubNavBar === "holdings"
                        ? classes.navItemActive
                        : classes.navItem
                    }`}
                    value="holdings"
                    label="Holdings"
                  />
                )}

                <Tab
                  className={`${
                    pageSubNavBar === "integrations"
                      ? classes.navItemActive
                      : classes.navItem
                  }`}
                  value="integrations"
                  label="Integrations"
                />
                <Tab
                  className={`${
                    pageSubNavBar === "transactions"
                      ? classes.navItemActive
                      : classes.navItem
                  }`}
                  value="transactions"
                  label="Transactions"
                />
                <Tab
                  className={`${
                    pageSubNavBar === "reports"
                      ? classes.navItemActive
                      : classes.navItem
                  }`}
                  value="reports"
                  label="Reports"
                />
              </Tabs>
            </div>
          ) : (
            <></>
          )}
        </Grid>
        {/* <Grid
            container
            xs={1}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            className={classes.navSection}
          ></Grid> */}
        <Grid
          container
          xs={2}
          direction="row"
          alignItems="center"
          className={classes.navSection}
        >
          <div className={classes.otherIconButtonsContainer}>
            <div
              className={classes.planButton}
              // onClick={() => {
              //   if (isPersonalPlan) navigate("/pricing-and-plan");
              //   else
              //     navigate(
              //       `/pricing-and-plan/${
              //         window.location.href.split("/")[
              //           window.location.href.split("/").length - 2
              //         ]
              //       }/${
              //         window.location.href.split("/")[
              //           window.location.href.split("/").length - 1
              //         ]
              //       }`
              //     );
              //   dispatch(changeSubNavBar(""));
              // }}
            >
              <button className={classes.btnActiveProfessional}>
                {signedInUser.role.shortCode === ROLES.PAID_PROFESSIONAL_USER ||
                signedInUser.role.shortCode === ROLES.PAID_PERSONAL_USER
                  ? "Advanced Plan"
                  : "Free Plan"}
              </button>
            </div>
            {/* <div className={classes.helpIcon}>
              <HelpOutlineIcon />
            </div>
            <div className={classes.notificationIcon}>
              <NotificationIcon />
            </div> */}
          </div>
        </Grid>
        <Grid
          item
          container
          xs={1}
          direction="row"
          // justifyContent="fend"
          // alignItems="center"
          className={classes.navSection}
        >
          <div className={classes.userNavBarContainer}>
            <Divider variant="fullWidth" orientation="vertical" />

            <div className={classes.rowDiv} onClick={openMenu}>
              <p className={classes.userFirstName}>
                {signedInUser.profile?.firstName}
              </p>
              <div className={classes.userDropDownIcon}>
                {Boolean(menuAnchor) ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* </AppBar> */}
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
            name={signedInUser.profile?.firstName}
            email={signedInUser.email}
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handelProfile}>
          <ListItemText primary="My Profile" />
          {/* <Tooltip title="Profile not completed" placement="bottom">
            <WarningIcon />
          </Tooltip> */}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText
            primary="Pricing & Plan"
            onClick={() => {
              navigate("/pricing-and-plan");
              dispatch(changeSubNavBar(""));
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText primary="Account Settings" onClick={accountSettings} />
        </MenuItem>
        <Divider />
        <MenuItem className={classes.signOutBtn} onClick={handleSignOut}>
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
