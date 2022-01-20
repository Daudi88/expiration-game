import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../data/firebase-config";
import Product from "../../models/product";

export const SET_PRODUCTS = "GET_PRODUCTS";
export const ADD_PRODUCT_TO_USER = "ADD_PRODUCT_TO_USER";
export const REMOVE_PRODUCT_FROM_USER = "REMOVE_PRODUCT_FROM_USER";

export const fetchProducts = userId => {
  return async dispatch => {
    const eanCodes = [];
    const productsData = [];
    const userProducts = [];
    const productIds = [];

    // Gets the ean codes for the user into an array.
    // Starts to build product objects based on the data.
    const eansSnapshot = await getDocs(
      collection(db, `users/${userId}/products`)
    );
    eansSnapshot.forEach(doc => {
      const docRes = doc.data();
      if (docRes.ean) {
        // make sure to only push unique ean codes.
        if (!eanCodes.includes(docRes.ean)) {
          eanCodes.push(docRes.ean);
        }
        productsData.push({
          id: doc.id,
          ean: docRes.ean,
          expirationDate: docRes.expirationDate,
        });
      } else {
        userProducts.push(
          new Product(doc.id, docRes.title, "", 0, docRes.expirationDate)
        );
      }
    });

    // Gets the product info for the ean codes.
    // Cross reference codes and initiate product items.
    // The every() part was found here https://masteringjs.io/tutorials/fundamentals/foreach-break
    if (eanCodes.length !== 0) {
      const productsRef = collection(db, "products");
      for (let i = 0; i < eanCodes.length; i += 10) {
        const q = query(
          productsRef,
          where("__name__", "in", eanCodes.slice(i, i + 10))
        );
        const productsSnapshot = await getDocs(q);
        productsSnapshot.forEach(doc => {
          const docRes = doc.data();

          // Since there can be more than one item with same ean code
          // a forEach is better than an every here.
          productsData.forEach(product => {
            if (product.ean === doc.id && !productIds.includes(product.id)) {
              productIds.push(product.id);
              userProducts.push(
                new Product(
                  product.id,
                  docRes.title,
                  docRes.imageUrl,
                  docRes.price,
                  product.expirationDate
                )
              );
            }
          });
        });
      }
    }

    dispatch({ type: SET_PRODUCTS, products: userProducts });
  };
};

export const addProductToUser = (
  userId,
  ean,
  title,
  imageUrl,
  price,
  expirationDate
) => {
  // Inspiration for this part comes from a combination of
  // https://www.udemy.com/course/react-native-the-practical-guide/learn/lecture/15675420#overview
  //  and https://firebase.google.com/docs/firestore/quickstart#web-version-9_2
  return async dispatch => {
    try {
      // If user scanned ean code or input name manually
      let docRef;
      if (ean !== "") {
        docRef = await addDoc(collection(db, `users/${userId}/products`), {
          ean,
          expirationDate,
        });
      } else {
        docRef = await addDoc(collection(db, userId), {
          title,
          expirationDate,
        });
      }

      dispatch({
        type: ADD_PRODUCT_TO_USER,
        productData: {
          id: docRef.id,
          title,
          imageUrl,
          price,
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
      console.log("delete me");
      await deleteDoc(doc(db, userId, productId));
      dispatch({ type: REMOVE_PRODUCT_FROM_USER, productId: productId });
    } catch (error) {
      console.log("something went wrong");
      throw new Error(error);
    }
  };
};
