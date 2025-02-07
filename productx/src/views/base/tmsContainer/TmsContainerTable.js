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
          <th>集装箱类型</th>
          <th>内部长度(mm)</th>
          <th>内部宽度(mm)</th>
          <th>内部高度(mm)</th>
          <th>外部长度(mm)</th>
          <th>外部宽度(mm)</th>
          <th>外部高度(mm)</th>
          <th>门宽(mm)</th>
          <th>门高(mm)</th>
          <th>体积(m³)</th>
          <th>最大载重(kg)</th>
          <th>自重(kg)</th>
          <th className="fixed-column">操作</th>
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
                  查看
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  修改
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
