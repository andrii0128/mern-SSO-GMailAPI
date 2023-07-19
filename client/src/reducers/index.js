import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import wait from './wait';
import email from './email';

export default combineReducers({
  alert,
  auth,
  wait,
  email,
});
