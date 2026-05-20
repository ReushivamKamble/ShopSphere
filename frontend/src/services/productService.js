import API from "./api";

// Fetch all products
export const getAllProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};