import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import "./index.css";
import App from "./App.js";

const root = createRoot(document.getElementById("root")); // Use createRoot directly
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
