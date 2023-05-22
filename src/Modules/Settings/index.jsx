import React, { useEffect, useState } from "react";
import { Button, Row, Col, Card, Input, Tabs, Form } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";
import { showMessage } from "../../util/showMessage";
import { postApi } from "../../services/postApi";

const Settings = () => {
  const history = useHistory();
  const user = useSelector((state) => state.app.user);
  const [changeInfoLoading, setChangeInfoLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [userSettings, setUserSettings] = useState(user);

  useEffect(() => {
    setUserSettings(user);
  }, [user]);

  const changeInfo = () => {};

  const changePassword = (values) => {
    if (values.password !== values.confirm_password) {
      showMessage("Both passwords should be matched", true);
      return false;
    }
    setPasswordLoading(true);
    postApi({
      cbSuccess: (response) => {
        if (response) {
          setPasswordLoading(false);
          showMessage(response.message);
        }
      },
      cbFailure: (err) => {
        setPasswordLoading(false);
        showMessage(err?.data?.detail, true);
        history.push("/login");
      },
      url: "update_password",
      guarded: true,
      value: values,
    });
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Row>
            <Col xs={24} className="mt-20">
              <Card title="Update Profile">
                <Tabs>
                  <Tabs.TabPane tab="Edit Info" key="item-1">
                    <Form
                      name="basic"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValues={{
                        email: userSettings?.email,
                        username: userSettings?.username,
                      }}
                      onFinish={changeInfo}
                      autoComplete="off"
                    >
                      <Form.Item
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Username"
                          disabled={true}
                        />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="E-mail"
                          disabled={true}
                        />
                      </Form.Item>

                      <Row>
                        <Col xs={12}>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={changeInfoLoading}
                              className="cus-large-btn"
                            >
                              Save
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Change Password" key="item-2">
                    <Form
                      name="changepassword"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValues={{}}
                      onFinish={changePassword}
                      autoComplete="off"
                    >
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
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
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={passwordLoading}
                              className="cus-large-btn"
                            >
                              Change Password
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Settings;
