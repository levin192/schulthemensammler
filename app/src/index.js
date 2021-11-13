import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./css/base.scss";
import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons(/* optional base url */);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
