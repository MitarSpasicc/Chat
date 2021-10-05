import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/messages.css";
import socket from "./socket-client";
function Messages({ loggedInUser, currentChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChatFriend, setCurrentChatFriend] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    let friendId = currentChat.members.find((m) => m._id !== loggedInUser.id);
    const getChatUser = async () => {
      try {
        const res = await axios.get(`/api/users/${friendId._id}`);
        setCurrentChatFriend(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChatUser();
  }, [currentChat, loggedInUser.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    arrivalMessage &&
      currentChat.members.some((c) => c._id === arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat.members]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: loggedInUser.id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member._id !== loggedInUser.id
    );

    try {
      const response = await axios.post("/api/messages", message);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }

    socket.emit("sendMessage", {
      senderId: loggedInUser.id,
      receiverId: receiverId._id,
      text: newMessage,
    });
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const response = await axios.get(`/api/messages/${currentChat._id}`);
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const quitCurrentChat = () => {
    document.querySelector(".center").style.display = "none";
    document.querySelector(".left").style.display = "grid";
    document.querySelector(".container").style.gridTemplateAreas =
      '"right right right" "left left left"';
  };

  return (
    <>
      <div className="buddy-header">
        <div className="img-container-buddy">
          <i className="fas fa-user-tie"></i>
        </div>
        <div className="buddy-name-container">
          <h3 className="buddy_name">
            {currentChatFriend ? currentChatFriend.name : ""}
          </h3>
        </div>
        <div className="close-chat" onClick={quitCurrentChat}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="messages">
        {messages.map((m) => {
          return (
            <div
              ref={scrollRef}
              className={
                m.sender === loggedInUser.id
                  ? "chat-message chat-message-sender"
                  : "chat-message chat-message-reciever"
              }
              key={m._id}
            >
              <div className="img-container-chat">
                {m.sender === loggedInUser.id ? (
                  <i className="fas fa-user-astronaut" />
                ) : (
                  <i className="fas fa-user-tie" />
                )}
              </div>
              <div className="message-text">
                <p>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="buddy-message">
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="type_message"
            type="text"
            placeholder="Type a message..."
          />
          <i onClick={handleSubmit} className="far fa-paper-plane fa-2x"></i>
        </form>
      </div>
    </>
  );
}

export default Messages;
