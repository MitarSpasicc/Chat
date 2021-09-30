import axios from "axios";
import React, { useState, useEffect } from "react";
import "../styles/conversations.css";

function Conversations({ conversation, currentUser }) {
  const [latestMessage, setLatestMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleDelete = async (e, id) => {
    try {
      await axios.delete(`/api/conversation/${id}`);
      e.target.parentElement.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (conversation) {
      const friendId = conversation.members.find((m) => m !== currentUser.id);
      const getUser = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/users/${friendId}`
          );
          setUser(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getUser();
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      let getLatestMessage = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/messages/${conversation._id}`
          );
          setLatestMessage(data[data.length - 1].text);
        } catch (error) {
          console.log(error);
        }
      };
      getLatestMessage();
    }
  }, []);

  return (
    <div className="conversation">
      <div className="con-avatar">
        <div className="img-container-conversation">
          <i className="fas fa-user-tie"></i>
        </div>
      </div>
      <div className="con-info">
        <h3 className="con_name">{user ? user.name : ""}</h3>
        <p className="con_message">
          {latestMessage ? latestMessage.substr(0, 6) + "..." : ""}
        </p>
      </div>
      <div className="con-about">
        <i
          className="far fa-trash-alt"
          onClick={(e) => handleDelete(e, user.id)}
        ></i>
      </div>
    </div>
  );
}

export default Conversations;
