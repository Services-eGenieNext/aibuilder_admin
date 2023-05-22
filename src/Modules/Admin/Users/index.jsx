import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button, Row, Col, Table, Card, Input } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../../Layout/MainLayout";
import { getApi } from "../../../services/getApi";
import WithAuth from "../../../Middleware/WithAuth";
import { logout } from "../../../redux/actions/common";
import OnlyAdmin from "../../../Middleware/OnlyAdmin";

const Users = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const usersRef = useRef(allUsers);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (last_login) =>
        last_login && moment(last_login).format("DD-MM-YYYY hh:mm:ss"),
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      key: "date_joined",
      render: (date_joined) =>
        moment(date_joined).format("DD-MM-YYYY hh:mm:ss"),
    },
    {
      title: "Parents",
      dataIndex: "parents",
      key: "parents",
    },
    {
      title: "Admin",
      dataIndex: "is_admin",
      key: "is_admin",
    },
    {
      title: "SU",
      dataIndex: "is_superuser",
      key: "is_superuser",
      render: (is_superuser) => (is_superuser == 1 ? "Yes" : "No"),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <>
          {/* <Button
            title="Edit"
            icon={<EditOutlined />}
            onClick={() =>
              openInNewTab(
                `${process.env.REACT_APP_BACKEND}/auth/user/${id}/change`
              )
            }
          /> */}
          <Button
            title="View"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/admin/user-detail/${id}`)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    getApi({
      cbSuccess: (response) => {
        if (response) {
          setAllUsers(response);
          usersRef.current = response;
          dispatch({
            type: "USERS",
            payload: response,
          });
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
      url: "users",
      value: null,
    });
  }, []);

  const onSearch = (value) => {
    const oldList = usersRef.current;
    if (value.target.value.length > 0) {
      var filteredArray = allUsers.filter(function (itm) {
        return (
          itm.email.indexOf(value.target.value) >= 0 ||
          itm.first_name.indexOf(value.target.value) >= 0 ||
          itm.username.indexOf(value.target.value) >= 0 ||
          itm.last_name.indexOf(value.target.value) >= 0
        );
      });
      setAllUsers(filteredArray);
    } else {
      setAllUsers(oldList);
    }
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <OnlyAdmin>
            <Row>
              <Col xs={24} className="mt-20">
                <Card title="Users">
                  <Input
                    placeholder="search..."
                    onChange={onSearch}
                    style={{
                      marginBottom: 10,
                    }}
                  />
                  <Table
                    columns={columns}
                    dataSource={allUsers}
                    loading={isLoading}
                  />
                </Card>
              </Col>
            </Row>
          </OnlyAdmin>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Users;
