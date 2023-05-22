import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Card, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { postApi } from "../../../services/postApi";
import { showMessage } from "../../../util/showMessage";
import { countriesList } from "../../../util/helper";

const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [recaptcha, setRecaptcha] = useState(null);
  const [disableResend, setDisableResend] = useState(true);
  const [counterNumber, setCounterNumber] = useState(60);

  useEffect(() => {
    if (disableResend && counterNumber === 60) {
      setCounterNumber(60);
      var counter = 60;
      var x = setInterval(function () {
        counter = counter - 1;
        setCounterNumber(counter);
        if (counter === -1) {
          clearInterval(x);
          setDisableResend(false);
        }
      }, 1000);
    }
  }, [disableResend]);

  const onFinish = (values) => {
    if (!recaptcha) {
      showMessage("Please attempt captcha.", true);
      return false;
    }
    setLoading(true);
    values.recaptcha = recaptcha;
    postApi({
      cbSuccess: (response) => {
        if (response.user) {
          setCreatedUser(response.user);
          setLoading(false);
          setLinkSent(true);
          showMessage("Register successful, verification link has been sent.");
          setRecaptcha(null);
          setDisableResend(true);
        }
      },
      cbFailure: (err) => {
        setLoading(false);
        if (err && err?.data?.errors) {
          const errors = err?.data?.errors;
          const errorKeys = Object.keys(errors);
          const firstError = `${errors[errorKeys[0]][0]} [${errorKeys[0]}]`;
          showMessage(firstError, true);
        } else {
          showMessage(err?.data?.detail, true);
        }
      },
      url: "register",
      guarded: false,
      value: values,
    });
  };

  const resend = () => {
    setResendLoading(true);
    postApi({
      cbSuccess: (response) => {
        if (response) {
          setResendLoading(false);
          showMessage("Resend link has been sent.");
          setDisableResend(true);
          setCounterNumber(60);
        }
      },
      cbFailure: (err) => {
        setResendLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: "send_code",
      guarded: false,
      value: { email: createdUser.email, type: "resend" },
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
        <h2 className="login-header-text">Create New Account</h2>

        {linkSent ? (
          <>
            <Row justify="center">
              <Col xs={24} className="link-sent-box">
                <h3>Verification link has been sent to your email.</h3>
                <p>
                  Not received yet?{" "}
                  {counterNumber > -1 ? (
                    <span style={{ paddingLeft: 10, paddingRight: 10 }}>
                      {counterNumber}
                    </span>
                  ) : (
                    ""
                  )}
                  <Button
                    type="default"
                    onClick={resend}
                    loading={resendLoading}
                    disabled={disableResend}
                  >
                    Resend
                  </Button>
                </p>
              </Col>
            </Row>
          </>
        ) : (
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
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="E-mail" />
            </Form.Item>

            <Form.Item
              name="country"
              rules={[
                { required: true, message: "Please input your country name!" },
              ]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {countriesList.map((country) => {
                  return <Option value={country.code}>{country.name}</Option>;
                })}
              </Select>
            </Form.Item>

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
                  Do you already have an account? So{" "}
                  <Link to={`/login`}>log in here</Link>.
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
                    Register
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
      {/* </Col>
      </Row> */}
    </>
  );
};

export default Register;
