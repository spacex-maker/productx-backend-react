import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CIcon from '@coreui/icons-react';
import * as icons from '@coreui/icons';
import * as AntdIcons from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// 添加所有 solid 图标到库中
library.add(fas);

const SaIndustryTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
  industries,
}) => {
  const { t } = useTranslation();

  const renderIcon = (iconClassName) => {
    if (!iconClassName) return null;
    
    if (iconClassName.startsWith('cil')) {
      return <CIcon icon={icons[iconClassName]} style={{ width: '32px', height: '32px' }} />;
    }
    
    if (iconClassName.endsWith('Outlined')) {
      const AntIcon = AntdIcons[iconClassName];
      return AntIcon ? <AntIcon style={{ fontSize: '32px' }} /> : null;
    }
    
    if (iconClassName.startsWith('fa')) {
      return <FontAwesomeIcon icon={fas[iconClassName]} style={{ fontSize: '32px' }} />;
    }
    
    return null;
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
          <th>{t('name')}</th>
          <th>{t('description')}</th>
          <th>{t('parentIndustry')}</th>
          <th>{t('sortOrder')}</th>
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px'
                }}>
                  <span style={{ color: item.iconColor || '#000000' }}>
                    {renderIcon(item.icon)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', color: '#666666' }}>{item.code}</span>
                </div>
              </div>
            </td>
            <td>{item.description}</td>
            <td>{industries?.find(industry => industry.id === item.parentId)?.name || '-'}</td>
            <td>{item.sortOrder}</td>
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

export default SaIndustryTable;
