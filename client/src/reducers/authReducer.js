import {
    SET_CURRENT_USER,
    USER_LOADING
  } from "../actions/types";

  const isEmpty = require("is-empty");

  // define the initial state for "auth"
  const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
  };

  /**
   * Combined function for setting current user and setting user_loading
   * @param {State} state 
   * @param {string} action 
   * @returns new state
   */
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }