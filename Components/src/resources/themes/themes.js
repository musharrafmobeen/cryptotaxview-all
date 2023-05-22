import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#112C64",
      light: "#3265AF",
      dark: "#6E6E6E",
      contrastText: "#000",
    },
  },
});

export default theme;
