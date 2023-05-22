import { Divider, InputBase, Paper } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styles from '../../resources/styles/views-styles/PersonalReportsStyles';
import ReportFileCard from '../helpers/ReportFileCard';
import SearchIcon from '@mui/icons-material/Search';
import { DownloadIcon, DeleteIcon } from "./../../resources/design-icons/reports-page-icons"

function PersoanlReports(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <div className={classes.paperHead}>
                    <h3 className={classes.paperHeading}>Generate Tax Report</h3>
                </div>
                <Divider />
                <div className={classes.paperForm}>
                    <div className={classes.formColumn}>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Financial Year</label>
                            <select className={classes.select}>
                                <option value={null}>Select Financial Year</option>
                            </select>
                        </div>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Method</label>
                            <select className={classes.select}>
                                <option value={null}>Select Method</option>
                            </select>
                        </div>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Report Name</label>
                            <input
                                className={classes.input}
                                type="text"
                            />
                        </div>
                    </div>
                    <div className={classes.formColumn}>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Report Type</label>
                            <div className={classes.radioInput}>
                                <div>
                                    <input type="radio" id='investor1' name="report-type" value="investor1" />
                                    <label htmlFor='investor1'>Investor</label>
                                </div>
                                <div>
                                    <input type="radio" id='investor2' name="report-type" value="investor2" />
                                    <label htmlFor='investor2'>Investor</label>
                                </div>
                            </div>
                        </div>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Exchange</label>
                            <select className={classes.select}>
                                <option value={null}>Select Exchange</option>
                            </select>
                        </div>
                        <div className={classes.formControl}>
                            <div className={classes.grow} />
                            <button className={classes.btnGenerate}>Generate Report</button>
                        </div>
                    </div>
                </div>
            </Paper>
            <Paper className={classes.paper} elevation={0}>
                <div className={classes.paperHead}>
                    <h3 className={classes.paperHeading}>Reports Log</h3>
                    <div className={classes.controlsRow}>
                        <button className={classes.btnDownload}><DownloadIcon />Download</button>
                        <button className={classes.btnDelete}><DeleteIcon />Delete</button>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search..."
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Divider />
                <div className={classes.paperForm}>
                    <ReportFileCard
                        reportName={"Report Name"}
                        reportDate={"June 30, 2021"}
                        handleCheck={() => { }}
                    />
                </div>
            </Paper>
        </div>
    );
}

export default withStyles(styles)(PersoanlReports);