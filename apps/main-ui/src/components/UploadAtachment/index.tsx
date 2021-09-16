import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { SFC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IAttachment } from "../../modal";
import { NodeBaseURL } from "./../../utils/http";

interface IProps {
  onUploadSuccess?: (atachmentId: number) => void;
  defaultValue?: IAttachment;
}

export const UploadAtachment: SFC<IProps> = ({
  onUploadSuccess,
  defaultValue,
}) => {
  const [fileList, setFileList] = useState<any>([]);
  const { auth } = useGlobalContext();

  useEffect(() => {
    if (defaultValue) {
      let profilePicture = {
        uid: defaultValue.id,
        name: defaultValue.name,
        status: "done",
        url: defaultValue.path,
      };
      setFileList([{ ...profilePicture }]);
    }
  }, [defaultValue]);

  const onChange = useCallback(
    async ({ fileList: newFileList }) => {
      setFileList(newFileList);
      if (
        newFileList.length &&
        newFileList[0].response &&
        newFileList[0].response.attachment
      ) {
        const { id } = newFileList[0].response.attachment;
        onUploadSuccess(id);
      }
    },
    [onUploadSuccess]
  );

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <WrapperUploadAtachment>
      <ImgCrop rotate>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          method="POST"
          multiple={false}
          onRemove={() => {
            setFileList([]);
            onUploadSuccess(null);
          }}
          headers={{
            Authorization: `Bearer ${auth?.access_token}`,
          }}
          action={`${NodeBaseURL}/attachment`}
        >
          {fileList.length < 1 && "+ Upload"}
        </Upload>
      </ImgCrop>
    </WrapperUploadAtachment>
  );
};

const WrapperUploadAtachment = styled.div``;
