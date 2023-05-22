import React from "react";
import { Button, Modal, Spin, Form } from "antd";

//servico/1/change/

const ConfirmModal = ({ message, callback }) => {
  return (
    <>
      <Modal
        title="Confirm"
        visible={true}
        onOk={() => callback(true)}
        onCancel={() => callback(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>{message}</p>
      </Modal>
    </>
  );
};

export default ConfirmModal;
