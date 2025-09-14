import type { Product } from "../types/inventory";
import { restClient } from "./api";

export interface ProductSearchResponse {
  data: Product[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Product Service - Handles product-related operations
 * Focused on product search, lookup, and catalog operations
 */
export class ProductService {
  private readonly baseEndpoint = "/consumo/Producto";

  /**
   * Search products by barcode
   */
  async buscarProductos(
    codigoBarra: string,
    pageNumber = 0,
    pageSize = 20
  ): Promise<ProductSearchResponse> {
    const response = await restClient.get(
      `${this.baseEndpoint}/buscar-productos?codigoBarra=${encodeURIComponent(
        codigoBarra
      )}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  /**
   * Unified search method that handles different search types
   * Uses the existing buscar-productos endpoint with appropriate parameters
   */
  async buscarProductosUnificado(
    searchValue: string,
    searchType: "codigoBarra" | "codigo" | "texto" = "codigoBarra",
    pageNumber = 0,
    pageSize = 20
  ): Promise<ProductSearchResponse> {
    let queryParams = `pageNumber=${pageNumber}&pageSize=${pageSize}`;

    switch (searchType) {
      case "codigoBarra":
        queryParams += `&codigoBarra=${encodeURIComponent(searchValue)}`;
        break;
      case "codigo":
        // Try using the barcode endpoint with codigo parameter if supported
        // Or fallback to codigoBarra parameter
        queryParams += `&codigo=${encodeURIComponent(searchValue)}`;
        break;
      case "texto":
        // Try using the barcode endpoint with texto/nombre parameter if supported
        // Or fallback to codigoBarra parameter
        queryParams += `&texto=${encodeURIComponent(searchValue)}`;
        break;
    }

    const response = await restClient.get(
      `${this.baseEndpoint}/buscar-productos?${queryParams}`
    );
    return response.data;
  }
}

// Export singleton instance
export const productService = new ProductService();

// =============================================
// Convenience Functions
// =============================================

/**
 * Search products by barcode - Convenience function for UI components
 */
export const searchProducts = async (
  codigoBarra: string,
  pageNumber = 0,
  pageSize = 20
): Promise<ProductSearchResponse> => {
  return productService.buscarProductos(codigoBarra, pageNumber, pageSize);
};

/**
 * Search products by product code - Convenience function for UI components
 */
export const searchProductsByCode = async (
  codigo: string,
  pageNumber = 0,
  pageSize = 20
): Promise<ProductSearchResponse> => {
  return productService.buscarProductosUnificado(
    codigo,
    "codigo",
    pageNumber,
    pageSize
  );
};

/**
 * Search products by text/name - Convenience function for UI components
 */
export const searchProductsByText = async (
  texto: string,
  pageNumber = 0,
  pageSize = 20
): Promise<ProductSearchResponse> => {
  return productService.buscarProductosUnificado(
    texto,
    "texto",
    pageNumber,
    pageSize
  );
};
