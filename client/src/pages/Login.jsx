import React from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [state, setState] = useState("Sign up");
  const [userData, setUserData] = useState({});

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-20 top-5 w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign up"
            ? "Create new account"
            : "Login to your account!"}
        </p>

        <form action="">
          {state == "Sign up" && (
            <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
              onChange={handleChange}
                className="bg-transparent outline-none"
                name="username"
                type="text"
                placeholder="Full Name"
                value={userData.name}
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={handleChange}
              className="bg-transparent outline-none"
              name="email"
              type="email"
              placeholder="Email id"
              value={userData.email}
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input onChange={handleChange}
              className="bg-transparent outline-none"
              name="password"
              type="password"
              placeholder="Password"
              value={userData.password}
              required
            />
          </div>

          <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">
            Forgot password?
          </p>

          <button onClick={handleSubmit} className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state == "Log in" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Alredy have an account?{" "}
            <span
              onClick={() => setState("Log in")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
