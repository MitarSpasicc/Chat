import axios from "axios";
import React from "react";
import "../styles/conversations.css";

function Conversations({ member }) {
  const handleDelete = async (e, id) => {
    try {
      await axios.delete(`/api/conversation/${id}`);
      e.target.parentElement.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="conversation">
      <div className="con-avatar">
        <div className="img-container-conversation">
          <i className="fas fa-user-tie"></i>
        </div>
      </div>
      <div className="con-info">
        <h3 className="con_name">{member ? member.name : ""}</h3>
        <p className="con_message"></p>
      </div>
      <div className="con-about">
        <i
          className="far fa-trash-alt"
          onClick={(e) => handleDelete(e, member._id)}
        ></i>
      </div>
    </div>
  );
}

export default Conversations;
