import React, { useState } from "react";
import { LoginSocialGoogle } from "reactjs-social-login";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";
import moment from "moment";
import { Button } from "antd";

const REDIRECT_URI = "https://builderadmin.dfysaas.com";

const LoginWithGoogle = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    postApi({
      cbSuccess: (response) => {
        if (response.access) {
          dispatch({
            type: "TOKEN",
            payload: response.access,
          });
          localStorage.setItem("token", response.access);
          localStorage.setItem("refresh", response.refresh);
          const expiry = moment()
            .add(4, "minutes")
            .format("YYYY-MM-DD h:mm:ss");
          localStorage.setItem("expiry_time", expiry);
          setLoading(false);
          const cached = localStorage.getItem("cached_route");
          if (cached) {
            history.push(cached);
          } else {
            history.push("dashboard");
          }
          showMessage("Login successful");
        }
      },
      cbFailure: (err) => {
        setLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: "users/google",
      guarded: false,
      value: values,
    });
  };

  return (
    <>
      <LoginSocialGoogle
        client_id={process.env.REACT_APP_Google_APP_ID || ""}
        redirect_uri={REDIRECT_URI}
        onResolve={({ data }) => {
          onFinish({ access_token: data["access_token"] });
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <Button type="primary">Login with Google</Button>
      </LoginSocialGoogle>
    </>
  );
};

export default LoginWithGoogle;
