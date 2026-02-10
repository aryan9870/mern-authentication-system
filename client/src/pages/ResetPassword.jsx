import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { AlertContext } from '../context/AlertContext'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext);
  const { showAlert } = useContext(AlertContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [otp, setOtp] = useState(['','','','','','']);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

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
  
    const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      const inputs = e.target.form.querySelectorAll("input");
      inputs[index - 1]?.focus();
    }
    };

    const onSubmitEmail = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
        if(data.success) {
          showAlert("success", data.message);
          setIsEmailSent(true);
        }
      } catch (error) {
        showAlert("danger", error.response.data.message);
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const resetOtp =  otp.join('');
      setOtp(resetOtp);
      setIsOtpSent(true);
    }

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
        if(data.success) {
          showAlert("success", data.message);
          navigate('/login')
        }
      } catch (error) {
        showAlert("danger", error.response.data.message);
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className="absolute left-20 top-5 w-32 cursor-pointer"/>
      {/* Enter email address  */}
      {!isEmailSent && <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>        
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
            <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email id' className='bg-transparent outline-none text-white'/>
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full my-3'>Submit</button>
      </form>}

      {/* otp input form  */}
      {isEmailSent && !isOtpSent && <form onSubmit={onSubmitOtp} action="" className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6 digit code sent to your email id.</p>
          <div className="flex justify-between mb-8">
              {otp.map((digit, idx) => {
                return <input value={digit} onChange={(e) => handleChange(e, idx)} onKeyDown={(e) => handleKeyDown(e, idx)}  type="text" maxLength='1' key={idx} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"/>
              })}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">Submit</button>
      </form>}

      {/* Enter new password  */}
      {isEmailSent && isOtpSent && <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>        
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3'/>
            <input name='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder='Enter new password' className='bg-transparent outline-none text-white'/>
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full my-3'>Submit</button>
      </form>}
    </div>
  )
}

export default ResetPassword