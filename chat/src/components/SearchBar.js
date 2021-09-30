import React from "react";
import "../styles/searchbar.css";

function SearchBar() {
  return (
    <div className="search-wrapper">
      <div className="search-container">
        <input
          type="text"
          name="search"
          className="search"
          placeholder="Search for a friend.."
        />
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
}

export default SearchBar;
