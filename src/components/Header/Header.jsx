import "./header.scss";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";

function Header({ onFilter }) {
  return (
    <div className="header">
      <Logo />
      <SearchBar onFilter={onFilter} />
    </div>
  );
}

export default Header;
