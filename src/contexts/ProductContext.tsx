import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';
import { products as initialProducts } from '@/data/products';
import { toast } from '@/components/ui/sonner';

interface ProductContextType {
  products: Product[];
  updateProduct: (productId: string, updates: Partial<Product>) => boolean;
  updateStock: (productId: string, newStock: number) => boolean;
  getProduct: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_DATA_VERSION = 'v3_accurate_matched_product_images';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const version = localStorage.getItem('shophub_products_version');
    if (version !== PRODUCTS_DATA_VERSION) {
      localStorage.setItem('shophub_products_version', PRODUCTS_DATA_VERSION);
      localStorage.setItem('shophub_products', JSON.stringify(initialProducts));
      return initialProducts;
    }
    const savedProducts = localStorage.getItem('shophub_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('shophub_products', JSON.stringify(newProducts));
  };

  const updateProduct = (productId: string, updates: Partial<Product>): boolean => {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      toast.error('Product not found');
      return false;
    }

    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...updatedProducts[productIndex], ...updates };
    saveProducts(updatedProducts);
    toast.success('Product updated successfully');
    return true;
  };

  const updateStock = (productId: string, newStock: number): boolean => {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      toast.error('Product not found');
      return false;
    }

    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      stock: newStock,
      inStock: newStock > 0,
    };
    saveProducts(updatedProducts);
    toast.success('Stock updated successfully');
    return true;
  };

  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id === productId);
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, updateStock, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
