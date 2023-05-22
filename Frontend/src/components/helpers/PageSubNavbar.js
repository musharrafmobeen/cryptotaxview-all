import { AppBar, Box, Button, Tab, Tabs, Toolbar } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../../resources/styles/helpers-styles/PageSubNavbarStyles";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";

function PageSubNavbar(props) {
  const { classes } = props;
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const pageSubNavBar = useSelector(
    (state) => state.ui.pageSubNavBar.selection
  );

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    localStorage.setItem("navRoute", newValue);
    setValue(newValue);
    dispatch(changeSubNavBar(newValue));
    navigate(`/${newValue}`);
  };

  return (
    <div className={classes.root}>
      <AppBar color="transparent" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          {/* <div className={classes.linksContainer}>
            <div style={{backgroundColor:"red",display:"inherit",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              <a className={classes.link}>Home</a>
            </div>
            <div>
              <a className={classes.link}>Integrations</a>
            </div>
            <div>
              <a className={classes.link}>Transactions</a>
            </div>
            <div>
              <a className={classes.link}>Reports</a>
            </div>
          </div> */}
          {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}
          <Box>
            <Tabs
              value={pageSubNavBar}
              onChange={handleChange}
              aria-label="Sub Nav Bar"
            >
              <Tab className={classes.tabCustom} value="home" label="Home" />
              <Tab
                className={classes.tabCustom}
                value="integrations"
                label="Integrations"
              />
              <Tab
                className={classes.tabCustom}
                value="transactions"
                label="Transactions"
              />
              <Tab
                className={classes.tabCustom}
                value="reports"
                label="Reports"
              />
            </Tabs>
          </Box>
          <div>
            <Button className={classes.navBtn}>
              Activate Professional License
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.outletChildRenderer}>{props.children}</div>
    </div>
  );
}

export default withStyles(styles)(PageSubNavbar);
