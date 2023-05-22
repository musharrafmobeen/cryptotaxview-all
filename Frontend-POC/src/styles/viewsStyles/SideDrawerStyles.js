import { fade } from "@material-ui/core/styles/colorManipulator";

const drawerWidth = 240;
const styles = theme => ({
    root: {
        display: 'flex',
        backgroundColor: theme.palette.main,
    },
    appBar: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerIconButtonHolderOpen: {
        position: "fixed",
        left: `${drawerWidth - 10}px`,
        marginTop: '8px',
        zIndex: theme.zIndex.drawer + 3,
        backgroundColor: "white",
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        borderRadius: "8px",
    },
    drawerIconButtonHolderCollapsed: {
        position: "fixed",
        left: theme.spacing(7) + 1 - 10,
        [theme.breakpoints.up('sm')]: {
            left: theme.spacing(9) + 1 - 10,
        },
        marginTop: '8px',
        zIndex: theme.zIndex.drawer + 3,
        backgroundColor: "white",
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        borderRadius: "8px",
    },
    drawerIconButton: {
        borderRadius: "8px",
        backgroundColor: "white",
        width: "20px",
        boxShadow: `2px 1px 5px 1px #ccc`,
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        borderRadius: "5px",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "auto",
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    grow: {
        flexGrow: 1,
    },
    search: {
        position: "relative",
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing.unit,
            width: "auto"
        },
        border: `0.5px solid gray`,
        borderRadius: "10px",
    },
    searchIcon: {
        width: theme.spacing(9),
        height: "100%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit",
        width: "100%"
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing(10),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 120,
            "&:focus": {
                width: 200
            }
        }
    },
    userMenu: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: "2px",
        margin: "2px",
        backgroundColor: "white",
        width: "15%",
    },
    userMenuIcon: {
        marginLeft: "5px",
        marginRight: "5px",
        padding: "1px",
    },
    languageIcon: {
        marginLeft: "5px",
        marginright: "5px",
        maxWidth: "20px",
        minWidth: "25px",
        "&>img": {
            borderRadius: "50%",
            maxWidth: "100%",
            maxHeight: "100%"
        },
    },
    userAvatar: {
        marginLeft: "5px",
        marginright: "5px",
        maxWidth: "25px",
        minWidth: "25px",
        "&>img": {
            border: `1px solid #674FFF`,
            borderRadius: "50%",
            maxWidth: "100%",
            maxHeight: "100%"
        },
    },
    bottomBar: {
        display: "none",
        [theme.breakpoints.down("sm")]: {
            display: "block",
            position: "fixed",
            bottom: "0%",
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: "95"
        },
    },
    hideOnSM: {
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    bottomBarIcons: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "auto",
        margin: "auto",

    },
    drawerLogo:{
        padding:"1em",
    },

});

export default styles;