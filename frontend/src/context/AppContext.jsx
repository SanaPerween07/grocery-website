import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if(data.success){
        setIsSeller(true)
      }
      else{
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false);
    }
  };


  const fetchUser = async () => {
    try{
      const {data} = await axios.get('/api/user/is-auth')
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    }
    catch(error){
      setUser(null)
    }
  }

  const fetchProducts = async () => {
    try{
      const {data} = await axios.get('/api/product/list')
      if(data.success){
        setProducts(data.products)
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)
    }
  };



  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const itemInfo = products.find(p => p._id === id);
      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[id];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);


  useEffect(() => {
    const debounceTimeout = useRef(null)
  
    if (user) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
  
      debounceTimeout.current = setTimeout(async () => {
        try {
          const { data } = await axios.post('/api/cart/update', { cartItems })
  
          if (!data.success) {
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }, 500) // debounce time (in ms)
    }
  
    return () => clearTimeout(debounceTimeout.current)
  }, [cartItems])

  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    navigate,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,fetchSeller,
    setCartItems
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
