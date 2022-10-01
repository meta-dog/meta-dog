import { ThemeProvider, createTheme } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { AppStateProvider } from "./contexts";
import "./i18n";
import Main from "./pages";

const theme = createTheme({
  palette: {
    primary: { main: "#1C1E20" },
    secondary: { main: "#418af7" },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        popper: {
          zIndex: 1300,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <ToastContainer />
        <Main />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
