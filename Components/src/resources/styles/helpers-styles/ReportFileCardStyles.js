
const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItmes: "center",
};

const column = {
    ...row,
    flexDirection: "column"
};

const styles = theme => ({
    cardRoot: {
        ...row,
        "& *":{
            margin:"auto 3px"
        },
    },
    infoRow: {
        ...row,
    },
    textColumn: {
        ...column,
        height:"25px"
    },
    reportTitle:{

    },
    reportDate:{
        fontSize:"small",
        color:"#7F92A3",
        alignSelf:"flex-start"
    },
});

export default styles;