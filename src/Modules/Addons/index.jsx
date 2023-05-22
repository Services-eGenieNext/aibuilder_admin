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
  Select,
  Space,
  Upload,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import { postApi } from "../../services/postApi";
import { deleteApi } from "../../services/deleteApi";

import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";
import { showMessage } from "../../util/showMessage";

const Addons = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const usersRef = useRef(allUsers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newRecordAdded, setNewRecordAdded] = useState(false);

  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
  });
  const [imageState, setImageState] = useState({
    fileList: [],
  });

  const props = {
    name: "file",
    action: "http://localhost:3003/addons/file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (value, obj) => `${value} ${obj.duration_type}`,
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      key: "date_joined",
      render: (date_joined) =>
        moment(date_joined).format("DD-MM-YYYY hh:mm:ss"),
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
          <span style={{ paddingLeft: "10px" }}>
            <Button type="primary" onClick={() => onDelete(id)}>
              Delete
            </Button>
          </span>
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
      url: "addons",
      value: null,
    });
  }, [newRecordAdded]);

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
      url: `addons/${id}`,
      guarded: false,
      value: id,
    });
  };

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

  const onFinish = async (values) => {
    let image = null;
    if (imageState.fileList.length > 0) {
      image = await getBase64(imageState.fileList[0]?.originFileObj);
    }

    values.image = image;
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
      url: "addons",
      guarded: false,
      value: values,
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChange = async ({ fileList }) => setImageState({ fileList });

  const handleCancel = () => setPreview({ previewVisible: false });

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Modal
            title="Add Addon"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
          >
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Tagline"
                name="tagline"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Duration Type"
                name="duration_type"
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "hours", label: "Hours" },
                    { value: "days", label: "Days" },
                    { value: "weeks", label: "Weeks" },
                    { value: "months", label: "Months" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Cost" name="cost" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <b>Features</b>

              <Form.List name="features">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ width: "100%" }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[{ required: true }]}
                        >
                          <Input
                            placeholder="Feture"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red" }}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Feature
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <hr />

              <Upload
                //{...props}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={imageState.fileList ?? []}
                onPreview={handlePreview}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>

              <hr />

              <Form.Item name="attach_users" valuePropName="checked">
                <Checkbox>Attach Users</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Row>
            <Col xs={24} className="mt-20">
              <Card
                title="Addons"
                extra={
                  <Button onClick={() => setIsModalOpen(true)}>
                    Add Addon
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

export default Addons;
