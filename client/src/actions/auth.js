import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  // try {
  //   const res = await api.post('/users', formData);

  //   dispatch({
  //     type: REGISTER_SUCCESS,
  //     payload: res.data
  //   });
  //   dispatch(loadUser());
  // } catch (err) {
  //   const errors = err.response.data.errors;

  //   if (errors) {
  //     errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
  //   }

  //   dispatch({
  //     type: REGISTER_FAIL
  //   });
  // }
};

// Register User
export const googleRegister = (formData) => async (dispatch) => {
  try {
    const {name, email} = formData;
    console.log("google : ", name, " : ", email);
    const res = await api.post('/google', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const googleLogin = (formData) => async (dispatch) => {
  try {
    const { email } = formData;
    console.log("google : ", email);
    const res = await api.post('/google/login', formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
}

// Login User
export const login = (email, password) => async (dispatch) => {
  // const body = { email, password };

  // try {
  //   const res = await api.post('/auth', body);

  //   dispatch({
  //     type: LOGIN_SUCCESS,
  //     payload: res.data
  //   });

  //   dispatch(loadUser());
  // } catch (err) {
  //   const errors = err.response.data.errors;

  //   if (errors) {
  //     errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
  //   }

  //   dispatch({
  //     type: LOGIN_FAIL
  //   });
  // }
};

// Logout
export const logout = () => ({ type: LOGOUT });
