import React from 'react';
import { Button, Tooltip, Modal } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const SysLanguageTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

  const handleStatusChange = (id, event) => {
    const newStatus = event.target.checked;
    Modal.confirm({
      title: t('confirmStatusChange'),
      content: t('confirmLanguageStatusChangeMessage'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: () => {
        handleEnableStatusChange(id, event);
      },
      onCancel() {
        // 取消时不做任何操作，保持原状态
      },
    });
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </th>
          <th>{t('languageCode')}</th>
          <th>{t('englishName')}</th>
          <th>{t('chineseName')}</th>
          <th>{t('nativeName')}</th>
          <th>{t('developmentStatus')}</th>
          <th>
            {t('enableStatus')}
            <Tooltip title={t('modifyingEnableStatusWillAffectLanguageOptions')}>
              <InfoCircleOutlined style={{ marginLeft: '4px' }} />
            </Tooltip>
          </th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(item.id)}
                onChange={() => handleSelectRow(item.id)}
              />
            </td>
            <td>{item.languageCode}</td>
            <td>{item.languageNameEn}</td>
            <td>{item.languageNameZh}</td>
            <td>{item.languageNameNative}</td>
            <td>
              {item.isDeveloped ? (
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: '16px' }} />
              ) : (
                <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '16px' }} />
              )}
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
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

export default SysLanguageTable;
