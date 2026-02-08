import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

const Home = () => {
  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
    <Navbar />
    <Hero />
    </div>
  )
}

export default Home