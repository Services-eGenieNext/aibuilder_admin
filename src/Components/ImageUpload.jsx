import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Upload, message, Button } from "antd";
import { useState } from "react";
const ImageUpload = ({ setImage }) => {
  const [imageState, setImageState] = useState([]);
  const props = {
    name: "file",
    action: "https://builderapi.dfysaas.com/image-upload/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        const images = imageState;
        console.log("info.file.response.url : ", info.file.response.url);
        setImage(info.file.response.url);
        images.push(info.file.response.url);

        setImageState(images);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};
export default ImageUpload;
