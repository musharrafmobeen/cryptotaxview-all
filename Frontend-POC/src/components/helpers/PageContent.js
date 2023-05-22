import { useTheme } from '@material-ui/core';
import React from 'react';
function PageContent(props) {
    const bgColor = props.bgColor;
    const theme = useTheme();
    const styles = {
        backgroundColor:bgColor?bgColor:`${theme.mainBgColor}`,
        minHeight:"99vh",
        height: "100%",
        width: "100%",
    }
    return (
        <div style={styles}>
            {/* {console.log(theme)}
            {console.log(isDarkMode)} */}
            {props.children}
        </div>
    );
}

export default PageContent;