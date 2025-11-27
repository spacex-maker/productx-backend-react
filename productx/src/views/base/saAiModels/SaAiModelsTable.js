import React, { useState, useEffect } from 'react';
import { Button, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const SaAiModelsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();
  const [taskTypes, setTaskTypes] = useState([]);

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const fetchTaskTypes = async () => {
    try {
      const response = await api.get('/manage/base/task-types/list');
      if (response && Array.isArray(response)) {
        setTaskTypes(response);
      }
    } catch (error) {
      console.error('Failed to fetch task types:', error);
    }
  };

  // 判断是否为生图相关的任务类型
  const isImageTaskType = (taskTypeCode) => {
    const imageTaskTypes = [
      't2i', 'i2i', 'upscale', 'restore', 'inpainting', 
      'outpainting', 'style_transfer', 'remove_bg', 'colorize', 'enhance'
    ];
    return imageTaskTypes.includes(taskTypeCode);
  };

  // 判断是否为生视频相关的任务类型
  const isVideoTaskType = (taskTypeCode) => {
    const videoTaskTypes = [
      't2v', 'i2v', 'v2v', 'video_upscale', 'video_enhance', 'a2v'
    ];
    return videoTaskTypes.includes(taskTypeCode);
  };

  // 判断是否为文本/LLM相关的任务类型
  const isTextTaskType = (taskTypeCode) => {
    const textTaskTypes = [
      'chat', 'qa', 'completion', 'rewrite', 'translate', 'summarize'
    ];
    return textTaskTypes.includes(taskTypeCode);
  };

  // 判断是否为视频文件
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // 根据模型类型渲染详细信息
  const renderModelDetails = (item) => {
    const { modelType } = item;
    const details = [];

    // 兼容旧数据格式
    const isTextType = isTextTaskType(modelType) || modelType === 'llm' || modelType === 'multimodal';
    const isImageType = isImageTaskType(modelType) || modelType === 'image' || modelType === 'multimodal';
    const isVideoType = isVideoTaskType(modelType) || modelType === 'video' || modelType === 'multimodal';

    if (isTextType) {
      if (item.contextLength) {
        details.push(`${t('contextLength')}: ${item.contextLength}`);
      }
      if (item.outputLength) {
        details.push(`${t('outputLength')}: ${item.outputLength}`);
      }
      if (item.thoughtChainLength) {
        details.push(`${t('thoughtChainLength')}: ${item.thoughtChainLength}`);
      }
      if (item.inputPrice !== null && item.inputPrice !== undefined) {
        details.push(`${t('inputPrice')}: ${item.inputPrice}${item.currency ? ` ${item.currency}` : ''}`);
      }
      if (item.outputPrice !== null && item.outputPrice !== undefined) {
        details.push(`${t('outputPrice')}: ${item.outputPrice}${item.currency ? ` ${item.currency}` : ''}`);
      }
    }

    if (isImageType) {
      if (item.imageDefaultResolution) {
        details.push(`${t('imageDefaultResolution')}: ${item.imageDefaultResolution}`);
      }
      if (item.imageMaxResolution) {
        details.push(`${t('imageMaxResolution')}: ${item.imageMaxResolution}`);
      }
      if (item.imageFormats) {
        details.push(`${t('imageFormats')}: ${item.imageFormats}`);
      }
      const imageFeatures = [];
      if (item.supportControlnet) imageFeatures.push(t('supportControlnet'));
      if (item.supportInpaint) imageFeatures.push(t('supportInpaint'));
      if (imageFeatures.length > 0) {
        details.push(`${t('features')}: ${imageFeatures.join(', ')}`);
      }
    }

    if (isVideoType) {
      if (item.videoDefaultResolution) {
        details.push(`${t('videoDefaultResolution')}: ${item.videoDefaultResolution}`);
      }
      if (item.videoMaxResolution) {
        details.push(`${t('videoMaxResolution')}: ${item.videoMaxResolution}`);
      }
      if (item.videoDuration) {
        details.push(`${t('videoDuration')}: ${item.videoDuration}s`);
      }
      if (item.videoFps) {
        details.push(`${t('videoFps')}: ${item.videoFps}`);
      }
      if (item.videoFormats) {
        details.push(`${t('videoFormats')}: ${item.videoFormats}`);
      }
      if (item.videoAspectRatios) {
        details.push(`${t('videoAspectRatios')}: ${item.videoAspectRatios}`);
      }
      if (item.videoAspectResolution) {
        details.push(`${t('videoAspectResolution')}: ${item.videoAspectResolution}`);
      }
      if (item.outputPrice !== null && item.outputPrice !== undefined) {
        details.push(`${t('videoOutputPrice')}: ${item.outputPrice}${item.currency ? ` ${item.currency}` : ''}/秒`);
      }
      const videoFeatures = [];
      if (item.supportImg2video) videoFeatures.push(t('supportImg2video'));
      if (item.supportVideoEdit) videoFeatures.push(t('supportVideoEdit'));
      if (item.supportCameraMotion) videoFeatures.push(t('supportCameraMotion'));
      if (item.supportCharacterConsistency) videoFeatures.push(t('supportCharacterConsistency'));
      if (item.supportReference) videoFeatures.push(t('supportReference'));
      if (videoFeatures.length > 0) {
        details.push(`${t('features')}: ${videoFeatures.join(', ')}`);
      }
    }

    if (details.length === 0) {
      return <span style={{ color: '#999' }}>-</span>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
        {details.map((detail, index) => (
          <div key={index} style={{ color: '#666' }}>{detail}</div>
        ))}
      </div>
    );
  };

  // 获取模型类型标签
  const getModelTypeTag = (modelType) => {
    const taskType = taskTypes.find(t => t.code === modelType);
    if (taskType) {
      return <Tag color="blue">{taskType.englishName}</Tag>;
    }
    // 兼容旧数据，保留原有的类型映射
    const typeMap = {
      'llm': { text: 'LLM', color: 'blue' },
      'image': { text: 'Image', color: 'green' },
      'video': { text: 'Video', color: 'orange' },
      'multimodal': { text: 'Multimodal', color: 'purple' }
    };
    const typeInfo = typeMap[modelType] || { text: modelType, color: 'default' };
    return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          <th>{t('companyCode')}</th>
          <th>{t('modelName')}</th>
          <th>{t('modelType')}</th>
          <th>{t('details')}</th>
          <th>{t('releaseYear')}</th>
          <th>{t('status')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td>
              <Space>
                {item.companyLogoPath && (
                  <img
                    src={item.companyLogoPath}
                    alt={item.companyCode}
                    style={{
                      width: 20,
                      height: 20,
                      objectFit: 'contain',
                      borderRadius: 4,
                    }}
                  />
                )}
                <span>{item.companyCode}</span>
              </Space>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(item.coverImage || item.cover_image) && (
                  (() => {
                    const coverUrl = item.coverImage || item.cover_image;
                    const isVideo = isVideoFile(coverUrl);
                    const coverStyle = {
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 4,
                    };
                    return isVideo ? (
                      <video
                        src={coverUrl}
                        style={coverStyle}
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={coverUrl}
                        alt={item.modelName}
                        style={coverStyle}
                      />
                    );
                  })()
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: '500' }}>{item.modelName}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{item.modelCode}</span>
                </div>
              </div>
            </td>
            <td>{getModelTypeTag(item.modelType)}</td>
            <td style={{ maxWidth: '300px' }}>{renderModelDetails(item)}</td>
            <td>{item.releaseYear}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleEnableStatusChange(item.id, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaAiModelsTable;
