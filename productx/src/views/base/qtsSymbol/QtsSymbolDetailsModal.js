import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Descriptions, Tag, Divider, Typography, Row, Col, Card, message, Button, Space, Tabs, Table } from 'antd';
import api from 'src/axiosInstance';
import { ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const QtsSymbolDetailsModal = ({ isVisible, onCancel, symbol }) => {
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const oldNextExecuteTimeRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // 刷新状态的函数
  const fetchScheduleStatus = async () => {
    if (!symbol?.exchangeName || !symbol?.symbol) {
      console.log('symbol 数据不完整，跳过请求');
      return;
    }

    try {
      setRefreshing(true);
      const response = await api.get('/manage/qts-market-data/schedule/status', {
        params: {
          exchangeName: symbol.exchangeName,
          symbol: symbol.symbol
        }
      });
      if (response) {
        setScheduleStatus(response);
        
        // 检查是否获取到新的时间，并且最后执行时间已更新
        if (oldNextExecuteTimeRef.current && 
            response?.taskStatus?.nextExecuteTime !== oldNextExecuteTimeRef.current &&
            response?.taskStatus?.lastExecuteTime === oldNextExecuteTimeRef.current) {
          console.log('获取到新的有效时间，停止刷新', {
            old: oldNextExecuteTimeRef.current,
            new: response?.taskStatus?.nextExecuteTime,
            last: response?.taskStatus?.lastExecuteTime
          });
          isRefreshingRef.current = false;
          clearIntervals();
        } else {
          console.log('继续刷新', {
            old: oldNextExecuteTimeRef.current,
            new: response?.taskStatus?.nextExecuteTime,
            last: response?.taskStatus?.lastExecuteTime
          });
        }
      }
    } catch (error) {
      console.error('获取定时任务状态失败', error);
      message.error({
        content: '获取定时任务状态失败',
        key: 'schedule-status-error'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 清理定时器
  const clearIntervals = useCallback(() => {
    console.log('清理定时器');
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  // 启动进度条
  const startProgress = useCallback(() => {
    if (!scheduleStatus?.taskStatus?.lastExecuteTime || !scheduleStatus?.taskStatus?.nextExecuteTime) {
      return;
    }

    // 如果已经在刷新，不需要重新启动进度条
    if (isRefreshingRef.current) {
      console.log('已经在刷新中，跳过进度条启动');
      return;
    }

    clearIntervals();

    const updateProgress = () => {
      const now = new Date().getTime();
      const last = new Date(scheduleStatus.taskStatus.lastExecuteTime).getTime();
      const next = new Date(scheduleStatus.taskStatus.nextExecuteTime).getTime();
      
      if (next <= last) {
        setProgress(0);
        return;
      }

      const currentProgress = Math.min(Math.max(((now - last) / (next - last)) * 100, 0), 100);
      setProgress(currentProgress);

      if (currentProgress >= 100 && !isRefreshingRef.current) {
        console.log('进度达到100%，开始刷新', {
          currentProgress,
          isRefreshing: isRefreshingRef.current,
          nextTime: scheduleStatus.taskStatus.nextExecuteTime
        });
        isRefreshingRef.current = true;
        oldNextExecuteTimeRef.current = scheduleStatus.taskStatus.nextExecuteTime;
        fetchScheduleStatus();
        
        // 设置刷新定时器
        if (!refreshIntervalRef.current) {
          refreshIntervalRef.current = setInterval(() => {
            if (isRefreshingRef.current) {
              console.log('执行定时刷新');
              fetchScheduleStatus();
            } else {
              console.log('刷新已停止，清理定时器');
              clearIntervals();
            }
          }, 2000);
        }
      }
    };

    updateProgress(); // 立即执行一次
    if (!progressIntervalRef.current) {
      progressIntervalRef.current = setInterval(updateProgress, 1000);
    }
  }, [scheduleStatus, clearIntervals]);

  // 监听数据变化
  useEffect(() => {
    console.log('数据变化:', {
      oldTime: oldNextExecuteTimeRef.current,
      newTime: scheduleStatus?.taskStatus?.nextExecuteTime,
      isRefreshing: isRefreshingRef.current
    });
    
    // 只有在没有刷新时才启动进度条
    if (!isRefreshingRef.current) {
      startProgress();
    }
    
    return () => {
      // 只在组件卸载时清理定时器
      if (!isRefreshingRef.current) {
        clearIntervals();
      }
    };
  }, [scheduleStatus?.taskStatus?.lastExecuteTime, scheduleStatus?.taskStatus?.nextExecuteTime, startProgress, clearIntervals]);

  // 初始加载
  useEffect(() => {
    if (isVisible && symbol?.exchangeName && symbol?.symbol) {
      console.log('初始加载');
      oldNextExecuteTimeRef.current = null;
      isRefreshingRef.current = false;
      fetchScheduleStatus();
    }
    return clearIntervals;
  }, [isVisible, symbol, clearIntervals]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      console.log('组件卸载');
      isRefreshingRef.current = false;
      clearIntervals();
    };
  }, [clearIntervals]);

  const getStatusTag = (status) => {
    const statusConfig = {
      1: { color: 'success', text: '交易中' },
      2: { color: 'warning', text: '暂停交易' },
      3: { color: 'error', text: '已下架' },
    };
    
    const config = statusConfig[status] || { color: 'default', text: '未知状态' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getSyncStatusTag = (syncStatus) => {
    const statusConfig = {
      'NOT_SYNCED': { color: 'default', text: '未同步' },
      'SYNCING': { color: 'processing', text: '同步中' },
      'SYNC_SUCCESS': { color: 'success', text: '同步成功' },
      'SYNC_FAILED': { color: 'error', text: '同步失败' },
      'PAUSED': { color: 'warning', text: '已暂停' },
      'DISABLED': { color: 'default', text: '已禁用' },
      'WAITING': { color: 'processing', text: '等待中' }
    };
    
    const config = statusConfig[syncStatus] || { color: 'default', text: '未知状态' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getSyncFrequencyText = (frequency) => {
    const frequencyMap = {
      'daily': '每天',
      '1h': '每小时',
      '4h': '每4小时',
      '12h': '每12小时'
    };
    return frequencyMap[frequency] || frequency;
  };

  const getScheduleStatusTag = (status) => {
    if (!status) return <Tag>未配置</Tag>;
    if (status.cancelled) return <Tag color="red">已取消</Tag>;
    if (status.done) return <Tag color="success">已完成</Tag>;
    if (status.scheduled) return <Tag color="processing">执行中</Tag>;
    return <Tag>未开始</Tag>;
  };

  const handlePauseSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.post('/manage/qts-market-data/schedule/pause', {
        exchangeName: symbol.exchangeName,
        symbol: symbol.symbol
      });
      if (response) {
        message.success('暂停成功');
        fetchScheduleStatus(); // 刷新状态
      }
    } catch (error) {
      console.error('暂停定时任务失败', error);
      message.error('暂停定时任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.post('/manage/qts-market-data/schedule/resume', {
        exchangeName: symbol.exchangeName,
        symbol: symbol.symbol
      });
      if (response) {
        message.success('恢复成功');
        fetchScheduleStatus(); // 刷新状态
      }
    } catch (error) {
      console.error('恢复定时任务失败', error);
      message.error('恢复定时任务失败');
    } finally {
      setLoading(false);
    }
  };

  const getKlineSyncInfo = (taskStatus) => {
    if (!taskStatus) return [];
    
    const klineIntervals = [
      '1m', '3m', '5m', '15m', '30m',
      '1h', '2h', '4h', '6h', '8h', '12h',
      '1d', '3d', '1w', '1M'
    ];
    
    return klineIntervals
      .map(interval => {
        const info = taskStatus[`kLineSyncInfo${interval}`];
        if (!info) return null;
        return {
          key: interval,
          timeInterval: interval,
          ...info
        };
      })
      .filter(Boolean);
  };

  return (
    <Modal
      title={
        <Space>
          <span>{symbol?.exchangeName}</span>
          <span>{symbol?.symbol}</span>
          {symbol && getStatusTag(symbol.status)}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      {symbol && (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <Tabs
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <Descriptions column={3}>
                    <Descriptions.Item label="基础币种">{symbol.baseAsset}</Descriptions.Item>
                    <Descriptions.Item label="计价币种">{symbol.quoteAsset}</Descriptions.Item>
                    <Descriptions.Item label="最小数量">{symbol.minQty}</Descriptions.Item>
                    <Descriptions.Item label="最大数量">{symbol.maxQty}</Descriptions.Item>
                    <Descriptions.Item label="最小手数">{symbol.minLotSize}</Descriptions.Item>
                    <Descriptions.Item label="最大手数">{symbol.maxLotSize}</Descriptions.Item>
                    <Descriptions.Item label="步长">{symbol.stepSize}</Descriptions.Item>
                    <Descriptions.Item label="价格步长">{symbol.tickSize}</Descriptions.Item>
                    <Descriptions.Item label="数量精度">{symbol.qtyPrecision}</Descriptions.Item>
                    <Descriptions.Item label="价格精度">{symbol.pricePrecision}</Descriptions.Item>
                    <Descriptions.Item label="最小名义价值">{symbol.minNotional}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'sync',
                label: '同步配置',
                children: (
                  <Descriptions column={3}>
                    <Descriptions.Item label="同步状态">{getSyncStatusTag(symbol.syncStatus)}</Descriptions.Item>
                    <Descriptions.Item label="同步频率">{getSyncFrequencyText(symbol.syncFrequency)}</Descriptions.Item>
                    <Descriptions.Item label="同步开关">
                      <Tag>{symbol.syncEnabled ? '启用' : '禁用'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="最后同步时间">{symbol.lastSyncTime || '-'}</Descriptions.Item>
                    <Descriptions.Item label="同步错误信息" span={3}>{symbol.syncErrorMessage || '-'}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'schedule',
                label: '定时任务',
                children: (
                  <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                      <Space>
                        <Button 
                          icon={<ReloadOutlined spin={refreshing} />}
                          loading={refreshing}
                          onClick={fetchScheduleStatus}
                        >
                          刷新
                        </Button>
                        {scheduleStatus?.taskStatus?.syncStatus === 'PAUSED' ? (
                          <Button type="primary" loading={loading} onClick={handleResumeSchedule}>
                            开始任务
                          </Button>
                        ) : (
                          <Button 
                            type="primary" 
                            danger
                            loading={loading}
                            onClick={handlePauseSchedule}
                            disabled={scheduleStatus?.taskStatus?.syncStatus === 'DISABLED'}
                          >
                            暂停任务
                          </Button>
                        )}
                      </Space>
                    </div>
                    <Descriptions column={3}>
                      <Descriptions.Item label="任务状态">{getScheduleStatusTag(scheduleStatus)}</Descriptions.Item>
                      <Descriptions.Item label="同步状态">
                        {scheduleStatus?.taskStatus && getSyncStatusTag(scheduleStatus.taskStatus.syncStatus)}
                      </Descriptions.Item>
                      <Descriptions.Item label="任务执行">
                        {scheduleStatus?.scheduled ? <Tag>已调度</Tag> : <Tag>未调度</Tag>}
                      </Descriptions.Item>
                      <Descriptions.Item label="下次执行时间">{scheduleStatus?.taskStatus?.nextExecuteTime || '-'}</Descriptions.Item>
                      <Descriptions.Item label="上次执行时间">{scheduleStatus?.taskStatus?.lastExecuteTime || '-'}</Descriptions.Item>
                      <Descriptions.Item label="同步频率">{scheduleStatus?.taskStatus?.frequency || '-'}</Descriptions.Item>
                    </Descriptions>

                    {scheduleStatus?.taskStatus?.lastExecuteTime && scheduleStatus?.taskStatus?.nextExecuteTime && (
                      <div style={{ marginTop: 16 }}>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-inner" 
                              style={{ width: `${progress}%` }} 
                            />
                            <div 
                              className="current-time-marker"
                              style={{ left: `${progress}%` }}
                            >
                              <div className="marker-line"></div>
                              <div className="marker-text">当前</div>
                            </div>
                          </div>
                          <div className="progress-time">
                            <span>{scheduleStatus.taskStatus.lastExecuteTime}</span>
                            <span>{scheduleStatus.taskStatus.nextExecuteTime}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {getKlineSyncInfo(scheduleStatus?.taskStatus).length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <Typography.Text type="secondary">K线同步进度</Typography.Text>
                        <Table 
                          style={{ marginTop: 8 }}
                          size="small"
                          pagination={false}
                          dataSource={getKlineSyncInfo(scheduleStatus?.taskStatus)}
                          columns={[
                            {
                              title: '周期',
                              dataIndex: 'timeInterval',
                              key: 'timeInterval',
                            },
                            {
                              title: '同步时间',
                              dataIndex: 'syncTime',
                              key: 'syncTime',
                              render: (text) => text || '-'
                            },
                            {
                              title: '时间范围',
                              key: 'timeRange',
                              render: (_, record) => {
                                if (!record.startTime && !record.endTime) return '-';
                                return `${record.startTime || ''} ~ ${record.endTime || ''}`;
                              }
                            },
                            {
                              title: '数据量',
                              dataIndex: 'dataCount',
                              key: 'dataCount',
                              render: (text) => text || 0
                            },
                            {
                              title: '同步内容',
                              dataIndex: 'content',
                              key: 'content',
                              render: (text) => text || '-'
                            }
                          ]}
                        />
                      </div>
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>
      )}
      <style>{`
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-label {
          opacity: 0.65;
          font-size: 14px;
        }
        .detail-value {
          font-size: 14px;
        }
        .error-message {
          white-space: pre-wrap;
          word-break: break-all;
        }
        .ant-card-head {
          padding: 0 0 8px 0;
          border-bottom: none;
          min-height: 40px;
        }
        .ant-card-body {
          padding: 0;
        }
        .ant-card {
          background: transparent;
        }
        .ant-card-head-title {
          font-size: 16px;
          font-weight: 500;
          padding: 0;
        }
        .ant-card-small {
          background: #f5f5f5;
        }
        .ant-card-small .ant-card-body {
          padding: 12px;
        }
        .kline-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .kline-table th,
        .kline-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .kline-table th {
          font-weight: 500;
        }

        .progress-container {
          padding: 16px 16px 8px 16px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: visible;
          position: relative;
        }

        .progress-inner {
          height: 100%;
          background-color: #1890ff;
          transition: width 0.3s ease;
        }

        .current-time-marker {
          position: absolute;
          top: -16px;
          transform: translateX(-50%);
          text-align: center;
        }

        .marker-line {
          width: 2px;
          height: 24px;
          background-color: #1890ff;
          margin: 0 auto;
        }

        .marker-text {
          font-size: 12px;
          color: #1890ff;
          margin-top: 4px;
        }

        .progress-time {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
        }
      `}</style>
    </Modal>
  );
};

export default QtsSymbolDetailsModal; 