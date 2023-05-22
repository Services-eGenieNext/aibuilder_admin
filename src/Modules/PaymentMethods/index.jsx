import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button, Row, Col, Table, Card, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";

const PaymentMethods = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [allRecords, setAllRecords] = useState([]);
  const recordsRef = useRef(allRecords);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
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
          recordsRef.current = response;
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
      url: "payment-methods",
      value: null,
    });
  }, []);

  const onSearch = (value) => {
    const oldList = recordsRef.current;
    if (value.target.value.length > 0) {
      var filteredArray = allRecords.filter(function (itm) {
        return (
          itm.email.indexOf(value.target.value) >= 0 ||
          itm.first_name.indexOf(value.target.value) >= 0 ||
          itm.username.indexOf(value.target.value) >= 0 ||
          itm.last_name.indexOf(value.target.value) >= 0
        );
      });
      setAllRecords(filteredArray);
    } else {
      setAllRecords(oldList);
    }
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Row>
            <Col xs={24} className="mt-20">
              <Card title="Payment Methods">
                <Input
                  placeholder="search..."
                  onChange={onSearch}
                  style={{
                    marginBottom: 10,
                  }}
                />
                <Table
                  columns={columns}
                  dataSource={allRecords}
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

export default PaymentMethods;
