import React, { useState, useCallback } from "react";
import { LoginSocialLinkedin } from "reactjs-social-login";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";
import { Button } from "antd";

function LoginWithLinked() {
  const REDIRECT_URI = "https://builderadmin.dfysaas.com";

  const { t, i18n } = useTranslation();
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
        console.log("error : ", err);
        setLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: "users/linkedin",
      guarded: false,
      value: values,
    });
  };

  const onChangeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };
  return (
    <LoginSocialLinkedin
      client_id={process.env.REACT_APP_LINKEDIN_APP_ID}
      client_secret={process.env.REACT_APP_LINKEDIN_APP_SECRET || ""}
      redirect_uri={REDIRECT_URI}
      onResolve={({ data }) => {
        onFinish({ access_token: data?.access_token });
      }}
      onReject={(err) => {
        showMessage("Failed to proceed", true);
      }}
    >
      <Button type="primary">Login with Linkdedin</Button>
    </LoginSocialLinkedin>
  );
}

export default LoginWithLinked;
