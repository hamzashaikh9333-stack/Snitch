import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
} from "../api/product.api";
import { setProducts, setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = useCallback(async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  }, []);

  const handleGetSellerProducts = useCallback(async () => {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }, [dispatch]);

  const handleGetAllProducts = useCallback(async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  }, [dispatch]);

  const handleGetProductDetails = useCallback(async (productId) => {
    const data = await getProductDetails(productId);
    return data.product;
  }, []);

  const handleAddProductVariant = useCallback(
    async (productId, newProductVariant) => {
      const data = await addProductVariant(productId, newProductVariant);
      return data;
    },
    [],
  );

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddProductVariant,
  };
};
