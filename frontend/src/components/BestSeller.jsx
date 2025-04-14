import React from 'react'
import ProductCart from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const {products} = useAppContext()
  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-6 gap-4'>
            {products.filter ((product) => product.inStock).slice(0,8).map((product,index) =>(
                <ProductCart key={index} product = {product}/>
            ))}
        </div>
    </div>
  )
}

export default BestSeller