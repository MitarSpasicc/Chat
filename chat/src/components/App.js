import React from "react";
import "../styles/global.css";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <Router>
      <div className="App">
        <Route exact path="/">
          {userInfo !== null ? (
            <Redirect to="/chat" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Switch>
          <Route path="/chat" component={Chat} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
