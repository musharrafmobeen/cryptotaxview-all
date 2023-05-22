const drawerWidth = 240;
const lightBgColor = "#E5E5E5";
const styles = theme => ({
    contentStretch:{
        backgroundColor: lightBgColor,
        minHeight: "90vh",
        width: `calc(100% - ${theme.spacing(7) + 1}px)`,
        marginLeft:theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.spacing(9) + 1}px)`,
            marginLeft:theme.spacing(9) + 1,
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
    },
    contentShrink:{
        backgroundColor: lightBgColor,
        minHeight: "90vh",
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft:drawerWidth,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
    },
});

export default styles;