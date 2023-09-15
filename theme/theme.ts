import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    action: {
      selected: "#ff0000",
      active: "#ff0000",
      focus: "#ff0000",
      hover: "#ff0000",
    },

    primary: {
      main: "#ff0000",
    },
    text: {
      primary: "#fff",
      secondary: "",
    },
  },
});

export default theme;
