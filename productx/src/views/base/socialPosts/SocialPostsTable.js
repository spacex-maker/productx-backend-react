import React from 'react';
import { Button, Typography, Space } from 'antd';
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { FaTelegram } from 'react-icons/fa';

const { Paragraph } = Typography;

const SocialPostsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewClick,
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
            '平台', '账号名称', '帖子类型', '帖子内容', '帖子链接', 
            '创建时间', '更新时间', '操作'
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
              <span style={{ marginRight: 8 }}>{getPlatformIcon(item.platform)}</span>
              {item.platform}
            </td>
            <td>{item.authorName}</td>
            <td>{item.postType}</td>
            <td>
              <Paragraph 
                ellipsis={{ 
                  rows: 2,
                  expandable: false,
                  tooltip: item.content
                }}
                style={{ marginBottom: 0, width: 200 }}
              >
                {item.content}
              </Paragraph>
            </td>
            <td>
              <Paragraph 
                ellipsis={{ 
                  rows: 1,
                  expandable: false,
                  tooltip: item.postUrl
                }}
                style={{ marginBottom: 0, width: 150 }}
              >
                <a href={item.postUrl} target="_blank" rel="noopener noreferrer">
                  {item.postUrl}
                </a>
              </Paragraph>
            </td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td>
              <Space>
                <Button 
                  type="link" 
                  icon={<EyeOutlined />}
                  onClick={() => handleViewClick(item)}
                >
                  详情
                </Button>
                <Button 
                  type="link" 
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
  );
};

export default SocialPostsTable;
