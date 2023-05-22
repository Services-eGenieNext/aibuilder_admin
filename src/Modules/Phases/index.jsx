import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button, Row, Col, Table, Card, Input, Modal, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { getApi } from "../../services/getApi";
import { postApi } from "../../services/postApi";
import WithAuth from "../../Middleware/WithAuth";
import { logout } from "../../redux/actions/common";
import { showMessage } from "../../util/showMessage";
import ImageUpload from "../../Components/ImageUpload";
// import type { UploadProps } from "antd";
import { patchApi } from "../../services/patchApi";
import { deleteApi } from "../../services/deleteApi";

const Phases = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const recordsRef = useRef(allRecords);
  const [newRecordAdded, setNewRecordAdded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState();
  const [updateState, setUpdateState] = useState({ name: "" });
  const [form] = useForm();

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
      url: "phases",
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
      url: `phases/${id}`,
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

  const UpdateState = () => {
    if (image) {
      updateState.image = image;
    }
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
      url: `phases/${updateState.id}`,
      guarded: false,
      value: updateState,
    });
    form.setFieldsValue({
      name: "",
    });
  };
  const onFinish = (values) => {
    if (updateState?.name) {
      UpdateState();
      return;
    }
    if (!image) {
      showMessage("Insert an Image", true);
      return;
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
      url: "phases",
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
            title="Add Phase"
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
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mt-20">
                <ImageUpload setImage={setImage} />
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
                title="Phases"
                extra={
                  <>
                    <Button
                      onClick={() => {
                        setUpdateState({ name: "" });
                        setIsModalOpen(true);
                      }}
                    >
                      Add Phase
                    </Button>
                  </>
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

export default Phases;
