import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../data/firebase-config";
import User from "../../models/user";

export const ADD_USER_ID = "ADD_USER_ID";
export const TRY_AUTO_LOGIN = "TRY_AUTO_LOGIN";
export const SET_USERS = "SET_USERS";
export const MANAGE_POINTS = "MANAGE_POINTS";

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
      users.push(new User(doc.id, user.username, user.points));
    });

    dispatch({ type: SET_USERS, users: users });
  };
};

export const managePoints = points => {
  return async dispatch => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        points: points,
      });
      dispatch({ type: MANAGE_POINTS, points: points });
    } catch (error) {
      throw new Error(error);
    }
  };
};
