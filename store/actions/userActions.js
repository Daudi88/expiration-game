import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../data/firebase-config";

export const ADD_USER_ID = "ADD_USER_ID";
export const TRY_AUTO_LOGIN = "TRY_AUTO_LOGIN";
export const SET_USER = "SET_USER";
export const MANAGE_POINTS = "MANAGE_POINTS";

export const addUserId = id => {
  return { type: ADD_USER_ID, userId: id };
};

export const tryAutoLogin = () => {
  return { type: TRY_AUTO_LOGIN };
};

export const fetchUser = userId => {
  return async dispatch => {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      dispatch({
        type: SET_USER,
        user: { username: data.username, points: data.points },
      });
    }
  };
};

export const managePoints = (userId, points) => {
  return async dispatch => {
    try {
      await updateDoc(doc(db, "users", userId), {
        points: points,
      });
      dispatch({ type: MANAGE_POINTS, points: points });
    } catch (error) {
      throw new Error(error);
    }
  };
};
