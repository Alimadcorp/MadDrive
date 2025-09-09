import { ThemeProvider } from "@emotion/react";
import {
  Button,
  createTheme,
  CssBaseline,
  GlobalStyles,
  Snackbar,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Header from "./Header";
import Main from "./Main";
import ProgressDialog from "./ProgressDialog";
import { TransferQueueProvider } from "./app/transferQueue";

const globalStyles = (
  <GlobalStyles styles={{ "html, body, #root": { height: "100%" } }} />
);

const theme = createTheme({
  palette: { primary: { main: "#f38020" } },
});

function App() {
  const [search, setSearch] = useState("");
  const [showProgressDialog, setShowProgressDialog] = React.useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [auth, setAuth] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  // Check for WEBDAV_UNLISTED and show login if needed
  useEffect(() => {
    if ((window as any).WEBDAV_UNLISTED === "1") {
      setShowLogin(true);
    }
  }, []);

  // Simple login dialog
  const handleLogin = () => {
    const username = window.prompt("Username:");
    const password = window.prompt("Password:");
    if (!username || !password) return;
    const encoded = btoa(`${username}:${password}`);
    setAuth(`Basic ${encoded}`);
    setShowLogin(false);
    // Optionally, store in localStorage/sessionStorage
    (window as any).WEBDAV_AUTH = `Basic ${encoded}`;
  };

  // Intercept fetch to add Authorization header if needed
  useEffect(() => {
    if (!auth) return;
    const origFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      if ((window as any).WEBDAV_UNLISTED === "1" && auth) {
        init = init || {};
        init.headers = {
          ...(init.headers || {}),
          Authorization: auth,
        };
      }
      return origFetch(input, init);
    };
    return () => {
      window.fetch = origFetch;
    };
  }, [auth]);

  if (showLogin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <Stack
          sx={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleLogin}
          >
            Login to FlareDrive
          </Button>
        </Stack>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <TransferQueueProvider>
        <Stack sx={{ height: "100%" }}>
          <Header
            search={search}
            onSearchChange={(newSearch: string) => setSearch(newSearch)}
            setShowProgressDialog={setShowProgressDialog}
          />
          <Main search={search} onError={setError} />
        </Stack>
        <Snackbar
          autoHideDuration={5000}
          open={Boolean(error)}
          message={error?.message}
          onClose={() => setError(null)}
        />
        <ProgressDialog
          open={showProgressDialog}
          onClose={() => setShowProgressDialog(false)}
        />
      </TransferQueueProvider>
    </ThemeProvider>
  );
}

export default App;
