import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../data/firebase-config";
import Product from "../../models/product";

export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const ADD_PRODUCT_TO_USER = "ADD_PRODUCT_TO_USER";
export const REMOVE_PRODUCT_FROM_USER = "REMOVE_PRODUCT_FROM_USER";

/**
 * Fetches all products for the specific user and stores them in the Redux store
 * @param {*} userId
 * @returns
 */
export const fetchProducts = userId => {
  return async dispatch => {
    const userProducts = [];
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/products`)
    );
    querySnapshot.forEach(doc => {
      const docRes = doc.data();
      userProducts.push(
        new Product(
          doc.id,
          docRes.title,
          docRes.imageUrl,
          docRes.weight,
          docRes.expirationDate
        )
      );
    });

    dispatch({ type: FETCH_PRODUCTS, products: userProducts });
  };
};

/**
 * Adds a new product to a specific user and stores it in the Redux store.
 * @param {*} userId
 * @param {*} title
 * @param {*} imageUrl
 * @param {*} weight
 * @param {*} expirationDate
 * @returns
 */
export const addProductToUser = (
  userId,
  title,
  imageUrl,
  weight,
  expirationDate
) => {
  // Inspiration for this part comes from a combination of
  // https://www.udemy.com/course/react-native-the-practical-guide/learn/lecture/15675420#overview
  //  and https://firebase.google.com/docs/firestore/quickstart#web-version-9_2
  return async dispatch => {
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/products`), {
        title,
        imageUrl,
        weight,
        expirationDate,
      });

      dispatch({
        type: ADD_PRODUCT_TO_USER,
        productData: {
          id: docRef.id,
          title,
          imageUrl,
          weight,
          expirationDate,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };
};

/**
 * Removes a product from a specific user and updates the Redux store accordingly.
 * @param {*} userId
 * @param {*} productId
 * @returns
 */
export const removeProductFromUser = (userId, productId) => {
  return async dispatch => {
    try {
      await deleteDoc(doc(db, `users/${userId}/products`, productId));
      dispatch({ type: REMOVE_PRODUCT_FROM_USER, productId: productId });
    } catch (error) {
      throw new Error(error);
    }
  };
};
