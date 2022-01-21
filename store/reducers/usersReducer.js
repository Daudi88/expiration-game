import {
  MANAGE_POINTS,
  ADD_USER_ID,
  TRY_AUTO_LOGIN,
  SET_USERS,
} from "../actions/usersActions";

const initialState = {
  userId: null,
  tryAutoLogin: false,
  currentUser: {},
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
