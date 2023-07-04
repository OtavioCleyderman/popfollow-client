import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./searchBar.scss";

function SearchBar({ onFilter }) {
  const [searchValue, setSearchValue] = useState("");

  function handleInputChange(e) {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    onFilter(newSearchValue);
  }

  function handleReset() {
    setSearchValue("");
    onFilter("");
  }

  return (
    <>
      <div className="search" data-testid="search-bar">
        <FaSearch />
        <input
          role="searchbox"
          type="text"
          placeholder="Busca"
          value={searchValue}
          onChange={handleInputChange}
        />
        {searchValue && (
          <button className="reset-button" onClick={handleReset}>
            <FaTimes />
          </button>
        )}
      </div>
    </>
  );
}

export default SearchBar;