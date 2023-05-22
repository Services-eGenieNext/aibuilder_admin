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
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import { postApi } from "../../services/postApi";
import { deleteApi } from "../../services/deleteApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";
import { showMessage } from "../../util/showMessage";

const Templates = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [features, setFeatures] = useState([]);
  const [verticals, setVerticals] = useState([]);
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
      url: "templates",
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

          setFeatures(compile);
        }
      },
      cbFailure: (err) => {
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

          setVerticals(compile);
        }
      },
      cbFailure: (err) => {
        console.log("err", err);
        if (err.status === 401) {
          logout(dispatch);
          history.push("/login");
        }
      },
      url: "verticals",
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
      url: `templates/${id}`,
      guarded: false,
      value: id,
    });
  };
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

  const onFinish = async (values) => {
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
      url: "templates",
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
            title="Add Template"
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

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Vertical"
                name="vertical_id"
                rules={[{ required: true }]}
              >
                <Select
                  size={"middle"}
                  placeholder="Select Vertical"
                  style={{ width: "100%" }}
                  options={verticals}
                />
              </Form.Item>

              <Form.Item
                label="Features"
                name="features"
                rules={[{ required: true }]}
              >
                <Select
                  mode="tags"
                  size={"middle"}
                  placeholder="Select Feature"
                  style={{ width: "100%" }}
                  options={features}
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
                title="Templates"
                extra={
                  <Button onClick={() => setIsModalOpen(true)}>
                    Add Template
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

export default Templates;
