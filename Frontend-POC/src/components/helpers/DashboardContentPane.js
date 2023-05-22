import { withStyles } from '@material-ui/core';
import React, {useContext} from 'react';
import { DrawerWidthContext } from '../../contexts/DrawerWidthContext';
import styles from '../../styles/helpersStyles/DashboardContentPaneStyles';
function DashboardContentPane(props) {
    const {classes} = props;
    const {isCollapsed} = useContext(DrawerWidthContext);
    return (
        <div className={!isCollapsed ? classes.contentStretch: classes.contentShrink}>
            {props.children}
        </div>
    );
}

export default withStyles(styles)(DashboardContentPane);