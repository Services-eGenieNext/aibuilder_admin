const USER = "USER";
const TOKEN = "TOKEN";

const INITIAL_STATE = {
  user: null,
  token: null,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.payload,
      };

    case TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
