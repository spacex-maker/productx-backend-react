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

  const getResultColor = (result) => {
    const colorMap = {
      created: 'success',
      no_need: 'default',
      error: 'error',
    };
    return colorMap[result] || 'default';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      auto: 'blue',
      manual: 'purple',
    };
    return colorMap[type] || 'default';
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
        <Tag color={getTypeColor(type)}>{record.decisionTypeText}</Tag>
      ),
    },
    {
      title: '决策结果',
      dataIndex: 'decisionResult',
      key: 'decisionResult',
      width: 120,
      render: (result, record) => (
        <Tag color={getResultColor(result)}>{record.decisionResultText}</Tag>
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
        <Tag color={count > 0 ? 'green' : 'default'}>
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
      fixed: 'right',
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
          {/* 说明卡片 */}
          <Card style={{ marginBottom: 20 }}>
            <Alert
              message="AI 智能决策系统"
              description={
                <div>
                  <p>
                    <strong>系统会自动分析以下信息：</strong>
                  </p>
                  <ul style={{ marginBottom: 0 }}>
                    <li>✅ 当前已有的挑战任务（进行中 + 30天内开始的）</li>
                    <li>✅ 未来60天的节假日信息</li>
                    <li>✅ 当前 Top 10 热点话题</li>
                    <li>✅ 基于5大决策原则进行智能分析</li>
                  </ul>
                  <Divider style={{ margin: '12px 0' }} />
                  <p style={{ marginBottom: 0 }}>
                    <BulbOutlined /> <strong>决策原则：</strong>
                    节假日15-30天前创建 | 热点适合AI创作且热度高 | 避免重复主题 | 控制频率（每周2-3个） | 质量优先
                  </p>
                </div>
              }
              type="info"
              showIcon
              icon={<RobotOutlined />}
            />
          </Card>

          {/* 触发按钮 */}
          <Card
            title="手动触发 AI 决策"
            extra={
              <Tag color="processing">每天凌晨1点自动执行</Tag>
            }
            style={{ marginBottom: 20 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <div>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  点击下方按钮，立即触发 AI 智能决策系统
                </p>
                <p style={{ fontSize: '14px', color: '#999' }}>
                  AI 会综合分析所有信息，决定是否创建新的挑战任务
                </p>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                onClick={triggerAiDecision}
                loading={loading}
                style={{ height: '50px', fontSize: '16px', padding: '0 40px' }}
              >
                触发 AI 智能决策
              </Button>
            </Space>
          </Card>

          {/* 决策结果 */}
          {hasExecuted && (
            <Card
              title={
                <Space>
                  <RobotOutlined />
                  AI 决策结果
                </Space>
              }
            >
              {decisions.length === 0 ? (
                <Result
                  icon={<CloseCircleOutlined style={{ color: '#1890ff' }} />}
                  title="AI 决定不创建新挑战"
                  subTitle="经过综合分析，AI 认为当前无需创建新的挑战任务"
                  extra={
                    <Alert
                      message="可能的原因"
                      description={
                        <ul style={{ marginBottom: 0, textAlign: 'left' }}>
                          <li>当前已有足够多的挑战任务进行中</li>
                          <li>最近的节假日时间还不到创建窗口期（15-30天前）</li>
                          <li>当前热点话题不适合 AI 图像创作</li>
                          <li>为了控制频率，避免用户疲劳</li>
                        </ul>
                      }
                      type="info"
                      showIcon
                    />
                  }
                />
              ) : (
                <Result
                  status="success"
                  icon={<CheckCircleOutlined />}
                  title={`成功创建 ${decisions.length} 个挑战任务`}
                  subTitle="AI 已分析并决定创建以下挑战任务（待审核状态）"
                  extra={
                    <Timeline mode="left" style={{ marginTop: 30, textAlign: 'left' }}>
                      {decisions.map((decision, index) => (
                        <Timeline.Item
                          key={index}
                          color="green"
                          dot={<CheckCircleOutlined style={{ fontSize: '16px' }} />}
                        >
                          <Card
                            size="small"
                            title={
                              <Space>
                                <Tag color="gold">挑战 #{decision.challengeId}</Tag>
                                <strong>{decision.title}</strong>
                              </Space>
                            }
                            style={{ maxWidth: 800 }}
                          >
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="挑战描述">
                                {decision.description?.substring(0, 100)}...
                              </Descriptions.Item>
                              <Descriptions.Item label="推荐标签">
                                {decision.requiredTags && JSON.parse(decision.requiredTags).map((tag, i) => (
                                  <Tag key={i} color="blue">{tag}</Tag>
                                ))}
                              </Descriptions.Item>
                              <Descriptions.Item label="推荐模型">
                                <Tag color="purple">{decision.requiredModel}</Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="AI 建议">
                                <Alert
                                  message={decision.aiInsight}
                                  type="info"
                                  showIcon
                                  icon={<BulbOutlined />}
                                />
                              </Descriptions.Item>
                              <Descriptions.Item label="状态">
                                <Tag color="orange">待审核</Tag>
                                <span style={{ marginLeft: 8, color: '#999' }}>
                                  请在挑战管理页面审核后发布
                                </span>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  }
                />
              )}
            </Card>
          )}

          {/* 初始状态 */}
          {!hasExecuted && !loading && (
            <Card>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="尚未执行 AI 决策，点击上方按钮开始"
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
        title="决策记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="决策时间" span={2}>
                {selectedRecord.decisionTime}
              </Descriptions.Item>
              <Descriptions.Item label="决策类型">
                <Tag color={getTypeColor(selectedRecord.decisionType)}>
                  {selectedRecord.decisionTypeText}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="决策结果">
                <Tag color={getResultColor(selectedRecord.decisionResult)}>
                  {selectedRecord.decisionResultText}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="已有挑战数">
                {selectedRecord.existingChallengesCount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="节假日数">
                {selectedRecord.holidaysCount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="热点数">
                {selectedRecord.trendingCount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="创建挑战数">
                <Tag color={selectedRecord.createdChallengesCount > 0 ? 'green' : 'default'}>
                  {selectedRecord.createdChallengesCount || 0}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="执行耗时" span={2}>
                {(selectedRecord.executionTimeMs / 1000).toFixed(2)} 秒
              </Descriptions.Item>
              {selectedRecord.createdChallengeIds && (
                <Descriptions.Item label="创建的挑战ID" span={2}>
                  {selectedRecord.createdChallengeIds}
                </Descriptions.Item>
              )}
              {selectedRecord.errorMessage && (
                <Descriptions.Item label="错误信息" span={2}>
                  <Alert message={selectedRecord.errorMessage} type="error" />
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedRecord.contextSnapshot && (
              <Card title="上下文快照" size="small" style={{ marginTop: 16 }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                  {selectedRecord.contextSnapshot}
                </pre>
              </Card>
            )}

            {selectedRecord.aiResponse && (
              <Card title="AI 原始响应" size="small" style={{ marginTop: 16 }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                  {selectedRecord.aiResponse}
                </pre>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AiDecisionPanel;
