import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Alert,
  Space,
  message,
  Spin,
  Timeline,
  Tag,
  Descriptions,
  Empty,
  Result,
  Divider,
  Table,
  Modal,
  Tabs,
  theme,
} from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BulbOutlined,
  HistoryOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { TabPane } = Tabs;

const AiDecisionPanel = () => {
  // 使用 Ant Design 主题 token
  const { token } = theme.useToken();
  
  const [loading, setLoading] = useState(false);
  const [decisions, setDecisions] = useState([]);
  const [hasExecuted, setHasExecuted] = useState(false);
  
  // 历史记录相关状态
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const triggerAiDecision = async () => {
    setLoading(true);
    setHasExecuted(false);
    try {
      const response = await api.post('/manage/sys-daily-challenge/ai/smart-decision');
      setDecisions(response || []);
      setHasExecuted(true);
      
      if (response && response.length > 0) {
        message.success(`AI决策完成，成功创建${response.length}个挑战任务`);
      } else {
        message.info('AI决策完成，当前无需创建新挑战');
      }
      
      // 刷新历史记录
      fetchHistory();
    } catch (error) {
      console.error('AI决策失败', error);
      message.error('AI决策失败，请查看日志');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await api.get('/manage/sys-ai-decision-log/list', {
        params: {
          currentPage,
          pageSize,
        },
      });
      setHistoryData(response.data || response.records || []);
      setHistoryTotal(response.totalNum || response.total || 0);
    } catch (error) {
      console.error('获取历史记录失败', error);
      message.error('获取历史记录失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  const showDetail = async (id) => {
    try {
      const detail = await api.get(`/manage/sys-ai-decision-log/${id}`);
      setSelectedRecord(detail);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('获取详情失败', error);
      message.error('获取详情失败');
    }
  };

  // 使用主题 token 中的颜色
  const PRIMARY_COLOR = token.colorPrimary;
  const SUCCESS_COLOR = token.colorSuccess;
  const WARNING_COLOR = token.colorWarning;
  const ERROR_COLOR = token.colorError;
  const INFO_COLOR = token.colorInfo;

  const getResultColor = (result) => {
    const colorMap = {
      created: SUCCESS_COLOR,
      no_need: '#999',
      error: ERROR_COLOR,
    };
    return colorMap[result] || '#999';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      auto: INFO_COLOR,
      manual: PRIMARY_COLOR,
    };
    return colorMap[type] || '#999';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      0: WARNING_COLOR,
      1: SUCCESS_COLOR,
      2: '#999',
    };
    return statusMap[status] || '#999';
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: '待审核',
      1: '进行中',
      2: '已结束',
    };
    return statusMap[status] || '未知';
  };

  const columns = [
    {
      title: '决策时间',
      dataIndex: 'decisionTime',
      key: 'decisionTime',
      width: 180,
    },
    {
      title: '决策类型',
      dataIndex: 'decisionType',
      key: 'decisionType',
      width: 100,
      render: (type, record) => (
        <Tag color={type === 'auto' ? 'blue' : 'purple'}>
          {record.decisionTypeText}
        </Tag>
      ),
    },
    {
      title: '决策结果',
      dataIndex: 'decisionResult',
      key: 'decisionResult',
      width: 120,
      render: (result, record) => (
        <Tag color={result === 'created' ? 'success' : result === 'error' ? 'error' : 'default'}>
          {record.decisionResultText}
        </Tag>
      ),
    },
    {
      title: '已有挑战',
      dataIndex: 'existingChallengesCount',
      key: 'existingChallengesCount',
      width: 100,
      render: (count) => `${count || 0} 个`,
    },
    {
      title: '节假日',
      dataIndex: 'holidaysCount',
      key: 'holidaysCount',
      width: 100,
      render: (count) => `${count || 0} 个`,
    },
    {
      title: '热点',
      dataIndex: 'trendingCount',
      key: 'trendingCount',
      width: 100,
      render: (count) => `${count || 0} 个`,
    },
    {
      title: '创建挑战',
      dataIndex: 'createdChallengesCount',
      key: 'createdChallengesCount',
      width: 100,
      render: (count) => (
        <Tag color={count > 0 ? 'success' : 'default'}>
          {count || 0} 个
        </Tag>
      ),
    },
    {
      title: '耗时',
      dataIndex: 'executionTimeMs',
      key: 'executionTimeMs',
      width: 100,
      render: (ms) => `${(ms / 1000).toFixed(2)}s`,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showDetail(record.id)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="trigger">
        <TabPane
          tab={
            <span>
              <ThunderboltOutlined />
              触发决策
            </span>
          }
          key="trigger"
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px',
          }}>
            {/* 左侧：系统说明 */}
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `2px solid ${token.colorPrimary}20`,
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${token.colorPrimary}15, ${token.colorPrimary}05)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  <RobotOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: token.colorTextHeading }}>
                    AI 智能决策系统
                  </div>
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                    基于多维度数据智能分析
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: token.colorTextHeading,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <BulbOutlined style={{ marginRight: '6px', color: token.colorWarning }} />
                  分析维度
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr', 
                  gap: '8px',
                }}>
                  {[
                    { icon: '📊', text: '当前已有的挑战任务（进行中 + 30天内开始的）' },
                    { icon: '📅', text: '未来60天的节假日信息' },
                    { icon: '🔥', text: '当前 Top 10 热点话题' },
                    { icon: '🧠', text: '基于5大决策原则进行智能分析' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 12px',
                        background: token.colorBgContainer,
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: token.colorText,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = token.colorPrimary + '08';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = token.colorBgContainer;
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: token.colorTextHeading,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <BulbOutlined style={{ marginRight: '6px', color: token.colorPrimary }} />
                  决策原则
                </div>
                <div style={{
                  padding: '12px',
                  background: `linear-gradient(135deg, ${token.colorPrimary}08, ${token.colorInfo}08)`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: token.colorText,
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      '节假日15-30天前创建',
                      '热点适合AI创作且热度高',
                      '避免重复主题',
                      '控制频率（每周2-3个）',
                      '质量优先',
                    ].map((principle, index) => (
                      <Tag
                        key={index}
                        color={index % 2 === 0 ? 'blue' : 'cyan'}
                        style={{ 
                          margin: 0,
                          borderRadius: '4px',
                          border: 'none',
                        }}
                      >
                        {principle}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 右侧：触发操作区 */}
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${token.colorBorderSecondary}`,
                background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorPrimary}03 100%)`,
              }}
              bodyStyle={{ 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${token.colorPrimary}30`,
                }}>
                  <ThunderboltOutlined style={{ fontSize: '40px', color: '#fff' }} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: token.colorTextHeading, marginBottom: '8px' }}>
                  手动触发 AI 决策
                </div>
                <div style={{ fontSize: '13px', color: token.colorTextSecondary, marginBottom: '16px' }}>
                  AI 会综合分析所有信息，决定是否创建新的挑战任务
                </div>
                <Tag 
                  color="processing" 
                  style={{ 
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                  }}
                >
                  ⏰ 每天凌晨1点自动执行
                </Tag>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                onClick={triggerAiDecision}
                loading={loading}
                block
                style={{ 
                  height: '56px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd)`,
                  border: 'none',
                  boxShadow: `0 4px 12px ${token.colorPrimary}30`,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 16px ${token.colorPrimary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${token.colorPrimary}30`;
                }}
              >
                {loading ? 'AI 正在分析中...' : '立即触发 AI 智能决策'}
              </Button>
            </Card>
          </div>

          {/* 决策结果 */}
          {hasExecuted && (
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${token.colorBorderSecondary}`,
                marginTop: '20px',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: `2px solid ${decisions.length > 0 ? token.colorSuccess + '20' : token.colorInfo + '20'}`,
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${decisions.length > 0 ? token.colorSuccess : token.colorInfo}15, ${decisions.length > 0 ? token.colorSuccess : token.colorInfo}05)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  {decisions.length > 0 ? (
                    <CheckCircleOutlined style={{ fontSize: '20px', color: token.colorSuccess }} />
                  ) : (
                    <CloseCircleOutlined style={{ fontSize: '20px', color: token.colorInfo }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: token.colorTextHeading }}>
                    AI 决策结果
                  </div>
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                    {decisions.length > 0 
                      ? `成功创建 ${decisions.length} 个挑战任务` 
                      : '当前无需创建新挑战'}
                  </div>
                </div>
              </div>

              {decisions.length === 0 ? (
                <div style={{ padding: '40px 20px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 16px',
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${token.colorInfo}15, ${token.colorInfo}05)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CloseCircleOutlined style={{ fontSize: '32px', color: token.colorInfo }} />
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: token.colorTextHeading, marginBottom: '8px' }}>
                      AI 决定不创建新挑战
                    </div>
                    <div style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                      经过综合分析，AI 认为当前无需创建新的挑战任务
                    </div>
                  </div>
                  <Alert
                    message="可能的原因"
                    description={
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '8px',
                        marginTop: '12px',
                      }}>
                        {[
                          '当前已有足够多的挑战任务进行中',
                          '最近的节假日时间还不到创建窗口期（15-30天前）',
                          '当前热点话题不适合 AI 图像创作',
                          '为了控制频率，避免用户疲劳',
                        ].map((reason, index) => (
                          <div
                            key={index}
                            style={{
                              padding: '8px 12px',
                              background: token.colorBgContainer,
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: token.colorText,
                            }}
                          >
                            • {reason}
                          </div>
                        ))}
                      </div>
                    }
                    type="info"
                    showIcon
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <Alert
                      message={`AI 已分析并决定创建 ${decisions.length} 个挑战任务（待审核状态）`}
                      type="success"
                      showIcon
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <Timeline 
                    mode="left" 
                    style={{ marginTop: '20px' }}
                    items={decisions.map((decision, index) => ({
                      key: index,
                      color: token.colorSuccess,
                      dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card
                          size="small"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '8px',
                            border: `1px solid ${token.colorSuccess}30`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '12px',
                            paddingBottom: '12px',
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                          }}>
                            <Tag color="gold" style={{ marginRight: '8px', borderRadius: '4px' }}>
                              挑战 #{decision.challengeId}
                            </Tag>
                            <strong style={{ fontSize: '15px', color: token.colorTextHeading }}>
                              {decision.title}
                            </strong>
                          </div>
                          <Descriptions column={1} size="small" style={{ marginTop: '8px' }}>
                            <Descriptions.Item label="挑战描述">
                              <div style={{ 
                                color: token.colorText,
                                fontSize: '13px',
                                lineHeight: '1.6',
                              }}>
                                {decision.description?.substring(0, 150)}
                                {decision.description?.length > 150 ? '...' : ''}
                              </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="推荐标签">
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {decision.requiredTags && JSON.parse(decision.requiredTags).map((tag, i) => (
                                  <Tag key={i} color="blue" style={{ margin: 0, borderRadius: '4px' }}>
                                    {tag}
                                  </Tag>
                                ))}
                              </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="推荐模型">
                              <Tag color="purple" style={{ borderRadius: '4px' }}>
                                {decision.requiredModel}
                              </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="AI 建议">
                              <Alert
                                message={decision.aiInsight}
                                type="info"
                                showIcon
                                icon={<BulbOutlined />}
                                style={{ borderRadius: '6px', marginTop: '4px' }}
                              />
                            </Descriptions.Item>
                            <Descriptions.Item label="状态">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag color="orange" style={{ borderRadius: '4px' }}>待审核</Tag>
                                <span style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                                  请在挑战管理页面审核后发布
                                </span>
                              </div>
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      ),
                    }))}
                  />
                </div>
              )}
            </Card>
          )}

          {/* 初始状态 */}
          {!hasExecuted && !loading && (
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${token.colorBorderSecondary}`,
                marginTop: '20px',
              }}
              bodyStyle={{ padding: '60px 20px' }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ color: token.colorTextSecondary }}>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                      尚未执行 AI 决策
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      点击上方按钮开始智能决策分析
                    </div>
                  </div>
                }
              />
            </Card>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              历史记录
            </span>
          }
          key="history"
        >
          <Card
            title="AI 决策历史记录"
            extra={
              <Button
                icon={<HistoryOutlined />}
                onClick={fetchHistory}
                loading={historyLoading}
              >
                刷新
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={historyData}
              rowKey="id"
              loading={historyLoading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: historyTotal,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 详情弹窗 */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            fontSize: '18px',
            fontWeight: 600,
          }}>
            <RobotOutlined style={{ color: token.colorPrimary, fontSize: '20px' }} />
            <span>AI 决策记录详情</span>
            {selectedRecord && (
              <Tag color={
                selectedRecord.decisionResult === 'created' ? 'success' : 
                selectedRecord.decisionResult === 'error' ? 'error' : 'default'
              }>
                {selectedRecord.decisionResultText}
              </Tag>
            )}
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1100}
        centered
        bodyStyle={{ padding: '24px', maxHeight: '75vh', overflow: 'auto' }}
        destroyOnClose
      >
        {selectedRecord && (
          <div>
            {/* 概览卡片 */}
            <Card 
              style={{ 
                marginBottom: 20,
                borderRadius: '8px',
                border: `1px solid ${token.colorPrimary}30`,
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ marginBottom: 16 }}>
                <BulbOutlined style={{ color: token.colorPrimary, marginRight: 8, fontSize: '16px' }} />
                <span style={{ fontSize: '16px', fontWeight: 600 }}>决策概览</span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '16px',
              }}>
                <div style={{ 
                  background: token.colorBgContainer, 
                  padding: '12px 16px', 
                  borderRadius: '6px',
                  borderLeft: `3px solid ${token.colorInfo}`,
                }}>
                  <div style={{ fontSize: '12px', opacity: 0.65, marginBottom: 4 }}>决策时间</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedRecord.decisionTime}</div>
                </div>
                <div style={{ 
                  background: token.colorBgContainer, 
                  padding: '12px 16px', 
                  borderRadius: '6px',
                  borderLeft: `3px solid ${selectedRecord.decisionType === 'auto' ? token.colorInfo : token.colorPrimary}`,
                }}>
                  <div style={{ fontSize: '12px', opacity: 0.65, marginBottom: 4 }}>决策类型</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    <Tag color={selectedRecord.decisionType === 'auto' ? 'blue' : 'purple'}>
                      {selectedRecord.decisionTypeText}
                    </Tag>
                  </div>
                </div>
                <div style={{ 
                  background: token.colorBgContainer, 
                  padding: '12px 16px', 
                  borderRadius: '6px',
                  borderLeft: `3px solid ${token.colorPrimary}`,
                }}>
                  <div style={{ fontSize: '12px', opacity: 0.65, marginBottom: 4 }}>执行耗时</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {(selectedRecord.executionTimeMs / 1000).toFixed(2)} 秒
                  </div>
                </div>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '12px',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: token.colorPrimary }}>
                    {selectedRecord.existingChallengesCount || 0}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.5, marginTop: 4 }}>已有挑战</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: token.colorInfo }}>
                    {selectedRecord.holidaysCount || 0}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.5, marginTop: 4 }}>节假日</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: token.colorWarning }}>
                    {selectedRecord.trendingCount || 0}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.5, marginTop: 4 }}>热点话题</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: token.colorSuccess }}>
                    {selectedRecord.createdChallengesCount || 0}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.5, marginTop: 4 }}>创建挑战</div>
                </div>
              </div>
              {selectedRecord.errorMessage && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <Alert 
                    message="错误信息" 
                    description={selectedRecord.errorMessage} 
                    type="error" 
                    showIcon 
                  />
                </>
              )}
            </Card>

            {/* 生成的挑战任务 */}
            {selectedRecord.relatedChallenges && selectedRecord.relatedChallenges.length > 0 && (
              <Card 
                style={{ 
                  marginBottom: 20,
                  borderRadius: '8px',
                  border: `1px solid ${token.colorSuccess}30`,
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <CheckCircleOutlined style={{ color: token.colorSuccess, marginRight: 8, fontSize: '16px' }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>生成的挑战任务</span>
                    <Tag color="success" style={{ marginLeft: 12 }}>
                      {selectedRecord.relatedChallenges.length} 个
                    </Tag>
                  </div>
                </div>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {selectedRecord.relatedChallenges.map((challenge, index) => (
                    <Card
                      key={challenge.id}
                      size="small"
                      style={{ 
                        borderRadius: '6px',
                        transition: 'all 0.3s',
                      }}
                      bodyStyle={{ padding: '16px' }}
                      hoverable
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: 12,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Tag color="purple">
                            #{challenge.id}
                          </Tag>
                          <span style={{ fontSize: '15px', fontWeight: 600 }}>
                            {challenge.title}
                          </span>
                        </div>
                        <Tag color={
                          challenge.status === 0 ? 'warning' : 
                          challenge.status === 1 ? 'success' : 'default'
                        }>
                          {getStatusText(challenge.status)}
                        </Tag>
                      </div>
                      
                      <div style={{ 
                        background: token.colorBgContainer, 
                        padding: '12px', 
                        borderRadius: '4px',
                        marginBottom: 12,
                        opacity: 0.9,
                      }}>
                        <div style={{ 
                          fontSize: '13px', 
                          lineHeight: '1.6', 
                          maxHeight: '80px',
                          overflow: 'auto',
                        }}>
                          {challenge.description}
                        </div>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '12px',
                      }}>
                        <div>
                          <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: 6 }}>推荐标签</div>
                          <div>
                            {challenge.requiredTags && (() => {
                              try {
                                return JSON.parse(challenge.requiredTags).map((tag, i) => (
                                  <Tag key={i} color="blue" style={{ marginBottom: 4 }}>
                                    {tag}
                                  </Tag>
                                ));
                              } catch (e) {
                                return <span style={{ fontSize: '13px' }}>{challenge.requiredTags}</span>;
                              }
                            })()}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: 6 }}>推荐模型</div>
                          <Tag color="cyan">
                            {challenge.requiredModel || '未指定'}
                          </Tag>
                        </div>
                      </div>

                      <Divider style={{ margin: '12px 0' }} />

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '8px',
                        fontSize: '12px',
                      }}>
                        <div>
                          <span style={{ opacity: 0.5 }}>开始：</span>
                          <span style={{ marginLeft: 4 }}>{challenge.startTime}</span>
                        </div>
                        <div>
                          <span style={{ opacity: 0.5 }}>截止：</span>
                          <span style={{ marginLeft: 4 }}>{challenge.endTime}</span>
                        </div>
                        <div>
                          <span style={{ opacity: 0.5 }}>投票截止：</span>
                          <span style={{ marginLeft: 4 }}>{challenge.votingEndTime}</span>
                        </div>
                      </div>

                      {challenge.rewardsConfig && (
                        <>
                          <Divider style={{ margin: '12px 0' }} />
                          <div>
                            <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: 6 }}>奖励配置</div>
                            <pre style={{ 
                              margin: 0, 
                              fontSize: '12px', 
                              background: token.colorBgContainer, 
                              padding: '8px', 
                              borderRadius: '4px',
                              border: `1px solid ${token.colorBorder}`,
                              lineHeight: '1.5',
                              opacity: 0.9,
                            }}>
                              {JSON.stringify(JSON.parse(challenge.rewardsConfig), null, 2)}
                            </pre>
                          </div>
                        </>
                      )}

                      {challenge.coverUrl && (
                        <>
                          <Divider style={{ margin: '12px 0' }} />
                          <div>
                            <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: 6 }}>封面图</div>
                            <img 
                              src={challenge.coverUrl} 
                              alt="封面" 
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '200px',
                                borderRadius: '4px',
                                border: `1px solid ${token.colorBorder}`,
                              }} 
                            />
                          </div>
                        </>
                      )}
                    </Card>
                  ))}
                </Space>
              </Card>
            )}

            {/* 上下文快照和AI响应 */}
            {(selectedRecord.contextSnapshot || selectedRecord.aiResponse) && (
              <Tabs 
                defaultActiveKey="context" 
                type="card"
              >
                {selectedRecord.contextSnapshot && (
                  <TabPane 
                    tab={
                      <span>
                        <HistoryOutlined style={{ marginRight: 6 }} />
                        上下文快照
                      </span>
                    } 
                    key="context"
                  >
                    <div style={{ 
                      background: token.colorBgContainer, 
                      padding: '16px',
                      borderRadius: '0 0 6px 6px',
                      border: `1px solid ${token.colorBorder}`,
                      borderTop: 'none',
                    }}>
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '12px', 
                        lineHeight: '1.6',
                        maxHeight: '400px', 
                        overflow: 'auto',
                        margin: 0,
                      }}>
                        {selectedRecord.contextSnapshot}
                      </pre>
                    </div>
                  </TabPane>
                )}

                {selectedRecord.aiResponse && (
                  <TabPane 
                    tab={
                      <span>
                        <RobotOutlined style={{ marginRight: 6 }} />
                        AI 原始响应
                      </span>
                    } 
                    key="aiResponse"
                  >
                    <div style={{ 
                      background: token.colorBgContainer, 
                      padding: '16px',
                      borderRadius: '0 0 6px 6px',
                      border: `1px solid ${token.colorBorder}`,
                      borderTop: 'none',
                    }}>
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '12px', 
                        lineHeight: '1.6',
                        maxHeight: '400px', 
                        overflow: 'auto',
                        margin: 0,
                      }}>
                        {selectedRecord.aiResponse}
                      </pre>
                    </div>
                  </TabPane>
                )}
              </Tabs>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AiDecisionPanel;
