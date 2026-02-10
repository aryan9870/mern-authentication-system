import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { AlertContext } from '../context/AlertContext'

const Navbar = () => {

    const { authenticatedUser, backendUrl, setIsLoggedin, setAuthenticatedUser } = useContext(AppContext);
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();


    axios.defaults.withCredentials = true;

    const logout = async () => {
      const { data } = await axios.get(backendUrl + '/api/auth/logout');
      await setIsLoggedin(false);
      setAuthenticatedUser(false);
      showAlert("success", "Logout successful");
    }

    const sendVerifyOtp = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/auth/send-verify-otp');
        if(data.success) {
          showAlert("success", data.message);
          console.log("otp send");
          navigate('/email-verify');
        }
      } catch (error) {
        showAlert("danger", error.response.data.message)
      }
    }

  return (
    <div className='w-full flex justify-between items-center px-24 p-6 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28' />
        {authenticatedUser ? <div className='w-10 h-10 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {authenticatedUser.username[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 w-28'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!authenticatedUser.isVerified && <li onClick={sendVerifyOtp} className='py-2 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>}
              <li onClick={logout} className='py-2 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Log out</li>
            </ul>
          </div>
        </div> : <button onClick={() => navigate('/login')} className='flex items-center gap-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all border'>Log in <img src={assets.arrow_icon} alt="" /></button>}
    </div>
  )
}

export default Navbar