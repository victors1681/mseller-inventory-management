import React, { useState } from "react";
import ProductSearchScreen from "../../components/products/ProductScreen";
import ProductDetailScreen from "../../components/products/ProductDetailScreen";
import type { Product } from "../../types/inventory";

type ProductScreenType = "search" | "detail";

export default function ProductTab() {
  const [currentScreen, setCurrentScreen] = useState<ProductScreenType>("search");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen("detail");
  };

  const handleNavigateBack = () => {
    setCurrentScreen("search");
    setSelectedProduct(null);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "search":
        return <ProductSearchScreen onProductSelect={handleProductSelect} />;
      case "detail":
        return (
          selectedProduct && (
            <ProductDetailScreen
              product={selectedProduct}
              onBack={handleNavigateBack}
            />
          )
        );
      default:
        return <ProductSearchScreen onProductSelect={handleProductSelect} />;
    }
  };

  return renderCurrentScreen();
}
