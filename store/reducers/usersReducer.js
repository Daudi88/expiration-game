import { auth } from "../../data/firebase-config";
import {
  MANAGE_SCORE,
  ADD_USER_ID,
  TRY_AUTO_LOGIN,
  SET_USERS,
} from "../actions/usersActions";

const initialState = {
  userId: null,
  tryAutoLogin: false,
  users: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_ID:
      return {
        ...state,
        userId: action.userId,
        tryAutoLogin: true,
      };
    case TRY_AUTO_LOGIN:
      return {
        ...state,
        tryAutoLogin: true,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      };
    default:
      return state;
  }
};

export default userReducer;
