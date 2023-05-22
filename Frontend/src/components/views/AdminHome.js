// import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../resources/styles/views-styles/AdminHomeStyles";

function AdminHome(props) {
  const { classes } = props;
  const navigate = useNavigate();
  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <h1>Admin Page</h1>
      </div>
      <div className={classes.actionItems}>
        <div
          className={classes.actionItem}
          onClick={(e) => {
            navigate("/admin-csv-master-crud");
          }}
        >
          <h2>Admin CSV Master CRUD</h2>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(AdminHome);
