import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button, Row, Col, Table, Card, Input, Tabs, Form } from "antd";
import { EditOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import MainLayout from "../../../Layout/MainLayout";
import { getApi } from "../../../services/getApi";
import WithAuth from "../../../Middleware/WithAuth";
import { logout } from "../../../redux/actions/common";
import OnlyAdmin from "../../../Middleware/OnlyAdmin";
import { openInNewTab } from "../../../util/helper";

const UserDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { paramId } = useParams();
  const user = useSelector((state) => state.app.user);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const usersRef = useRef(allUsers);
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    getApi({
      cbSuccess: (response) => {
        if (response) {
          console.log("response", response);
          setUserSettings(response);
        }
        setIsLoading(false);
      },
      cbFailure: (err) => {
        setIsLoading(false);
        console.log("err", err);
        if (err.status === 401) {
          logout(dispatch);
          history.push("/login");
        }
      },
      url: `users/${paramId}`,
      value: null,
    });
  }, []);

  return (
    <>
      <MainLayout>
        <WithAuth>
          <OnlyAdmin>
            <Row>
              <Col xs={24} className="mt-20">
                <Card title="User Detail">
                  <Row gutter={8}>
                    <Col xs={12}>
                      <strong>Email: </strong>
                      {userSettings?.email}
                    </Col>
                    <Col xs={12}>
                      <strong>Username: </strong>
                      {userSettings?.username}
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </OnlyAdmin>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default UserDetail;
