import { showMessage } from "../../util/showMessage";
import { getApi } from "../../services/getApi";

export const logout = (dispatch) => {
  localStorage.removeItem("token");
  dispatch({
    type: "TOKEN",
    payload: null,
  });
  showMessage("Login session expired!", true);
};

export const getUsers = (dispatch) => {
  dispatch({
    type: "TOKEN",
    payload: null,
  });

  getApi({
    cbSuccess: (response) => {
      if (response) {
        dispatch({
          type: "USERS",
          payload: response,
        });
      }
    },
    cbFailure: (err) => {
      console.log("err", err);
    },
    url: "users",
    value: null,
  });
};
