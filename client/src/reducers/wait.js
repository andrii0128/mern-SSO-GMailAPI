import {
    WAITING
  } from '../actions/types';
  
  const initialState = {
    waiting: false
  };
  
  function waitReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case WAITING:
        return {
          ...state,
          waiting: payload
        };
      default:
        return state;
    }
  }
  
  export default waitReducer;
  