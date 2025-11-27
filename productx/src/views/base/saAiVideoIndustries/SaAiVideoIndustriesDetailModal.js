import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Badge, Spin, Space, Tag, Image } from 'antd';
import {
  InfoCircleOutlined,
  GlobalOutlined,
  FileTextOutlined,
  PictureOutlined,
  StarOutlined,
  FireOutlined,
  FolderOutlined,
  ToolOutlined,
  BulbOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 12px;
    color: #000000;
    font-weight: 500;
  }

  .ant-descriptions-item-label {
    font-size: 10px;
    color: #666666;
    background-color: #fafafa;
    padding: 8px 12px !important;
  }

  .ant-descriptions-bordered .ant-descriptions-item-label {
    width: 100px;
  }

  .ant-tag {
    margin: 1px;
    font-size: 10px;
    line-height: 16px;
    height: 18px;
  }

  .description-icon {
    margin-right: 6px;
    color: #1890ff;
    font-size: 12px;
  }

  .ant-descriptions.ant-descriptions-small {
    .ant-descriptions-row > th,
    .ant-descriptions-row > td {
      padding: 8px 12px;
    }
  }
`;

const SaAiVideoIndustriesDetailModal = ({ isVisible, onCancel, industryId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [industryData, setIndustryData] = useState(null);

  useEffect(() => {
    if (isVisible && industryId) {
      fetchIndustryDetail();
    }
  }, [isVisible, industryId]);

  const fetchIndustryDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage/sa-ai-video-industries/get-by-id?id=${industryId}`);
      setIndustryData(response);
    } catch (error) {
      console.error('获取详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 解析 samplePrompts
  const parseSamplePrompts = (samplePrompts) => {
    if (!samplePrompts) return null;
    try {
      if (typeof samplePrompts === 'string') {
        return JSON.parse(samplePrompts);
      }
      return samplePrompts;
    } catch (e) {
      return samplePrompts;
    }
  };

  return (
    <StyledModal
      title={
        <Space>
          <InfoCircleOutlined />
          {t('industryDetail')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Spin spinning={loading}>
        {industryData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <InfoCircleOutlined className="description-icon" />
                  ID
                </Space>
              }
            >
              {industryData.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <GlobalOutlined className="description-icon" />
                  {t('lang')}
                </Space>
              }
            >
              <Tag color="blue">{industryData.lang}</Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined className="description-icon" />
                  {t('industryCode')}
                </Space>
              }
            >
              {industryData.industryCode}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined className="description-icon" />
                  {t('industryName')}
                </Space>
              }
            >
              {industryData.industryName}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined className="description-icon" />
                  {t('industryNameEn')}
                </Space>
              }
            >
              {industryData.industryNameEn || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined className="description-icon" />
                  {t('description')}
                </Space>
              }
            >
              {industryData.description || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined className="description-icon" />
                  {t('descriptionEn')}
                </Space>
              }
            >
              {industryData.descriptionEn || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <PictureOutlined className="description-icon" />
                  {t('coverImage')}
                </Space>
              }
            >
              {industryData.coverImage ? (
                <Image
                  src={industryData.coverImage}
                  alt={industryData.industryName}
                  width={200}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  preview
                />
              ) : (
                <span style={{ color: '#999' }}>-</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <StarOutlined className="description-icon" />
                  {t('sortWeight')}
                </Space>
              }
            >
              {industryData.sortWeight || 0}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FireOutlined className="description-icon" />
                  {t('hotCount')}
                </Space>
              }
            >
              {industryData.hotCount || 0}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FolderOutlined className="description-icon" />
                  {t('projectCount')}
                </Space>
              }
            >
              {industryData.projectCount || 0}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <ToolOutlined className="description-icon" />
                  {t('recommendModels')}
                </Space>
              }
            >
              {industryData.recommendModels ? (
                <div>
                  {industryData.recommendModels.split(',').map((model, index) => (
                    <Tag key={index} color="cyan" style={{ marginBottom: '4px' }}>
                      {model.trim()}
                    </Tag>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#999' }}>-</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <BulbOutlined className="description-icon" />
                  {t('samplePrompts')}
                </Space>
              }
            >
              {industryData.samplePrompts ? (
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                  {(() => {
                    const prompts = parseSamplePrompts(industryData.samplePrompts);
                    if (Array.isArray(prompts)) {
                      return prompts.map((prompt, index) => (
                        <div key={index} style={{ marginBottom: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                          {typeof prompt === 'object' && prompt.prompt ? prompt.prompt : JSON.stringify(prompt)}
                        </div>
                      ));
                    }
                    return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{industryData.samplePrompts}</pre>;
                  })()}
                </div>
              ) : (
                <span style={{ color: '#999' }}>-</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <BulbOutlined className="description-icon" />
                  {t('tips')}
                </Space>
              }
            >
              {industryData.tips || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <CheckCircleOutlined className="description-icon" />
                  {t('status')}
                </Space>
              }
            >
              <Badge
                status={industryData.status ? 'success' : 'error'}
                text={industryData.status ? t('active') : t('inactive')}
              />
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <InfoCircleOutlined className="description-icon" />
                  {t('createTime')}
                </Space>
              }
            >
              {industryData.createTime || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <InfoCircleOutlined className="description-icon" />
                  {t('updateTime')}
                </Space>
              }
            >
              {industryData.updateTime || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </StyledModal>
  );
};

export default SaAiVideoIndustriesDetailModal;

