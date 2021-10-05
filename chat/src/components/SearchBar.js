import React from "react";
import "../styles/searchbar.css";

function SearchBar({ searchUsers, searchConversations, activeComponent }) {
  return (
    <div className="search-wrapper">
      <div className="search-container">
        <input
          type="text"
          name="search"
          className="search"
          placeholder="Search for a friend.."
          onChange={
            activeComponent === "users" ? searchUsers : searchConversations
          }
        />
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
}

export default SearchBar;
