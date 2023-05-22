const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const formInput = {
    border: `1px solid #7F92A3`,
    borderRadius: "4px",
    padding: "10px 5px",
    width: "100%",
    boxSizing: "border-box"
};

const button = {
    border: "none",
    padding: "0",
    padding: "10px 25px",
    borderRadius: "4px",
    fontWeight: "bold",
    "&:hover": {
        cursor: "pointer",
    },
};

const styles = (theme) => ({
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
        color: "#092C4C"
    },
    closeBtn: {
        color: "#DE5858",
        "&:hover": {
            cursor: "pointer",
        },
    },
    formControl: {
        ...row,
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        '& *': {
            marginTop: "5px",
            marginBottom: "5px",
        },
    },
    formLabel: {
        fontWeight: "bold",
        // fontSize: "1.30vw"
    },
    formSelect: {
        ...formInput,
        padding: "10px 5px",
    },
    formInput: {
        ...formInput,
    },
    formButtonsContainer: {
        ...row,
        width: "100%",
        justifyContent: "flex-end",
        margin:"10px auto",
        "& *": {
            margin: "auto 10px"
        },
    },
    btnCancel: {
        ...button,
        backgroundColor: "#DE5858",
        color: "white"
    },
    btnSubmit: {
        ...button,
        backgroundColor: "#092C4C",
        color: "white"
    },
});

export default styles;
