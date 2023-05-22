import { Checkbox, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import styles from '../../resources/styles/helpers-styles/ReportFileCardStyles';
import thumbnail from "./../../resources/design-images/file-icon-image.svg"
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ReportFileCard(props) {
    const { classes } = props;
    const {
        reportName,
        reportDate,
        handleCheck
    } = props;
    return (
        <div className={classes.cardRoot}>
            <Checkbox />
            <div className={classes.infoRow}>
                <img src={thumbnail} alt='Report thumbnail' />
                <div className={classes.textColumn}>
                    <p className={classes.reportTitle}>{reportName}</p>
                    <p className={classes.reportDate}>{reportDate}</p>
                </div>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default withStyles(styles)(ReportFileCard);