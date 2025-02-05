import React from 'react';

const QtsSystemLogTable = ({ data }) => {
  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          {[
            '日志类型', '日志级别', '日志内容', '异常信息',
            '创建时间', '更新时间'
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>{item.logType}</td>
            <td>{item.logLevel}</td>
            <td>{item.message}</td>
            <td>{item.exception}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsSystemLogTable;
