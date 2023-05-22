import styles from "../../resources/styles/helpers-styles/BigButtonCardStyles";
import { withStyles, makeStyles } from "@mui/styles";
import { getBigButtonIcon } from "../../services/importDynamicIcons";
function BigButtonCard(props) {
  const {
    icon,
    backgroundColor,
    backgroundColorHover,
    headerText,
    headerTextColor,
    bodyText,
    bodyTextColor,
    handleClick,
  } = props;

  const dynamicStyles = makeStyles({
    container: {
      backgroundColor: backgroundColor,
      borderRadius: "5px",
      color: "white",
      height: "100%",
      // width: "350px",
      padding: "0px 25px 0px 25px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: "15px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: backgroundColorHover,
      },
    },
    headerText: {
      fontFamily: "Roboto",
      fontWeight: "900",
      fontSize: "35px",
      color: headerTextColor,
    },
    bodyText: {
      fontFamily: "Roboto",
      fontWeight: "500",
      fontSize: "20px",
      color: bodyTextColor,
    },
  });

  const { classes } = props;
  const dynamicClasses = dynamicStyles();

  return (
    <div className={dynamicClasses.container} onClick={() => handleClick()}>
      <div className={classes.iconContainer}>
        <img src={getBigButtonIcon(icon)} alt={icon} />
      </div>
      <div className={classes.contentContainer}>
        <div className={dynamicClasses.headerText}>{headerText}</div>
        <div className={dynamicClasses.bodyText}>{bodyText}</div>
      </div>
    </div>
  );
}
export default withStyles(styles)(BigButtonCard);
