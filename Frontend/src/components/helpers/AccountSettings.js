import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Container,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import Select from "react-select";

import countryList from "react-select-country-list";
import React, { useState, useMemo } from "react";

import styles from "../../resources/styles/helpers-styles/ProfilePage";
import { withStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";

import { cgtCalculationMethods } from "../../services/cgtCalculationMethods";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import { curriences } from "../../services/currencies";
import { saveAccountSettings } from "../../store/auth/auth";
import { resetAccountSettingSave } from "../../store/auth/auth";

function AccountSettings(props) {
  const Country = useSelector((state) => state.auth.user.profile.country);
  const Method = useSelector((state) => state.auth.user.profile.cgtcalmethod);
  const TimeZone = useSelector((state) => state.auth.user.profile.timezone);
  const Currency = useSelector((state) => state.auth.user.profile.currency);
  const accountSettingSave = useSelector(
    (state) => state.auth.accountSettingSave
  );
  const isErrorAccountSettingSave = useSelector(
    (state) => state.auth.isErrorAccountSettingSave
  );
  const errorMessageAccountSettingSave = useSelector(
    (state) => state.auth.errorMessageAccountSettingSave
  );

  const { classes } = props;
  const dispatch = useDispatch();

  const [country, setCountry] = useState(Country);
  const [method, setMethod] = useState(Method);
  const [curriency, setCurriency] = useState(Currency);
  const options = useMemo(() => countryList().getData(), []);
  const profileId = useSelector((state) => state.auth.user.profile.id);
  const [selectedTimezone, setSelectedTimezone] = useState(TimeZone);

  countryList().setLabel("AM", "America");

  const changeCountry = (value) => {
    setCountry(value);
  };
  const changeMethod = (value) => {
    setMethod(value);
  };
  const changeCurriency = (value) => {
    setCurriency(value);
  };
  const arrKeys = Object.keys(allTimezones).filter((c) =>
    c.includes(country?.label)
  );
  const handelAccountSettingSaveClose = () => {
    dispatch(resetAccountSettingSave());
  };
  const obj = {};
  for (let i = 0; i < arrKeys.length; i++) {
    obj[arrKeys[i]] = allTimezones[arrKeys[i]];
  }
  // console.log("aim", obj);

  const handelSave = () => {
    dispatch(
      saveAccountSettings(
        country,
        selectedTimezone,
        curriency,
        method,
        profileId
      )
    );
  };

  return (
    <div className={classes.body}>
      <Container className={classes.container}>
        <Grid container sx={{ marginTop: "80px" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                width: {
                  xs: "85%",
                  sm: "65%",
                  md: "65%",
                  lg: "65%",
                  xl: "65%",
                },
                margin: "auto",
              }}
            >
              <Paper className={classes.paper}>
                <Typography
                  variant="h5"
                  sx={{
                    paddingBottom: "17px",
                  }}
                >
                  Account settings
                </Typography>
                <InputLabel>Country</InputLabel>
                <Select
                  required
                  options={options}
                  value={country ? country : ""}
                  onChange={changeCountry}
                />
                <InputLabel>TimeZone</InputLabel>
                <TimezoneSelect
                  value={
                    selectedTimezone
                      ? selectedTimezone
                      : Intl.DateTimeFormat().resolvedOptions().timeZone
                  }
                  onChange={setSelectedTimezone}
                  timezones={arrKeys.length ? obj : allTimezones}
                />
                <InputLabel>Currencies</InputLabel>
                <Select
                  options={
                    country
                      ? curriences().filter((c) => c.country === country.label)
                      : curriences()
                  }
                  value={curriency}
                  onChange={changeCurriency}
                />
                <InputLabel>Method</InputLabel>
                <Select
                  options={cgtCalculationMethods()}
                  value={method}
                  onChange={changeMethod}
                />
                <Button
                  variant="contained"
                  sx={{ marginTop: "15px" }}
                  onClick={handelSave}
                >
                  Save
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={accountSettingSave}
          autoHideDuration={6000}
          onClose={handelAccountSettingSaveClose}
        >
          <Alert
            severity="success"
            sx={{
              width: "100%",
              height: "50px",
              fontSize: "large",
            }}
          >
            Account Settings Save
          </Alert>
        </Snackbar>
        <Snackbar
          open={isErrorAccountSettingSave}
          autoHideDuration={6000}
          onClose={handelAccountSettingSaveClose}
        >
          <Alert
            severity="error"
            sx={{
              width: "100%",
              height: "50px",
              fontSize: "large",
            }}
          >
            {errorMessageAccountSettingSave?.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default withStyles(styles)(AccountSettings);
