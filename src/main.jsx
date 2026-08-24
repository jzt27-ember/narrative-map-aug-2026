import React from "react";
import ReactDOM from "react-dom/client";
import CountryLanding from "./CountryLanding.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="min-h-screen py-8">
      <CountryLanding />
    </div>
  </React.StrictMode>
);
