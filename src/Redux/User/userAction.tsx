import { userTypes } from "./userActionTypes";
import { Dispatch } from "redux";

interface LoginDetails {
  email: string;
  password: string;
}

const userLoginStart = () => ({
  type: userTypes.USER_LOGIN_START,
});

const userLoginSuccess = (data: any) => ({
  type: userTypes.USER_LOGIN_SUCCESS,
  payload: data,
});

const userLoginFailed = (message: string) => ({
  type: userTypes.USER_LOGIN_FAILED,
  payload: message,
});

export const userLogin = (userDetails: LoginDetails) => async (dispatch: Dispatch): Promise<void> => {
  try {
    dispatch(userLoginStart());
    const res = await fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    const data = await res.json();
    if (res.status === 401) {
      console.log(data.message);
      dispatch(userLoginFailed(data.message));
    } else {
      dispatch(userLoginSuccess(data));
    }
  } catch (err) {
    dispatch(userLoginFailed(""));
  }
};

//logout
const logoutSuccess = (message: string) => ({
  type: userTypes.LOGOUT_SUCCESS,
  payload: message
})

export const logout = (token: string) => async (dispatch: Dispatch) => {
  try {
    const res = await fetch('http://localhost:8000/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 200) {
      dispatch(logoutSuccess(data.message));
      dispatch(userLoginFailed(data.message));
    } else {
      dispatch(userLoginSuccess(data));
    }
  } catch (err) {
    dispatch(userLoginFailed(""));
  }
};