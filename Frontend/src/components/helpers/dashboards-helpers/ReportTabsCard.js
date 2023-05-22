import { Paper, Tab, Tabs } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React from "react";
import styles from "../../../resources/styles/helpers-styles/dashboard-cards/ReportTabsCardStyles";
import TabPanelCard from "../TabPanelCard";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ReportTabsCard(props) {
  const { classes } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={0} className={classes.reportsTabRootPaper}>
      <Box sx={{ width: "100%", height: "15%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Report Log" {...a11yProps(0)} />
          <Tab label="Generate Report" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box sx={{ width: "100%", height: "85%" }}>
        <TabPanelCard value={value} index={0}>
          <div className={classes.reportsLogCard}>
            <input
              type={"text"}
              placeholder="Search Report..."
              className={classes.searchInput}
            />
            <Paper
              elevation={0}
              variant="outlined"
              className={classes.logCardPaper}
            >
              <div className={classes.noLogContainer}>
                <p className={classes.noLogText}>No Reports in Report Log</p>
                <button className={classes.btnGenerate}>Generate Report</button>
              </div>
            </Paper>
          </div>
        </TabPanelCard>
        <TabPanelCard value={value} index={1}>
          <div style={{ height: "100%" }}>
            <Paper
              variant="outlined"
              elevation={0}
              className={classes.formPaper}
            >
              <div className={classes.formControl}>
                <label className={classes.label}>Financial Year</label>
                <select className={classes.select}>
                  <option value={null}>Select Financial Year</option>
                </select>
              </div>
              <div className={classes.formControl}>
                <label className={classes.label}>Report Type</label>
                <div className={classes.radioInput}>
                  <div>
                    <input
                      type="radio"
                      id="investor1"
                      name="report-type"
                      value="investor1"
                    />
                    <label htmlFor="investor1">Investor</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="investor2"
                      name="report-type"
                      value="investor2"
                    />
                    <label htmlFor="investor2">Investor</label>
                  </div>
                </div>
              </div>
              <div className={classes.formControl}>
                <label className={classes.label}>Method</label>
                <select className={classes.select}>
                  <option value={null}>Select Method</option>
                </select>
              </div>
              <div className={classes.formControl}>
                <label className={classes.label}>Report Name</label>
                <input className={classes.input} type="text" />
              </div>
              <div className={classes.formControl}>
                <label className={classes.label}>Exchange</label>
                <select className={classes.select}>
                  <option value={null}>Select Exchange</option>
                </select>
              </div>
              <div className={classes.formControl}>
                <button className={classes.formBtnGenerate}>
                  Generate Report
                </button>
              </div>
            </Paper>
          </div>
        </TabPanelCard>
      </Box>
    </Paper>
  );
}

export default withStyles(styles)(ReportTabsCard);
