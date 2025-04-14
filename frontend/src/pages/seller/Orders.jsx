import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const { currency, axios } = useAppContext()
    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        try{
            const {data} = await axios.post("/api/order/seller")
            if(data.success){
                setOrders(data.orders)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300">
                        {/* Order Items */}
                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.product.name} <span className="text-emerald-500">x {item.quantity}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="text-sm md:text-base text-black/60 space-y-1">
                            <p className='text-black/80 font-medium'>Shipping Address:</p>
                            <p>{order.address.firstName} {order.address.lastName}</p>
                            <p>{order.address.street}, {order.address.city}</p>
                            <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                            <p>Phone: {order.address.phone}</p>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-3">
                            <p className="font-medium text-lg">
                                Total: {currency}{order.amount}
                            </p>
                            <div className="flex flex-col text-sm gap-1">
                                <p>Payment Method: {order.paymentType}</p>
                                <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className={order.isPaid ? "text-emerald-500" : "text-amber-500"}>
                                    Status: {order.isPaid ? "Paid" : "Pending"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders