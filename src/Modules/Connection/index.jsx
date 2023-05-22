import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Switch, Button, Typography } from "antd";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";
import { openInNewTab } from "../../util/helper";
import { postApi } from "../../services/postApi";
import { showMessage } from "../../util/showMessage";

const Connection = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const igCode = params?.get("code");
  const [loading, setLoading] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  console.log("callbackcode: ", params?.get("code"));

  useEffect(() => {
    if (igCode) {
      setLoading(true);
      postApi({
        cbSuccess: (response) => {
          if (response) {
            setLoading(false);
            showMessage(response.message);
          }
        },
        cbFailure: (err) => {
          setLoading(false);
          showMessage(err?.data?.detail, true);
        },
        url: "save_ig_token",
        guarded: true,
        value: { code: igCode },
      });
    }
  }, [igCode]);

  const onConnect = () => {
    const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/instapp/auth&scope=user_profile,user_media&response_type=code`;
    openInNewTab(redirectUrl);
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Card title="Instagram Connection">
            {loading ? (
              "Loading..."
            ) : (
              <Button type="primary" onClick={onConnect}>
                Connect Instagram Profile
              </Button>
            )}
          </Card>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Connection;
