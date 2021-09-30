import React, { useEffect, useState } from "react";
import "../styles/login.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Login({ history }) {
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      history.push("/chat");
    }
  }, [userInfo, history]);

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login`,
        {
          name,
          password,
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      history.push("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <div className="login-about">
          <i className="far fa-comment"></i>
          <h2>Welcome to chat</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            <p>Name:</p>
            <input
              autoComplete="false"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name.."
              required
            />
          </label>
          <label>
            <p>Password:</p>
            <input
              autoComplete="false"
              type="password"
              name={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password.."
              required
            />
          </label>
          <input type="submit" value="Login" />
        </form>
        <p>
          Dont have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
