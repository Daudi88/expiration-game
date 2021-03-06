import {
  ADD_PRODUCT_TO_USER,
  REMOVE_PRODUCT_FROM_USER,
  FETCH_PRODUCTS,
} from "../actions/productsActions";
import Product from "../../models/product";

const initialState = {
  userProducts: [],
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        userProducts: action.products,
      };
    case ADD_PRODUCT_TO_USER:
      const newProduct = new Product(
        action.productData.id,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.weight,
        action.productData.expirationDate
      );
      return {
        userProducts: state.userProducts.concat(newProduct),
      };
    case REMOVE_PRODUCT_FROM_USER:
      return {
        userProducts: state.userProducts.filter(
          product => product.id !== action.productId
        ),
      };
    default:
      return state;
  }
};

export default productsReducer;
