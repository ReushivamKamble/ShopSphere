import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import path from "path";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeder");
  } catch (err) {
    console.log("DB Connection Error:", err);
    process.exit(1);
  }
};

// Upload single image to Cloudinary
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "shopsphere_products",
    });

    console.log("Uploaded:", filePath);
    return result.secure_url;
  } catch (err) {
    console.log("Image Upload Failed:", filePath, err.message);
    return null;
  }
};

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    console.log("Old products removed");

    const products = [
      // ================= ELECTRONICS =================
      {
        name: "iPhone 17 Pro",
        price: 174000,
        category: "Electronics",
        description: "Apple flagship smartphone with premium performance.",
        stock: 10,
        image: await uploadImage(path.resolve("uploads/iphone17.jpg")),
      },
      {
        name: "Samsung Galaxy S25 Ultra",
        price: 129000,
        category: "Electronics",
        description: "Premium Android smartphone with advanced AI features.",
        stock: 8,
        image: await uploadImage(path.resolve("uploads/samsungs25.jpg")),
      },
      {
        name: "MacBook Air M5",
        price: 125000,
        category: "Electronics",
        description: "Lightweight Apple laptop with M3 chip.",
        stock: 7,
        image: await uploadImage(path.resolve("uploads/macbookm3.jpg")),
      },
      {
        name: "Sony WH-1000XM6",
        price: 35000,
        category: "Electronics",
        description: "Industry-leading wireless noise cancelling headphones.",
        stock: 12,
        image: await uploadImage(path.resolve("uploads/sonym6.jpg")),
      },
      {
        name: "JBL Flip 6 Speaker",
        price: 10000,
        category: "Electronics",
        description: "Portable premium Bluetooth speaker with deep bass.",
        stock: 15,
        image: await uploadImage(path.resolve("uploads/jbl6.jpg")),
      },

      // ================= FASHION =================
      {
        name: "Levi's Slim Fit Jeans",
        price: 3500,
        category: "Fashion",
        description: "Classic premium slim fit denim jeans.",
        stock: 20,
        image: await uploadImage(path.resolve("uploads/levisjeans.jpg")),
      },
      {
        name: "Puma Essential Hoodie",
        price: 3000,
        category: "Fashion",
        description: "Comfortable premium streetwear hoodie.",
        stock: 18,
        image: await uploadImage(path.resolve("uploads/pumahoodie.jpg")),
      },
      {
        name: "Zara Premium Jacket",
        price: 7000,
        category: "Fashion",
        description: "Modern luxury casualwear jacket.",
        stock: 10,
        image: await uploadImage(path.resolve("uploads/zara.jpg")),
      },

      // ================= SHOES =================
      {
        name: "Nike Air Force 1",
        price: 9000,
        category: "Shoes",
        description: "Classic iconic white sneakers.",
        stock: 16,
        image: await uploadImage(path.resolve("uploads/nikeairforce.jpg")),
      },
      {
        name: "Adidas Ultraboost 22",
        price: 14000,
        category: "Shoes",
        description: "High-performance running shoes with premium cushioning.",
        stock: 14,
        image: await uploadImage(path.resolve("uploads/adidas.jpg")),
      },
      {
        name: "Converse Chuck Taylor",
        price: 5000,
        category: "Shoes",
        description: "Timeless high-top lifestyle sneakers.",
        stock: 15,
        image: await uploadImage(path.resolve("uploads/converse.jpg")),
      },

      // ================= ACCESSORIES =================
      {
        name: "Ray-Ban Aviator Sunglasses",
        price: 12500,
        category: "Accessories",
        description: "Iconic premium aviator sunglasses.",
        stock: 9,
        image: await uploadImage(path.resolve("uploads/rayban.jpg")),
      },
      {
        name: "Wildcraft Backpack Pro",
        price: 4000,
        category: "Accessories",
        description: "Durable stylish backpack for travel and daily use.",
        stock: 13,
        image: await uploadImage(path.resolve("uploads/wildcraft.jpg")),
      },

      // ================= BEAUTY =================
      {
        name: "Minimalist Skincare Set",
        price: 1800,
        category: "Beauty",
        description: "Complete skincare essentials for healthy glowing skin.",
        stock: 22,
        image: await uploadImage(path.resolve("uploads/minimalist.jpg")),
      },
      {
        name: "Beardo Perfume Combo",
        price: 2000,
        category: "Beauty",
        description: "Luxury fragrance collection for men.",
        stock: 17,
        image: await uploadImage(path.resolve("uploads/beardo.jpg")),
      },
    ];

    await Product.insertMany(products);

    console.log("✅ Cloudinary Seed Completed Successfully");

    await mongoose.disconnect();
    console.log("DB Disconnected");

    process.exit(0);
  } catch (err) {
    console.log("Seeder Error:", err);
    process.exit(1);
  }
};

seed();