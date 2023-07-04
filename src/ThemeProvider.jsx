import React from "react";
import ToggleTheme from "./components/ToggleTheme/ToggleTheme";

const ThemeProvider = ({ children }) => {
  return (
    <div>
      <ToggleTheme />
      {children}
    </div>
  );
};

export default ThemeProvider;
