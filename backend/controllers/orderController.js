import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// CREATE ORDER FROM CART
export const createOrder = async (req, res) => {
  try {
    // GET USER CART ITEMS
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    // CHECK EMPTY CART
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // CALCULATE TOTAL PRICE
    const totalPrice = cartItems.reduce(
      (acc, item) =>
        acc + (item.product?.price || 0) * item.quantity,
      0
    );

    // CREATE ORDER
    const order = await Order.create({
      user: req.user.id,
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "Processing",
    });

    // CLEAR USER CART
    await Cart.deleteMany({
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};