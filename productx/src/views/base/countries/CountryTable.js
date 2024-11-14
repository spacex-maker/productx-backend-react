import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import CountryDetailModal from './CountryDetailModal';

const CountryTable = ({
                        allData,
                        data,
                        selectAll,
                        selectedRows,
                        handleSelectAll,
                        handleSelectRow,
                        handleStatusChange,
                        handleEditClick,
                      }) => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const showDetail = (country) => {
    setSelectedCountry(country);
    setDetailVisible(true);
  };

  return (
    <>
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
            {['国家名称', '国家代码', '大陆', '状态', '操作'].map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`td_checkbox_${item.id}`}
                  ></label>
                </div>
              </td>
              <td className="text-truncate">{item.name}</td>
              <td className="text-truncate">{item.code}</td>
              <td className="text-truncate">{item.continent}</td>
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
              <td>
                <Space size="small">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => showDetail(item)}
                  >
                    详情
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(item)}
                  >
                    修改
                  </Button>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CountryDetailModal
        visible={detailVisible}
        country={selectedCountry}
        onCancel={() => setDetailVisible(false)}
      />
    </>
  );
};

export default CountryTable;
