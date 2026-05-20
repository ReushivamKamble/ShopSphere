import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // CHECK PRODUCT EXISTS
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // CHECK IF PRODUCT ALREADY IN CART
    let cartItem = await Cart.findOne({
      user: req.user.id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: req.user.id,
        product: productId,
        quantity,
      });
    }

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cartItem,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item removed",
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};