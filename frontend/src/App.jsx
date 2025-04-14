import React, { useContext } from "react"
import { Routes, Route, useLocation} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import {Toaster} from 'react-hot-toast'
import Login from "./components/Login"
import { AppContext } from "./context/AppContext"
import AllProducts from "./pages/AllProducts"
import ProductCategory from "./pages/ProductCategory"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import { AddAddress } from "./pages/AddAddress"
import MyOrders from "./pages/MyOrders"
import SellerLogin from "./components/seller/SellerLogin"
import SellerLayout from "./pages/seller/SellerLayout"
import AddProduct from "./pages/seller/AddProduct"
import ProductList from "./pages/seller/ProductList"
import Orders from "./pages/seller/Orders"
import Loading from "./components/Loading"

function App() {
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, isSeller} = useContext(AppContext);
  
  return (
    <div className='min-h-screen px-8 bg-white'>
      {isSellerPath ? null : <Navbar/>}
      {showUserLogin && <Login/>}

      <Toaster/>

      <div className={isSellerPath ? "w-full" : "mx-auto w-full max-w-screen-xl px-4 sm:px-6 md:px-8"}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<AllProducts/>} />
          <Route path="/products/:category" element={<ProductCategory/>} />
          <Route path="/products/:category/:id" element={<ProductDetails/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/add-address" element={<AddAddress/>} />
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/loader" element={<Loading/>} />
          
          <Route path="/seller" element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={<AddProduct/>} />
            <Route path="product-list" element={<ProductList/>} />
            <Route path="orders" element={<Orders/>} />
          </Route>
        </Routes>
      </div>
      
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App