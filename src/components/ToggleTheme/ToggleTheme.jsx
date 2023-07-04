import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import "./toggleTheme.scss";

const ToggleTheme = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || "light";
  });

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, []);

  let toggleButton;

  if (theme === "light") {
    toggleButton = (
      <div className="toggle">
        <button className="toggle-btn" onClick={toggle}>
          <FiSun className="fa-sun" />
        </button>
      </div>
    );
  } else {
    toggleButton = (
      <div className="toggle">
        <button className="toggle-btn" onClick={toggle}>
          <FiMoon className="fa-moon" />
        </button>
      </div>
    );
  }

  return toggleButton;
};

export default ToggleTheme;
