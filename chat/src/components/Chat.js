import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/layout.css";
import Conversations from "./Conversations";
import UsersList from "./UsersList";
import Messages from "./Messages";
import SearchBar from "./SearchBar";
import User from "./User";

function Chat({ history }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [activeComponent, setActiveComponent] = useState("users");

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/conversation/${userInfo.id}`
        );
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [activeComponent]);

  const getUsers = () => {
    setActiveComponent("users");
  };

  const setChatOn = (e, current) => {
    if (e.target.className !== "far fa-trash-alt") {
      setCurrentChat(current);
    } else {
      setCurrentChat(null);
    }
  };

  const getConversations = () => {
    setActiveComponent("conversations");
  };

  return (
    <div className="container">
      <div className="left">
        <div className="left-top">
          <SearchBar />
          <div className="search-sort">
            <button
              className={activeComponent === "conversations" ? "active" : ""}
              onClick={() => getConversations()}
            >
              My conversations
            </button>
            <button
              className={activeComponent === "users" ? "active" : ""}
              onClick={() => getUsers()}
            >
              All users
            </button>
          </div>
        </div>
        <div className="conversations-container">
          {activeComponent === "users" ? (
            <UsersList />
          ) : activeComponent === "conversations" ? (
            conversations.map((c) => {
              return (
                <div onClick={(e) => setChatOn(e, c)} key={c._id}>
                  <Conversations conversation={c} currentUser={userInfo} />
                </div>
              );
            })
          ) : (
            ""
          )}
        </div>
      </div>
      {
        <div className="center slide-right">
          {currentChat ? (
            <Messages loggedInUser={userInfo} currentChat={currentChat} />
          ) : (
            ""
          )}
          {}
        </div>
      }

      <div className="right">
        <User history={history} activeComponent={activeComponent} />
      </div>
    </div>
  );
}

export default Chat;
