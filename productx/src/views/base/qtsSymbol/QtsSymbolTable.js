import React from 'react';
import { Button } from 'antd';

const QtsSymbolTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
}) => {
  const getStatusText = (status) => {
    switch (status) {
      case 1: return '交易中';
      case 2: return '暂停交易';
      case 3: return '已下架';
      default: return '未知状态';
    }
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
          {[
            '交易所', '交易对', '基础币种', '计价币种', '状态',
            '最小数量', '最大数量', '最小手数', '最大手数',
            '步长', '价格步长', '数量精度', '价格精度',
            '最小名义价值', '创建时间', '更新时间'
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
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
            <td>{item.exchangeName}</td>
            <td>{item.symbol}</td>
            <td>{item.baseAsset}</td>
            <td>{item.quoteAsset}</td>
            <td>{getStatusText(item.status)}</td>
            <td>{item.minQty}</td>
            <td>{item.maxQty}</td>
            <td>{item.minLotSize}</td>
            <td>{item.maxLotSize}</td>
            <td>{item.stepSize}</td>
            <td>{item.tickSize}</td>
            <td>{item.qtyPrecision}</td>
            <td>{item.pricePrecision}</td>
            <td>{item.minNotional}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsSymbolTable;
