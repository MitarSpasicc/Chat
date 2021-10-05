import React from "react";
import axios from "axios";

function UsersList({ user }) {
  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));

  const addNewConversation = async () => {
    const newConversation = {
      senderId: loggedInUser.id,
      receiverId: user._id,
    };
    try {
      await axios.post(`/api/conversation`, newConversation);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="conversation" onClick={() => addNewConversation()}>
      <div className="con-avatar">
        <div className="img-container-conversation">
          <i className="fas fa-user-tie"></i>
        </div>
      </div>
      <div className="con-info">
        <h3 className="con_name">{user ? user.name : ""}</h3>
        <p className="con_message"></p>
      </div>
      <div className="con-about">
        <i className="fas fa-user-plus"></i>
      </div>
    </div>
  );
}

export default UsersList;
