const USERS = "USERS";

const INITIAL_STATE = {
  users: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
