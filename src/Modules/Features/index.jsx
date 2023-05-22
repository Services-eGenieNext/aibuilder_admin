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
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { deleteApi } from "../../services/deleteApi";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import { postApi } from "../../services/postApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";
import { showMessage } from "../../util/showMessage";

const { TextArea } = Input;

const Features = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const recordsRef = useRef(allRecords);
  const [newRecordAdded, setNewRecordAdded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imageState, setImageState] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);

  const columns = [
    {
      title: "Name",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          <span style={{ paddingLeft: "10px" }}>
            <Button type="primary" onClick={() => onDelete(id)}>
              Delete
            </Button>{" "}
          </span>
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
      url: "features",
      value: null,
    });

    getApi({
      cbSuccess: (response) => {
        if (response) {
          const compile = [];
          for (let index = 0; index < response.length; index++) {
            const element = response[index];
            compile.push({
              label: element.name,
              value: element.id,
            });
          }
          setCategories(compile);
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
      url: `features/${id}`,
      guarded: false,
      value: id,
    });
  };

  const onSearch = (value) => {
    const oldList = recordsRef.current;
    if (value.target.value.length > 0) {
      var filteredArray = allRecords.filter(function (itm) {
        return (
          itm.cost.toString().indexOf(value.target.value.toString()) >= 0 ||
          itm.name.indexOf(value.target.value) >= 0 ||
          itm.description.indexOf(value.target.value) >= 0
        );
      });
      setAllRecords(filteredArray);
    } else {
      setAllRecords(oldList);
    }
  };

  const onFinish = (values) => {
    values.images = imageState;
    values.mobileImages = mobileImages;

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
      url: "features",
      guarded: false,
      value: values,
    });
  };

  const props: UploadProps = {
    name: "file",
    action: "https://builderapi.dfysaas.com/image-upload/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        const images = imageState;

        images.push(info.file.response.url);
        setImageState(images);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const propsMobile: UploadProps = {
    name: "file",
    action: "http://localhost:3003/image-upload/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        const images = mobileImages;
        images.push(info.file.response.url);
        setMobileImages(images);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Modal
            title="Add Feature"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Cost" name="cost" rules={[{ required: true }]}>
                <InputNumber addonAfter="$" />
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

              <Form.Item
                label="Categories"
                name="category_id"
                rules={[{ required: true }]}
              >
                <Select
                  size={"middle"}
                  placeholder="Select Category"
                  style={{ width: "100%" }}
                  options={categories}
                />
              </Form.Item>

              <h3>Images for mobile</h3>

              <Upload {...propsMobile}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>

              <h3>Images for desktop</h3>

              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} placeholder="Description" />
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
                title="Features"
                extra={
                  <Button onClick={() => setIsModalOpen(true)}>
                    Add Feature
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

export default Features;
