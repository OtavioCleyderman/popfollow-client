import { Link } from "react-router-dom";
import "./logo.scss";

function Logo() {
  return (
    <Link to={"/"} className="logo">
      <h1>Pop Follow!</h1>
    </Link>
  );
}

export default Logo;
