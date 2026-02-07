import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()
  return (
    <div className='w-full flex justify-between items-center px-24 p-6 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28' />
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all border'>Login <img src={assets.arrow_icon} alt="" /></button>
    </div>
  )
}

export default Navbar