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
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import { postApi } from "../../services/postApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";
import { showMessage } from "../../util/showMessage";
import { patchApi } from "../../services/patchApi";
import { deleteApi } from "../../services/deleteApi";

const Categories = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [features, setFeatures] = useState([]);
  const recordsRef = useRef(allRecords);
  const [newRecordAdded, setNewRecordAdded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateState, setUpdateState] = useState({ name: "" });
  const [form] = useForm();

  const columns = [
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
          <Button
            type="primary"
            onClick={(e) => {
              setUpdateState(allRecords[ObjectSearchForUpdate(id)]);
              form.setFieldsValue({
                name: allRecords[ObjectSearchForUpdate(id)]["name"],
              });
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <span style={{ paddingLeft: "10px" }}>
            <Button type="primary" onClick={() => onDelete(id)}>
              Delete
            </Button>
          </span>
        </>
      ),
    },
  ];
  const onDelete = (id) => {
    console.log("id :", id);
    setLoading(true);
    deleteApi({
      cbSuccess: (response) => {
        console.log("Response : ", response);
        setLoading(false);
        showMessage("Record delete");
        setNewRecordAdded(!newRecordAdded);
      },
      cbFailure: (err) => {
        setLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: `categories/${id}`,
      guarded: false,
      value: id,
    });
  };

  const UpdateState = () => {
    updateState.name = form.getFieldsValue().name;
    setLoading(true);
    patchApi({
      cbSuccess: (response) => {
        setLoading(false);
        showMessage("Record created");
        setIsModalOpen(false);
        setNewRecordAdded(!newRecordAdded);
      },
      cbFailure: (err) => {
        setLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: `categories/${updateState.id}`,
      guarded: false,
      value: updateState,
    });
    form.setFieldsValue({
      name: "",
    });
  };
  const ObjectSearchForUpdate = (id) => {
    for (let i = 0; i < allRecords?.length; ++i) {
      if (allRecords[i]["id"] === id) {
        return i;
      }
    }
    return;
  };

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
      url: "categories",
      value: null,
    });
  }, [newRecordAdded]);

  const onSearch = (value) => {
    const oldList = recordsRef.current;
    if (value.target.value.length > 0) {
      var filteredArray = allRecords.filter(function (itm) {
        return itm.name.indexOf(value.target.value) >= 0;
      });
      setAllRecords(filteredArray);
    } else {
      setAllRecords(oldList);
    }
  };

  const onFinish = (values) => {
    if (updateState?.name) {
      UpdateState();
      return;
    }
    setLoading(true);
    postApi({
      cbSuccess: (response) => {
        setLoading(false);
        showMessage("Record created");
        setIsModalOpen(false);
        setNewRecordAdded(!newRecordAdded);
      },
      cbFailure: (err) => {
        setLoading(false);
        showMessage(err?.data?.detail, true);
      },
      url: "categories",
      guarded: false,
      value: values,
    });
    form.setFieldsValue({
      name: "",
    });
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Modal
            title="Add Category"
            open={isModalOpen}
            footer={null}
            onCancel={() => {
              form.setFieldsValue({
                name: "",
              });
              setIsModalOpen(false);
            }}
          >
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Row>
            <Col xs={24} className="mt-20">
              <Card
                title="Categories"
                extra={
                  <Button
                    onClick={() => {
                      setUpdateState({ name: "" });
                      setIsModalOpen(true);
                    }}
                  >
                    Add Category
                  </Button>
                }
              >
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

export default Categories;
