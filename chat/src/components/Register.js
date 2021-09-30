import React, { useEffect, useState } from "react";
import "../styles/register.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Register({ history }) {
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/users/register`, {
        name,
        password,
      });
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register">
        <div className="register-about">
          <h2>Register</h2>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <label>
            <p>Name:</p>
            <input
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
              type="password"
              name={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password.."
              required
            />
          </label>
          <input type="submit" value="Register" />
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
