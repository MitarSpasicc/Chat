import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/layout.css";
import Conversations from "./Conversations";
import UsersList from "./UsersList";
import Messages from "./Messages";
import SearchBar from "./SearchBar";
import User from "./User";
import socket from "./socket-client";

function Chat({ history }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [activeComponent, setActiveComponent] = useState("users");
  const [joinedUser, setJoinedUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    socket.emit("addUser", userInfo.id);
  }, []);

  useEffect(() => {
    socket.on("newUser", (id) => {
      const getNewUser = async () => {
        const response = await axios.get(`/api/users/${id}`);
        setJoinedUser(`${response.data.name} has joined the chat`);
        setIsVisible(true);
      };
      getNewUser();
    });
    const timer = setTimeout(() => {
      setIsVisible(false);
      setJoinedUser(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [users]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(
          response.data.filter((user) => {
            return (
              user._id !== userInfo.id &&
              conversations.every((c) => c.members[1]._id !== user._id)
            );
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [conversations, joinedUser]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${userInfo.id}`);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [activeComponent, userInfo.id]);

  const filterUsers = async (e) => {
    const { value } = e.target;
    try {
      const { data } = await axios.get("/api/users");
      const filteredUsers = data.filter(
        (user) =>
          user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          user._id !== userInfo.id
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const filterConversations = async (e) => {
    const { value } = e.target;
    try {
      const { data } = await axios.get(`/api/conversation/${userInfo.id}`);
      const filteredConversations = data.filter((user) => {
        return (
          user.members[1].name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      });
      setConversations(filteredConversations);
    } catch (error) {
      console.log(error);
    }
  };

  const setNewConversation = () => {
    setTimeout(() => {
      setActiveComponent("conversations");
    }, 300);
  };

  const setChatOn = (e, current) => {
    if (e.target.className !== "far fa-trash-alt") {
      setCurrentChat(current);
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.querySelector(".close-chat").style.display = "block";
          document.querySelector(".left").style.display = "none";
          document.querySelector(".center").style.display = "grid";
          document.querySelector(".container").style.gridTemplateAreas =
            '"right right right" "center center center"';
        }, 200);
      }
    } else {
      setCurrentChat(null);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="left-top">
          <p className="joined-user">{isVisible && joinedUser}</p>
          <SearchBar
            activeComponent={activeComponent}
            searchUsers={(e) => filterUsers(e)}
            searchConversations={(e) => filterConversations(e)}
          />
          <div className="search-sort">
            <button
              className={activeComponent === "conversations" ? "active" : ""}
              onClick={() => setActiveComponent("conversations")}
            >
              My conversations
            </button>
            <button
              className={activeComponent === "users" ? "active" : ""}
              onClick={() => setActiveComponent("users")}
            >
              All users
            </button>
          </div>
        </div>
        <div className="conversations-container">
          {activeComponent === "users" ? (
            <div onClick={() => setNewConversation()}>
              {users.map((user) => (
                <UsersList user={user} key={user._id} />
              ))}
            </div>
          ) : activeComponent === "conversations" ? (
            conversations.map((c) => {
              return (
                <div onClick={(e) => setChatOn(e, c)} key={c._id}>
                  <Conversations
                    member={c.members.find((m) => m._id !== userInfo.id)}
                    conversationId={c._id}
                    currentUser={userInfo}
                  />
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
