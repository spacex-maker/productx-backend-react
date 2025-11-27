import React from 'react';
import { Button, Space, Tag, Image } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiVideoIndustriesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDeleteClick,
  handleDetailClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

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
          <th>{t('coverImage')}</th>
          <th>{t('industryCode')}</th>
          <th>{t('industryName')}</th>
          <th>{t('industryNameEn')}</th>
          <th>{t('lang')}</th>
          <th>{t('sortWeight')}</th>
          <th>{t('hotCount')}</th>
          <th>{t('projectCount')}</th>
          <th>{t('recommendModels')}</th>
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
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.industryName}
                  width={60}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  preview
                />
              ) : (
                <span style={{ color: '#999' }}>-</span>
              )}
            </td>
            <td>{item.industryCode}</td>
            <td>{item.industryName}</td>
            <td>{item.industryNameEn || '-'}</td>
            <td>
              <Tag color="blue">{item.lang}</Tag>
            </td>
            <td>{item.sortWeight || 0}</td>
            <td>{item.hotCount || 0}</td>
            <td>{item.projectCount || 0}</td>
            <td>
              {item.recommendModels ? (
                <div style={{ maxWidth: '200px' }}>
                  {item.recommendModels.split(',').map((model, index) => (
                    <Tag key={index} color="cyan" style={{ marginBottom: '4px' }}>
                      {model.trim()}
                    </Tag>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#999' }}>-</span>
              )}
            </td>
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
              <Space>
                <Button type="link" onClick={() => handleDetailClick(item)}>
                  {t('detail')}
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteClick(item.id)}
                >
                  {t('delete')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaAiVideoIndustriesTable;

