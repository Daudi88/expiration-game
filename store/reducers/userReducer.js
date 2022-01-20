import {
  MANAGE_POINTS,
  ADD_USER_ID,
  TRY_AUTO_LOGIN,
  SET_USER,
} from "../actions/userActions";

const initialState = {
  userId: null,
  tryAutoLogin: false,
  username: "",
  points: 0,
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
    case SET_USER:
      return {
        ...state,
        username: action.user.username,
        points: action.user.points,
      };
    case MANAGE_POINTS:
      return {
        ...state,
        points: action.points,
      };
    default:
      return state;
  }
};

export default userReducer;
