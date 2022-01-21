import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../data/firebase-config";
import Product from "../../models/product";

export const SET_PRODUCTS = "GET_PRODUCTS";
export const ADD_PRODUCT_TO_USER = "ADD_PRODUCT_TO_USER";
export const REMOVE_PRODUCT_FROM_USER = "REMOVE_PRODUCT_FROM_USER";

export const fetchProducts = userId => {
  console.log(userId);
  return async dispatch => {
    const userProducts = [];

    // Gets the ean codes for the user into an array.
    // Starts to build product objects based on the data.
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

    dispatch({ type: SET_PRODUCTS, products: userProducts });
  };
};

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

export const removeProductFromUser = (userId, productId) => {
  return async dispatch => {
    try {
      await deleteDoc(doc(db, userId, productId));
      dispatch({ type: REMOVE_PRODUCT_FROM_USER, productId: productId });
    } catch (error) {
      throw new Error(error);
    }
  };
};
