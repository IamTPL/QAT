import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";
import UploadFile from "../UploadFile";
import "./ModalUploadStyle.css";
import { Button } from "antd";

const ModalUpload = ({ onClose, typeOfDoc }) => {
  const [isCancelDisabled, setIsCancelDisabled] = useState(false);
  const [isOkDisabled, setIsOkDisabled] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleOk = async () => {
    setIsClosing(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    onClose(true);
  };

  const handleCancel = async () => {
    if (!isCancelDisabled) {
      setIsClosing(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      onClose(isOkDisabled ? false : true);
    }
  };

  return (
    <Modal
      title="Upload files"
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      width={"50vw"}
      centered
      maskClosable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      footer={
        !isOkDisabled && (
          <Button
            onClick={handleOk}
            type="primary"
            className="text-orange-400 border-2 border-orange-400 bg-white uppercase font-bold"
          >
            Ok
          </Button>
        )
      }
    >
      <UploadFile
        setIsCancelDisabled={setIsCancelDisabled}
        setIsOkDisabled={setIsOkDisabled}
        typeOfDoc={typeOfDoc}
        isClosing={isClosing}
      ></UploadFile>
    </Modal>
  );
};

export default ModalUpload;
