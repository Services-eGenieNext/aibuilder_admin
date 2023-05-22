import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Card, Spin } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { useHistory, Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";

const Forgot = () => {
  const { code } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);
  const [email, setEmail] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (code) {
      postApi({
        cbSuccess: (response) => {
          if (response) {
            setCodeVerified(true);
            setChangePassword(true);
            setLoading(false);
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
    }
  }, []);

  const onFinish = (values) => {
    if (!recaptcha) {
      showMessage("Please attempt captcha.", true);
      return false;
    }
    values.recaptcha = recaptcha;
    values.type = "forgot";
    setLoading(true);
    postApi({
      cbSuccess: (response) => {
        if (response) {
          setLoading(false);
          setCodeSent(true);
          showMessage("Change your password.");
        }
      },
      cbFailure: (err) => {
        console.log("err", err);
        if (err?.data?.message) {
          showMessage(err?.data?.message, true);
        } else {
          showMessage("Something went wrong!", true);
        }
        setLoading(false);
      },
      url: "send_code",
      guarded: false,
      value: values,
    });
  };

  const onChangePassword = (values) => {
    values.type = "forgot";
    values.code = code;
    setLoading(true);
    postApi({
      cbSuccess: (response) => {
        if (response) {
          setLoading(false);
          showMessage("Password has been changed.");
          history.push("/login");
        }
      },
      cbFailure: (err) => {
        setLoading(false);
        showMessage(err?.data?.detail, true);
        history.push("/login");
      },
      url: "change_password",
      guarded: false,
      value: values,
    });
  };

  const onCaptchaChange = (value) => {
    setRecaptcha(value);
  };

  return (
    <>
      {/* <Row justify="center">
        <Col xs={8} className="login-box"> */}
      <Card className="login-card">
        <h2 className="login-header-text">AI Panel</h2>
        <h4 style={{ textAlign: "center" }}>Forgot Password</h4>
        {changePassword ? (
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ code: code }}
            onFinish={onChangePassword}
            autoComplete="off"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              rules={[
                {
                  required: true,
                  message: "Please input your confirm password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Row>
              <Col xs={12}>
                <div>
                  Don't have an account? So{" "}
                  <Link to={`register`}>create new</Link>.
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
                    Change Password
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : !codeVerified && code ? (
          <Spin size="large" />
        ) : (
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email or username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="E-mail or Username"
              />
            </Form.Item>

            <Row style={{ marginBottom: 10 }}>
              <Col xs={24}>
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={onCaptchaChange}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <div>
                  Don't have an account? So{" "}
                  <Link to={`/register`}>create new</Link>.
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
                    Send Code
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        {codeSent && (
          <Row>
            <Col xs={24}>
              <h4>
                Link has been sent. If you face any issue, please contact to
                Admin.
              </h4>
            </Col>
          </Row>
        )}
      </Card>
      {/* </Col>
      </Row> */}
    </>
  );
};

export default Forgot;
