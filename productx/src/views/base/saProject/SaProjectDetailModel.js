import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Descriptions, Spin, Button, Space, Avatar, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import StaffDetailModal from './StaffDetailModal';

const { Text } = Typography;

const SaProjectDetailModel = ({
  visible,
  onCancel,
  projectData
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isStaffDetailVisible, setIsStaffDetailVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (visible && projectData?.id) {
      fetchStaffList(projectData.id);
    }
  }, [visible, projectData]);

  const fetchStaffList = async (projectId) => {
    setLoading(true);
    try {
      const data = await api.get(`/manage/sa-ai-agent-project/project/${projectId}`);
      setStaffList(data);
    } catch (error) {
      console.error('获取员工列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffDetailClick = (staff) => {
    setSelectedStaff(staff);
    setIsStaffDetailVisible(true);
  };

  const items = [
    {
      key: '1',
      label: t('projectInfo'),
      children: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('userInfo')}>
            <Space align="center" size={12}>
              <Avatar src={projectData?.avatar} size={48} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Text strong style={{ fontSize: '16px' }}>{projectData?.nickname}</Text>
                <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
                  <Text type="secondary">{projectData?.username}</Text>
                  <Text type="secondary">•</Text>
                  <Text type="secondary">ID: {projectData?.userId}</Text>
                </div>
              </div>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={t('projectName')}>{projectData?.name}</Descriptions.Item>
          <Descriptions.Item label={t('description')}>{projectData?.description}</Descriptions.Item>
          <Descriptions.Item label={t('visibility')}>{t(projectData?.visibility)}</Descriptions.Item>
          <Descriptions.Item label={t('status')}>{t(projectData?.status)}</Descriptions.Item>
          <Descriptions.Item label={t('createTime')}>{projectData?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('updateTime')}>{projectData?.updateTime}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: '2',
      label: t('staffInfo'),
      children: (
        <Spin spinning={loading}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>{t('agentInfo')}</th>
                  <th style={{ width: '15%' }}>{t('mbtiCode')}</th>
                  <th style={{ width: '15%' }}>{t('priority')}</th>
                  <th style={{ width: '15%' }}>{t('operation')}</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((item) => (
                  <tr key={item.id} className="record-font">
                    <td style={{ width: '40%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar src={item.avatarUrl} size={48} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <Text strong style={{ fontSize: '16px' }}>{item.agentName}</Text>
                          <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
                            <Text type="secondary">{item.modelType}</Text>
                            <Text type="secondary">•</Text>
                            <Text type="secondary">{item.roles}</Text>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '15%' }}>{item.mbtiCode}</td>
                    <td style={{ width: '15%' }}>{item.priority}</td>
                    <td style={{ width: '15%' }}>
                      <Button type="link" onClick={() => handleStaffDetailClick(item)}>
                        {t('detail')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Spin>
      )
    }
  ];

  return (
    <>
      <Modal
        title={t('projectDetails')}
        open={visible}
        onCancel={onCancel}
        width={1000}
        footer={null}
      >
        <Tabs items={items} />
      </Modal>

      <StaffDetailModal
        visible={isStaffDetailVisible}
        onCancel={() => setIsStaffDetailVisible(false)}
        staffData={selectedStaff}
      />
    </>
  );
};

export default SaProjectDetailModel; 