import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Spin, Progress } from 'antd';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { CodeOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }

  .ant-modal-header {
    margin-bottom: 8px;
  }

  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .json-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 12px;
    min-height: 300px;
  }

  .ant-input.json-input::placeholder {
    color: #999999 !important;
  }

  .ant-input.json-input::-webkit-input-placeholder {
    color: #999999 !important;
  }

  .ant-input.json-input:-moz-placeholder {
    color: #999999 !important;
  }

  .ant-input.json-input::-moz-placeholder {
    color: #999999 !important;
  }

  .ant-input.json-input:-ms-input-placeholder {
    color: #999999 !important;
  }
`;

const CreateProductJsonModal = ({ visible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 130);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleOk = async () => {
    try {
      setLoading(true);
      // 验证 JSON 格式
      JSON.parse(jsonContent);
      
      // 发送请求
      await api.post('/manage/user-product/create-json', jsonContent, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      message.success(t('createSuccess'));
      setJsonContent('');
      onSuccess?.();
      onCancel();
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error(t('invalidJson'));
      } else {
        message.error(t('createFailed'));
      }
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <StyledModal
      title={<><CodeOutlined /> {t('createProductWithJson')}</>}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      okText={t('create')}
      cancelText={t('cancel')}
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <Input.TextArea
          className="json-input"
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder={`{
  "userId": 1,
  "productName": "示例商品",
  "productDescription": "商品描述",
  "price": 99.99,
  "originalPrice": 199.99,
  "currencyCode": "CNY",
  "stock": 100,
  "category": "电脑",
  "countryCode": "CN",
  "city": "深圳市",
  "imageCover": "https://example.com/image.jpg",
  "imageList": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}`}
        />
        {loading && <Progress percent={progress} status="active" />}
      </Spin>
    </StyledModal>
  );
};

export default CreateProductJsonModal;
