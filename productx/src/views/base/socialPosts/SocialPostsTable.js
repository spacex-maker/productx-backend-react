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

  const extractSentimentScore = (score) => {
    if (score === null || score === undefined) return null;
    
    // 如果是数字类型，直接返回
    if (typeof score === 'number') return score;
    
    // 处理字符串类型
    if (typeof score === 'string') {
      // 如果包含冒号，提取冒号后的数字
      if (score.includes(':')) {
        const [, value] = score.split(':');
        return Number(value);
      }
      // 否则尝试直接转换为数字
      return Number(score);
    }
    
    return null;
  };

  const getSentimentColor = (score) => {
    const numScore = extractSentimentScore(score);
    if (numScore === null || isNaN(numScore)) return '#999';
    if (numScore >= 0.7) return '#52c41a';  // 积极 - 绿色
    if (numScore >= 0.3) return '#1890ff';   // 较积极 - 蓝色
    if (numScore >= -0.3) return '#faad14';  // 中性 - 黄色
    if (numScore >= -0.7) return '#fa8c16';  // 较消极 - 橙色
    return '#f5222d';  // 消极 - 红色
  };

  const formatSentimentScore = (score) => {
    const numScore = extractSentimentScore(score);
    if (numScore === null || isNaN(numScore)) return 'N/A';
    return numScore.toFixed(2);
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
                onChange={() => handleSelectAll(data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {[
            '平台', '账号名称', '帖子类型', '帖子内容', '帖子链接', 
            '情绪得分', '创建时间', '更新时间', '操作'
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
            <td>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <div style={{
                  width: '50px',
                  height: '24px',
                  backgroundColor: getSentimentColor(item.sentimentScore),
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px'
                }}>
                  {formatSentimentScore(item.sentimentScore)}
                </div>
              </div>
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
