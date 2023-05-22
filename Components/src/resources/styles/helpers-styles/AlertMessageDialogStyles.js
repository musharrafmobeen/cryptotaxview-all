const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const button = {
    fontWeight: "bold !important",
};

const styles = theme => ({
    dialogTitle: {
        ...row,
    },
    rowDiv: {
        ...row,
        "& *": {
            margin: "auto 5px",
        },
        width: "fit-content",
    },
    backArrow: {
        // padding: "4px",
        "&:hover": {
            cursor: "pointer",
            //   backgroundColor: "grey",
            //   borderRadius: "50%",
        },
    },
    dialogHeading: {
        padding: "0",
        margin: "0",
        color:"#DE5858"
    },
    dialogCloseIcon: {
        color: "#DE5858",
        "&:hover": {
            cursor: "pointer",
        },
    },
    dialogContent:{
        fontWeight:"bold !important",
    },
    btnCancel: {
        ...button,
        backgroundColor: "#DE5858 !important",
        color: "white !important"
    },
    btnYes: {
        ...button,
        backgroundColor: "#092C4C !important",
        color: "white !important"
    },
});

export default styles;