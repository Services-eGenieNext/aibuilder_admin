import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Button,
  Row,
  Col,
  Table,
  Card,
  Input,
  Modal,
  Form,
  Checkbox,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";

const Orders = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const usersRef = useRef(allUsers);
  const [allRecords, setAllRecords] = useState([]);

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Payment Via",
      dataIndex: "payment_via",
      key: "payment_via",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Installments",
      dataIndex: "total_installments",
      key: "total_installments",
    },
    {
      title: "Installment Duration",
      dataIndex: "installment_duration_type",
      key: "installment_duration_type",
    },
    {
      title: "Dated",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt && moment(createdAt).format("DD-MM-YYYY hh:mm:ss"),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <>
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
          setAllRecords(response);
          usersRef.current = response;
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
      url: "orders",
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
          <Row>
            <Col xs={24} className="mt-20">
              <Card title="Orders">
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
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Orders;
