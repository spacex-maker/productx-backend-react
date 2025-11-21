import React from 'react';
import { Button, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

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

  // 根据模型类型渲染详细信息
  const renderModelDetails = (item) => {
    const { modelType } = item;
    const details = [];

    if (modelType === 'llm' || modelType === 'multimodal') {
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

    if (modelType === 'image' || modelType === 'multimodal') {
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

    if (modelType === 'video' || modelType === 'multimodal') {
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '500' }}>{item.modelName}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{item.modelCode}</span>
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
