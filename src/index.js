import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

const PUBLIC_READ = process.env.WEBDAV_PUBLIC_READ;
const USERNAME = process.env.WEBDAV_USERNAME || "admin";
const PASSWORD = process.env.WEBDAV_PASSWORD || "admin";
const UNLISTED = process.env.WEBDAV_UNLISTED || "0";

function renderApp() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

async function startApp() {
  if (UNLISTED !== "1") {
    renderApp();
    return;
  }

  if (PUBLIC_READ === "1") {
    renderApp();
    return;
  }
  if (!USERNAME || !PASSWORD) {
    alert("WebDAV protocol is not enabled");
    return;
  }

  const expectedAuth = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);

  const stored = sessionStorage.getItem("auth");
  if (stored === expectedAuth) {
    renderApp();
    return;
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const inputUser = window.prompt("Username:");
    if (inputUser === null) return;
    const inputPass = window.prompt("Password:");
    if (inputPass === null) return;

    const provided = "Basic " + btoa(`${inputUser}:${inputPass}`);
    if (provided === expectedAuth) {
      sessionStorage.setItem("auth", provided);
      renderApp();
      return;
    }

    alert("Unauthorized");
  }
  alert("Unauthorized");
}

startApp();
