import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Space, Tag, message } from 'antd';
import api from 'src/axiosInstance';

const LogisticsProviderRoutesManageModel = ({
  isVisible,
  onCancel,
  provider
}) => {
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

  const fetchProviderRoutes = async () => {
    if (!provider?.id) return;
    
    setLoading(true);
    try {
      const response = await api.get('/manage/logistics-provider-routes/list', {
        params: {
          providerId: provider.id
        }
      });
      if (response) {
        setRoutes(response.data || []);
      }
    } catch (error) {
      message.error('获取路线数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && provider) {
      fetchProviderRoutes();
    }
  }, [isVisible, provider]);

  const renderTransportTypes = (record) => {
    const types = [];
    if (record.airFreight) types.push(<Tag color="blue" key="air">空运</Tag>);
    if (record.seaFreight) types.push(<Tag color="green" key="sea">海运</Tag>);
    if (record.landFreight) types.push(<Tag color="orange" key="land">陆运</Tag>);
    return <Space>{types}</Space>;
  };

  const renderServiceQualityTag = (quality) => {
    const colorMap = {
      '经济': 'blue',
      '标准': 'green',
      '优先': 'orange'
    };
    return <Tag color={colorMap[quality]}>{quality}</Tag>;
  };

  const renderStatus = (status) => {
    const statusMap = {
      0: { color: 'error', text: '禁用' },
      1: { color: 'success', text: '启用' },
      2: { color: 'processing', text: '内测中' },
      3: { color: 'warning', text: '暂停' }
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '路线ID',
      dataIndex: 'routeId',
      key: 'routeId',
    },
    {
      title: '运输方式',
      key: 'transportTypes',
      render: renderTransportTypes,
    },
    {
      title: '服务质量',
      dataIndex: 'serviceQuality',
      key: 'serviceQuality',
      render: renderServiceQualityTag,
    },
    {
      title: '估算费用',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      render: (cost) => `¥${cost.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }
  ];

  return (
    <Modal
      title={`物流提供商 ${provider?.id} - 线路管理`}
      open={isVisible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={routes}
        rowKey="id"
        pagination={false}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default LogisticsProviderRoutesManageModel; 