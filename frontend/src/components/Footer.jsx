import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-center gap-4 py-3 mt-20 mb-4'>
        <img src={assets.logo} alt=''/>

        <p className='flex-1 text-sm max-sm:hidden text-gray-500 pl-4'>Copyright {new Date().getFullYear()} @GreenCart | All rights reserved.</p>

        <div className='flex gap-2.5'>
            <img src={assets.facebook_icon} alt='' width={35}/>
            <img src={assets.twitter_icon} alt='' width={35}/>
            <img src={assets.instagram_icon} alt='' width={35}/>
        </div>
    </div>
  )
}

export default Footer