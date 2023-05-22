import { combineReducers } from "redux";

import appReducer from "./reducers/appReducer";
import usersReducer from "./reducers/usersReducer";

const rootReducer = combineReducers({
  app: appReducer,
  users: usersReducer,
});

export default rootReducer;
