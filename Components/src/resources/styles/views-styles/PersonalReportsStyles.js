
const column = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const row = {
    display: "flex",
    justifyContent: "space-between",
};

const formInput = {
    border: `1px solid #7F92A3`,
    borderRadius: "4px",
    padding: "10px 5px",
    width: "75%",
    boxSizing: "border-box"
};

const button = {
    border: "none",
    padding: "10px 25px",
    borderRadius: "4px",
    fontWeight: "bold",
    "&:hover": {
        cursor: "pointer",
    },
};

const styles = theme => ({
    root: {
        width: "96%",
        margin: "0 auto",
    },
    paper: {
        ...column,
        // alignItems: "felx-start",
        padding: "5px",
        margin: "20px auto",
        "& *": {
            marginTop: "5px",
            marginBottom: "5px",
        },
    },
    paperHead: {
        ...row,
        width: "100%",
        alignItems: "center",
    },
    paperHeading: {
        margin: "0",
        padding: "0"
    },
    paperForm: {
        ...row,
        border: "1px solid #C2CFD9",
        borderRadius: "4px"
    },
    formColumn: {
        ...column,
        width: "50%",
        margin: "auto 10px",
    },
    formControl: {
        ...row,
        width: "100%",
        alignItems: "center",
    },
    label: {
        fontWeight: "bold",
    },
    select: {
        ...formInput,
    },
    input: {
        ...formInput,
    },
    radioInput: {
        ...formInput,
        ...row,
        border: "none",
        justifyContent: "flex-start",
        alignItems: "center",
        "& *": {
            margin: "auto 5px"
        },
    },
    grow: {
        flexGrow: "1"
    },
    btnGenerate: {
        ...button,
        backgroundColor: "#134675",
        color: "white"
    },
    controlsRow:{
        ...row,
        "& *":{
            margin:"auto 5px"
        },
    },
    btnDownload: {
        ...button,
        ...row,
        padding:"5px 10px",
        alignItems: "center",
        backgroundColor: "transparent",
        border: "1px solid #0074CB",
        color: "#0074CB",
    },
    btnDelete: {
        ...button,
        ...row,
        padding:"5px 10px",
        alignItems: "center",
        backgroundColor: "transparent",
        border: "1px solid #DE5858",
        color: "#DE5858",
    },

    search: {
        position: "relative",
        marginLeft: 0,
        width: "100%",
        backgroundColor:"#D7E0E7",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing.unit,
            width: "auto"
        },
        borderRadius: "4px",
    },
    searchIcon: {
        width: theme.spacing(4),
        height: "100%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:"#C2CFD9",
    },
    inputRoot: {
        color: "inherit",
        width: "100%"
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: `${theme.spacing(5)} !important`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 120,
            "&:focus": {
                width: 200
            }
        }
    },

});

export default styles;