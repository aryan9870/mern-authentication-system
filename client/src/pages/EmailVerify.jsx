import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { AlertContext } from "../context/AlertContext";

const EmailVerify = () => {

  const navigate = useNavigate()
  const { backendUrl, isLoggedin, authenticatedUser } = useContext(AppContext);
  const { showAlert } = useContext(AlertContext);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (e, index) => {

    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    // 🔥 PASTE CASE
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
    });
    setOtp(newOtp);

    // last input focus
    const inputs = e.target.form.querySelectorAll("input");
    inputs[5]?.focus();
    return;
  }

    newOtp[index] = value;
    setOtp(newOtp);

    // AUTO NEXT
    if (value) {
      const inputs = e.target.form.querySelectorAll("input");
      inputs[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      showAlert("error", "Enter six digit otp");
      return;
    }

    try {
      // backend call
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', {otp: enteredOtp});
      if(data.success) {
        showAlert("success", data.message);
        navigate("/");
      }
    } catch (error) {
      showAlert("error", error.response.data.message);
    }
  };

  const handleKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otp[index]) {
    const inputs = e.target.form.querySelectorAll("input");
    inputs[index - 1]?.focus();
  }
  };

  useEffect(() => {
    isLoggedin && authenticatedUser && authenticatedUser.isVerified && navigate('/');
  }, [isLoggedin, authenticatedUser])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className="absolute left-20 top-5 w-32 cursor-pointer"/>
      <form onSubmit={handleSubmit} action="" className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6 digit code sent to your email id.</p>
          <div className="flex justify-between mb-8">
              {otp.map((digit, idx) => {
                return <input value={digit} onChange={(e) => handleChange(e, idx)} onKeyDown={(e) => handleKeyDown(e, idx)} type="text" maxLength='1' key={idx} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"/>
              })}
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">Verify email</button>
      </form>
      
    </div>
  );
};

export default EmailVerify;
