import { userTypes } from "./userActionTypes";

export interface UserState {
  userDetails: any;
  isLoading: boolean;
  message: string;
  isSignedIn: boolean;
  isRegSuccessful: boolean;
  user: any;
  users: any[];
}

const initialState: UserState = {
  userDetails: {},
  isLoading: false,
  message: "",
  isSignedIn: false,
  isRegSuccessful: false,
  user: {},
  users: [],
};

export type UserAction = {
  type: string;
  payload: any; // You can replace "any" with specific types for each action if possible
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  switch (action.type) {
    case userTypes.USER_LOGIN_START:
      return {
        ...state,
        isLoading: true,
        message: "",
      };
    case userTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSignedIn: true,
        userDetails: action.payload,
        isRegSuccessful: false,
      };
    case userTypes.USER_LOGIN_FAILED:
      return {
        ...state,
        isLoading: false,
        message: action.payload,
        isSignedIn: false,
        userDetails: {},
      };
      case userTypes.LOGOUT_SUCCESS: 
        return {
          ...state, isSignedIn: false, isLoading: false, userDetails: {}
        }
    default:
      return state;
  }
};
