import React, { useState, useEffect } from "react";
import "../styles/register.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Popup from "./Popup";

function Register({ history }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setError(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/api/users/register`, {
        name,
        password,
        confirmPassword,
      });
      history.push("/login");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="register-container">
      {isVisible && error && <Popup message={error} />}
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
          <label>
            <p>Confirm password:</p>
            <input
              type="password"
              name={password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password.."
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
