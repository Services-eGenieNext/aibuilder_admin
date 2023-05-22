import React, { useCallback, useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";
import moment from "moment";
import { Button } from "antd";

const REDIRECT_URI = "https://builderadmin.dfysaas.com";
const App = () => {
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
      url: "users/facebook",
      guarded: false,
      value: values,
    });
  };

  return (
    <>
      <LoginSocialFacebook
        appId={process.env.REACT_APP_FB_APP_ID || ""}
        fieldsProfile={
          "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
        }
        redirect_uri={REDIRECT_URI}
        onResolve={({ data }) => {
          onFinish({ access_token: data["accessToken"] });
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <Button type="primary">Login with Facebook</Button>
      </LoginSocialFacebook>
    </>
  );
};

export default App;
