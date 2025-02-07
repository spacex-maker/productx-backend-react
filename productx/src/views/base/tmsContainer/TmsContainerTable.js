import React from 'react';
import { Button, Space } from 'antd';

const TmsContainerTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetail,
  t
}) => {
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
          <th>{t('containerType')}</th>
          <th>{t('internalLength')} (mm)</th>
          <th>{t('internalWidth')} (mm)</th>
          <th>{t('internalHeight')} (mm)</th>
          <th>{t('externalLength')} (mm)</th>
          <th>{t('externalWidth')} (mm)</th>
          <th>{t('externalHeight')} (mm)</th>
          <th>{t('doorWidth')} (mm)</th>
          <th>{t('doorHeight')} (mm)</th>
          <th>{t('volume')} (m³)</th>
          <th>{t('maxPayload')} (kg)</th>
          <th>{t('tareWeight')} (kg)</th>
          <th className="fixed-column">{t('operations')}</th>
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
            <td>{item.containerType}</td>
            <td>{item.internalLength}</td>
            <td>{item.internalWidth}</td>
            <td>{item.internalHeight}</td>
            <td>{item.externalLength}</td>
            <td>{item.externalWidth}</td>
            <td>{item.externalHeight}</td>
            <td>{item.doorWidth}</td>
            <td>{item.doorHeight}</td>
            <td>{item.volume}</td>
            <td>{item.maxPayload}</td>
            <td>{item.tareWeight}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleViewDetail(item)}>
                  {t('view')}
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TmsContainerTable;
