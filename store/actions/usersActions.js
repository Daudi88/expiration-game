import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase-config";
import User from "../../models/user";

export const ADD_USER_ID = "ADD_USER_ID";
export const TRY_AUTO_LOGIN = "TRY_AUTO_LOGIN";
export const SET_USERS = "SET_USERS";

export const addUserId = id => {
  return { type: ADD_USER_ID, userId: id };
};

export const tryAutoLogin = () => {
  return { type: TRY_AUTO_LOGIN };
};

export const fetchUsers = () => {
  return async dispatch => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach(doc => {
      const user = doc.data();
      users.push(new User(doc.id, user.username, user.score));
    });

    dispatch({ type: SET_USERS, users: users });
  };
};
