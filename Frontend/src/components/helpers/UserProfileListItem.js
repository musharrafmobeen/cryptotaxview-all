import { Avatar, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import styles from "../../resources/styles/helpers-styles/UserProfileListIemStyles";

function UserProfileListItem(props) {
  const { classes } = props;
  const { image, name, email } = props;
  return (
    <div className={classes.root}>
      <Avatar
        src={image}
        alt={name}
        className={classes.avatar}
        sx={{ width: 60, height: 60 }}
      />
      <div className={classes.textInfo}>
        <Typography className={classes.userName} component="h3" variant="h5">
          {name}
        </Typography>
        <Typography className={classes.userEmail} component="p" variant="body2">
          {email}
        </Typography>
      </div>
    </div>
  );
}

export default withStyles(styles)(UserProfileListItem);
