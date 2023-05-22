import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Card, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";

const { Option } = Select;

const Login = () => {
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
      url: "users/token",
      guarded: false,
      value: values,
    });
  };

  const onChangeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* <Row justify="center">
        <Col xs={8} className="login-box"> */}
      <Card className="login-card">
        <h2 className="login-header-text">Login</h2>

        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or e-mail" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Row>
            <Col xs={12}>
              <div>
                <Link to={`forgot`}>{t("Forgot your password?")}</Link>
              </div>
              <div>
                <Link to={`register`}>{t("Create an account")}</Link>
              </div>
            </Col>
            <Col xs={12}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="cus-large-btn"
                >
                  {t("Login")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      {/* </Col>
      </Row> */}
    </>
  );
};

export default Login;
