import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import { Tooltip } from 'antd';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'online':
        return '#52c41a';
      case 'offline':
        return '#ff4d4f';
      case 'checking':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  }};
  ${props => props.status === 'online' && css`
    animation: ${pulse} 2s ease-in-out infinite;
    box-shadow: 0 0 4px ${props => props.status === 'online' ? '#52c41a' : 'transparent'};
  `}
`;

const HealthCheck = ({ url }) => {
  const [status, setStatus] = useState('checking');
  const [latency, setLatency] = useState(null);

  const checkHealth = async () => {
    setStatus('checking');
    const startTime = Date.now();
    try {
      const response = await axios.get(`${url}/manage/base/system/health`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });
      const endTime = Date.now();
      setLatency(endTime - startTime);
      
      if (response.data.data === true) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      setStatus('offline');
      setLatency(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 3000); // 每3秒检查一次
    return () => clearInterval(interval);
  }, [url]);

  const getTooltipTitle = () => {
    switch (status) {
      case 'online':
        return `可用 (延迟: ${latency}ms)`;
      case 'offline':
        return '不可用';
      case 'checking':
        return '检查中...';
      default:
        return '未知状态';
    }
  };

  return (
    <Tooltip title={getTooltipTitle()} placement="right">
      <StatusDot status={status} />
    </Tooltip>
  );
};

export default HealthCheck; 