import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Divider, Typography, Row, Col, Card, message, Button, Space } from 'antd';
import api from 'src/axiosInstance';

const { Title } = Typography;

const QtsSymbolDetailsModal = ({ isVisible, onCancel, symbol }) => {
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && symbol) {
      fetchScheduleStatus();
    }
  }, [isVisible, symbol]);

  const fetchScheduleStatus = async () => {
    try {
      const response = await api.get('/manage/qts-market-data/schedule/status', {
        params: {
          exchangeName: symbol.exchangeName,
          symbol: symbol.symbol
        }
      });
      if (response) {
        setScheduleStatus(response);
      }
    } catch (error) {
      console.error('获取定时任务状态失败', error);
      message.error('获取定时任务状态失败');
    }
  };

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

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          交易对详情
        </Title>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      {symbol && (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">交易所</div>
                  <div className="detail-value">{symbol.exchangeName}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">交易对</div>
                  <div className="detail-value">{symbol.symbol}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">状态</div>
                  <div className="detail-value">{getStatusTag(symbol.status)}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">基础币种</div>
                  <div className="detail-value">{symbol.baseAsset}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">计价币种</div>
                  <div className="detail-value">{symbol.quoteAsset}</div>
                </div>
              </Col>
            </Row>
          </Card>

          <Divider style={{ margin: '16px 0' }} />

          <Card title="交易限制" bordered={false}>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">最小数量</div>
                  <div className="detail-value">{symbol.minQty}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">最大数量</div>
                  <div className="detail-value">{symbol.maxQty}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">最小手数</div>
                  <div className="detail-value">{symbol.minLotSize}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">最大手数</div>
                  <div className="detail-value">{symbol.maxLotSize}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">步长</div>
                  <div className="detail-value">{symbol.stepSize}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">价格步长</div>
                  <div className="detail-value">{symbol.tickSize}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">数量精度</div>
                  <div className="detail-value">{symbol.qtyPrecision}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">价格精度</div>
                  <div className="detail-value">{symbol.pricePrecision}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">最小名义价值</div>
                  <div className="detail-value">{symbol.minNotional}</div>
                </div>
              </Col>
            </Row>
          </Card>

          <Divider style={{ margin: '16px 0' }} />

          <Card title="同步配置" bordered={false}>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">同步状态</div>
                  <div className="detail-value">{getSyncStatusTag(symbol.syncStatus)}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">同步频率</div>
                  <div className="detail-value">{getSyncFrequencyText(symbol.syncFrequency)}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">同步开关</div>
                  <div className="detail-value">
                    <Tag color={symbol.syncEnabled ? 'green' : 'red'}>
                      {symbol.syncEnabled ? '启用' : '禁用'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">最后同步时间</div>
                  <div className="detail-value">{symbol.lastSyncTime || '-'}</div>
                </div>
              </Col>
              <Col span={24}>
                <div className="detail-item">
                  <div className="detail-label">同步错误信息</div>
                  <div className="detail-value error-message">
                    {symbol.syncErrorMessage || '-'}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Divider style={{ margin: '16px 0' }} />

          <Card 
            title="定时任务信息" 
            bordered={false}
            extra={
              <Space>
                {scheduleStatus?.syncStatus === 'PAUSED' ? (
                  <Button 
                    type="primary"
                    loading={loading}
                    onClick={handleResumeSchedule}
                  >
                    开始任务
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    danger
                    loading={loading}
                    onClick={handlePauseSchedule}
                    disabled={scheduleStatus?.syncStatus === 'DISABLED'}
                  >
                    暂停任务
                  </Button>
                )}
              </Space>
            }
          >
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">任务状态</div>
                  <div className="detail-value">
                    {getScheduleStatusTag(scheduleStatus)}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">同步状态</div>
                  <div className="detail-value">
                    {scheduleStatus && getSyncStatusTag(scheduleStatus.syncStatus)}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <div className="detail-label">任务执行</div>
                  <div className="detail-value">
                    {scheduleStatus?.scheduled ? (
                      <Tag color="success">已调度</Tag>
                    ) : (
                      <Tag>未调度</Tag>
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">下次执行时间</div>
                  <div className="detail-value">
                    {scheduleStatus?.nextExecuteTime || '-'}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">上次执行时间</div>
                  <div className="detail-value">
                    {scheduleStatus?.lastExecuteTime || '-'}
                  </div>
                </div>
              </Col>
              {scheduleStatus?.errorMessage && (
                <Col span={24}>
                  <div className="detail-item">
                    <div className="detail-label">错误信息</div>
                    <div className="detail-value error-message">
                      {scheduleStatus.errorMessage}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </div>
      )}
      <style jsx>{`
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
        :global(.ant-card-head) {
          padding: 0 0 8px 0;
          border-bottom: none;
          min-height: 40px;
        }
        :global(.ant-card-body) {
          padding: 0;
        }
        :global(.ant-card) {
          background: transparent;
        }
        :global(.ant-card-head-title) {
          font-size: 16px;
          font-weight: 500;
          padding: 0;
        }
      `}</style>
    </Modal>
  );
};

export default QtsSymbolDetailsModal; 