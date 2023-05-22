import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";

const Verify = () => {
  const { code } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (code) {
      postApi({
        cbSuccess: (response) => {
          if (response) {
            setLoading(false);
            showMessage("Verification has been done");
            history.push("/login");
          }
        },
        cbFailure: (err) => {
          setLoading(false);
          showMessage(err?.data?.detail, true);
          history.push("/login");
        },
        url: "verify",
        guarded: false,
        value: { code },
      });
    } else {
      setLoading(false);
      showMessage("Invalid verification", true);
      history.push("/login");
    }
  }, []);

  if (loading) {
    return (
      <>
        <div
          style={{
            margin: "0 auto",
          }}
        >
          <Spin size="large" />
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default Verify;
