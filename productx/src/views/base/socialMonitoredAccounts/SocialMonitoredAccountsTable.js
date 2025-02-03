import React from 'react';
import { Button, Tag, Space, Badge } from 'antd';
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
} from '@ant-design/icons';
import { FaTelegram } from 'react-icons/fa';
import './SocialMonitoredAccountsTable.css';

const SocialMonitoredAccountsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewPostsClick,
}) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Twitter':
        return <TwitterOutlined style={{ color: '#1DA1F2' }} />;
      case 'Telegram':
        return <FaTelegram style={{ color: '#0088cc' }} />;
      case 'YouTube':
        return <YoutubeOutlined style={{ color: '#FF0000' }} />;
      case 'Reddit':
        return <RedditOutlined style={{ color: '#FF4500' }} />;
      default:
        return null;
    }
  };

  const getStatusTag = (status) => {
    if (status) {
      return (
        <Tag color="success" className="status-tag-active">
          <Space>
            <Badge status="processing" />
            <span>监控中</span>
          </Space>
        </Tag>
      );
    }
    return (
      <Tag color="default" className="status-tag-stopped">
        <Space>
          <Badge status="default" />
          <span>已停止</span>
        </Space>
      </Tag>
    );
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
            '平台', '账号ID', '账号名称', '账号链接', '账号描述', 
            '监控状态', '创建时间', '更新时间', '操作'
          ].map((field) => (
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
                {getPlatformIcon(item.platform)}
                <span>{item.platform}</span>
              </Space>
            </td>
            <td>{item.accountId}</td>
            <td>{item.accountName}</td>
            <td>
              <a href={item.profileUrl} target="_blank" rel="noopener noreferrer">
                {item.profileUrl}
              </a>
            </td>
            <td>{item.accountDescription}</td>
            <td>{getStatusTag(item.status)}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td>
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  修改
                </Button>
                <Button type="link" onClick={() => handleViewPostsClick(item)}>
                  查看帖子
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SocialMonitoredAccountsTable;
