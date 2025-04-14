import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24'>

      <img src={assets.bottom_banner_image} alt='' className='w-full hidden md:block'/>
      <img src={assets.bottom_banner_image_sm} alt='' className='w-full md:hidden'/>

      <div className='absolute inset-0 flex justify-end'>
        <div className='w-full md:w-auto px-4 md:px-0 md:pr-16 lg:pr-24 pt-16 md:pt-0 flex flex-col items-end md:items-start md:justify-center'>
          <h1 className='text-2xl md:text-3xl font-semibold text-emerald-600 mb-6 text-center md:text-left'>
            Why We Are the Best?
          </h1>

          <div className='flex flex-col space-y-4 w-full md:w-auto'>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className='flex items-center gap-4 w-full max-w-xs md:max-w-md'
              >
                <img src={feature.icon} alt='' className='md:w-11 w-9 flex-shrink-0'/>
                <div className='flex-1 text-left'>
                  <h3 className='text-lg md:text-xl font-semibold'>{feature.title}</h3>
                  <p className='text-gray-500/70 text-sm md:text-sm'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomBanner