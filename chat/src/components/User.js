import React from "react";
import "../styles/user.css";
import socket from "./socket-client";

function User({ history, activeComponent }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const handleLogOut = function () {
    localStorage.clear();
    history.push("/login");
    socket.emit("logout", userInfo);
  };
  return (
    <>
      <div className="right-top">
        <div className="right-image-container">
          <i className="fas fa-user-astronaut"></i>
        </div>
      </div>
      <div className="right-icons">
        <i
          className={
            activeComponent === "conversations"
              ? "fas fa-users active"
              : "fas fa-users"
          }
        ></i>
        <i
          className={
            activeComponent === "users"
              ? "fas fa-user-plus active"
              : "fas fa-user-plus"
          }
        ></i>
        <i className="fas fa-sign-out-alt" onClick={handleLogOut}></i>
      </div>
    </>
  );
}

export default User;
