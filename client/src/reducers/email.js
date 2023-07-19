import {
    SET_EMAIL
  } from '../actions/types';
  
  const initialState = {
    emails: []
  };
  
  function emailReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SET_EMAIL:
        return {
          ...state,
          emails: payload
        };
      default:
        return state;
    }
  }
  
  export default emailReducer;
  