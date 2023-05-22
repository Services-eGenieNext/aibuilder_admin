// HOC/withAuth.jsx
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getApi } from "../services/getApi";
import { logout, getUsers } from "../redux/actions/common";
import { showMessage } from "../util/showMessage";

const WithAuth = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const accessToken = localStorage.getItem("token");
      if (!accessToken || accessToken === "null") {
        localStorage.clear();
        history.push("/");
      } else {
        if (accessToken !== "null") {
          getApi({
            cbSuccess: (response) => {
              dispatch({
                type: "USER",
                payload: response,
              });
              setLoading(false);
            },
            cbFailure: (err) => {
              console.log("err", err);
              if (err?.status === 401 || err?.status === 403) {
                logout(dispatch);
                history.push("/login");
              } else if (err?.status === 403) {
                logout(dispatch);
                const msg = "Please verify your email account."; //err?.data?.detail
                showMessage(msg, true);
                history.push("/login");
              }
            },
            url: `users/${accessToken}`,
            value: null,
          });

          getUsers(dispatch);
        } else {
          setLoading(false);
          localStorage.clear();
          history.push("/");
        }
      }
    })();
  }, []);
  if (loading) {
    return (
      <>
        <div className="spinner">
          <Spin size="large" />
        </div>
      </>
    );
  } else {
    return <>{props.children}</>;
  }
};

export default WithAuth;
