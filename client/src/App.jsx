import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Home from './pages/home';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Alert from "./components/Alert";




const App = () => {
  return (
    <BrowserRouter>
    <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App