import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // tax

    await Order.create({
      userId,
      items,
      amount,
      address,
      status: "pending",
      paymentType: "COD",
      isPaid: false,
    });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // tax

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      status: "pending",
      paymentType: "Online",
      isPaid: false,
    });

    const line_items = productData.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100)

      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      }      
    });

    return res.json({ success: true, url: session.url });

  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// /stripe
export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { orderId, userId } = session.metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true, status: "completed" });
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object;
      await Order.findByIdAndDelete(expiredSession.metadata.orderId);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};


// /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address").sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address").sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
