import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.main_banner_bg} alt='' className='w-full hidden md:block'/>
        <img src={assets.main_banner_bg_sm} alt='' className='w-full md:hidden'/>

        <div className='absolute inset-0 flex flex-col items-center md:items-start
                        justify-end md:justify-center 
                        pb-24 md:pd-0 px-4 md:pl-8 lg:pl-24'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl 
                            font-bold text-center md:text-left
                            max-w-72 md:max-w-80 lg:max-w-105 
                            leading-tight lg:leading-15 mt-10 pt-12'>
            Freshness you can trust, Saving you will Love!</h1>

            <div className='flex items-center mt-10 font-medium'>
                <Link to = {'/products'} className='group flex items-center gap-2 px-7 md:px-9 py-3             bg-emerald-500 hover:bg-emerald-300 rounded transition cursor-pointer text-white'>
                    Shop now
                    <img className="md:hidden group-focus:translate-x-1 transition" src={assets.white_arrow_icon} alt='' />
                </Link>

                <Link to = {'/products'} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
                    Explore deals
                    <img className="group-focus:translate-x-1 transition" src={assets.black_arrow_icon} alt='' />
                </Link>
            </div>

        </div>

    </div>
  )
}

export default MainBanner