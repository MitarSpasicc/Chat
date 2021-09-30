import axios from "axios";
import React, { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.filter((user) => user._id !== userInfo.id));
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  const createConversation = async (user) => {
    try {
      const newConversation = {
        senderId: userInfo.id,
        receiverId: user._id,
      };
      localStorage.setItem("conversations", JSON.stringify(""));
      await axios.post(`/api/conversation`, newConversation);
    } catch (error) {
      console.log(error);
    }
  };

  return users.map((user) => {
    return (
      <div
        className="conversation"
        key={user._id}
        onClick={() => createConversation(user)}
      >
        <div className="con-avatar">
          <div className="img-container-conversation">
            <i className="fas fa-user-tie"></i>
          </div>
        </div>
        <div className="con-info">
          <h3 className="con_name">{user ? user.name : ""}</h3>
        </div>
        <div className="con-add-friend">
          <i className="fas fa-user-plus active"></i>
        </div>
      </div>
    );
  });
}

export default UsersList;
