import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../../../Features/Auth/authSlice";
import "./LoginSignUp.css";

const LoginSignUp = () => {
  const [activeTab, setActiveTab] = useState("tabButton1");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(credentials)
      await dispatch(login(credentials)).unwrap();
      navigate("/"); 
    } catch (error) {
      console.error("Failed to login: ", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(userData)).unwrap();
      navigate(0);
    } catch (error) {
      console.error("Failed to signup: ", error);
    }
  };

  return (
    <div className="loginSignUpSection">
      <div className="loginSignUpContainer">
        <div className="loginSignUpTabs">
          <p
            onClick={() => handleTab("tabButton1")}
            className={activeTab === "tabButton1" ? "active" : ""}
          >
            Login
          </p>
          <p
            onClick={() => handleTab("tabButton2")}
            className={activeTab === "tabButton2" ? "active" : ""}
          >
            Register
          </p>
        </div>
        <div className="loginSignUpTabsContent">
          {authError && <p style={{ color: "red" }}>{authError}</p>}
          {authStatus === "succeeded" && (
            <p style={{ color: "green" }}>Success! Redirecting...</p>
          )}
          {activeTab === "tabButton1" && (
            <div className="loginSignUpTabsContentLogin">
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email address *"
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password *"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />
                <div className="loginSignUpForgetPass">
                  <label>
                    <input type="checkbox" className="brandRadio" />
                    <p>Remember me</p>
                  </label>
                  <p>
                    <Link to="/resetPassword">Lost password?</Link>
                  </p>
                </div>
                {authStatus === "loading" ? (
                  <CircularProgress />
                ) : (
                  <button type="submit">Login</button>
                )}
              </form>
              <div className="loginSignUpTabsContentLoginText">
                <p>
                  No account yet?{" "}
                  <span onClick={() => handleTab("tabButton2")}>
                    Create Account
                  </span>
                </p>
              </div>
            </div>
          )}
          {activeTab === "tabButton2" && (
            <div className="loginSignUpTabsContentRegister">
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username *"
                  required
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email address *"
                  required
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password *"
                  required
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
                <p>
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account,
                  and for other purposes described in our
                  <Link
                    to="/terms"
                    style={{ textDecoration: "none", color: "#c32929" }}
                  >
                    {" "}
                    privacy policy
                  </Link>
                  .
                </p>
                {authStatus === "loading" ? (
                  <CircularProgress />
                ) : (
                  <button type="submit">Sign Up</button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;