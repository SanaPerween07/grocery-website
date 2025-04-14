import React, {useEffect, useState} from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {

    const [open, setOpen] = useState(false)
    const {user, setUser, navigate, setShowUserLogin, searchQuery, setSearchQuery, getCartCount, axios} = useAppContext()

    const logout = async () => {
        try {
          const {data} = await axios.post('/api/user/logout');

          if(data.success){
            toast.success(data.message)
             setUser(null);
            navigate('/');
          }
          else{
            toast.error(data.message)
          }
        } 
        catch (error) {
          toast.error(error.message);
        }
      };
      

    useEffect(()=>{
        if(searchQuery.length > 0){
            navigate('/products')
        }
    }, [searchQuery])

    return (
        <nav className="flex items-center justify-between border-b border-gray-300 bg-white relative py-4">

            <Link to = '/'>
                <img src={assets.logo} alt="" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to={'/'}>Home</NavLink>
                <NavLink to={'/products'}>All Products</NavLink>
                <NavLink to={'/'}>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full outline-none placeholder-gray-500"   
                    type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt='' className='w-4 h-4'/>
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt='' className='w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-emerald-400 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? 
                <button onClick={() => (setShowUserLogin(true))} className="cursor-pointer px-8 py-2 bg-emerald-500 hover:bg-emerald-300 transition text-white rounded-full">
                    Login
                </button>
                :
                <div className='relative group'>
                    <img src={assets.profile_icon} alt='' className='w-10' />
                    <ul className='hidden group-hover:block absolute top-10 right-0 py-2.5 px-2.5 w-25 z-40 
                                    rounded-md shadow border border-gray-200  bg-white text-sm '>
                        <li onClick={() => navigate("my-orders")}>My Orders </li>
                        <li onClick={logout}>Logout</li>
                    </ul>
                </div>}
            </div>




            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt='' className='w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-emerald-400 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu">
                <img src={assets.menu_icon} alt='' />
            </button>
            </div>



            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to='/' onClick={() => setOpen(false)}> Home </NavLink>
                <NavLink to='/' onClick={() => setOpen(false)}> All Products </NavLink>
                <NavLink to='/' onClick={() => setOpen(false)}> Contact </NavLink>
                {user && <NavLink to='/' onClick={() => setOpen(false)}> My Orders </NavLink>}


                {!user ? 
                <button onClick={() => {setOpen(false); setShowUserLogin(false);}} 
                    className="cursor-pointer px-6 py-2 mt-2 bg-emerald-500 hover:bg-emerald-300 transition text-white rounded-full text-sm">
                        Login
                </button>
                :
                <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-emerald-500 hover:bg-emerald-300 transition text-white rounded-full text-sm">
                    Logout
                </button>}
            </div>

        </nav>
  )
}

export default Navbar