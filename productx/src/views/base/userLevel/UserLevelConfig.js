import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const UserLevelConfig = () => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
  const [levelForm] = Form.useForm();
  const [privilegeForm] = Form.useForm();
  const [editingLevel, setEditingLevel] = useState(null);
  const [editingPrivilege, setEditingPrivilege] = useState(null);
  const [privilegeLevelNum, setPrivilegeLevelNum] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await api.get('/manage/user-level-config/list');
      setLevels(list || []);
    } catch (e) {
      message.error('获取等级配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateLevel = () => {
    setEditingLevel(null);
    levelForm.resetFields();
    levelForm.setFieldsValue({ status: 1, sortOrder: 0, minExp: 0 });
    setLevelModalOpen(true);
  };

  const openEditLevel = (level) => {
    setEditingLevel(level);
    levelForm.setFieldsValue(level);
    setLevelModalOpen(true);
  };

  const submitLevel = async (values) => {
    try {
      if (editingLevel?.id) {
        await api.put('/manage/user-level-config/update', { ...values, id: editingLevel.id });
        message.success('等级更新成功');
      } else {
        await api.post('/manage/user-level-config/create', values);
        message.success('等级创建成功');
      }
      setLevelModalOpen(false);
      fetchData();
    } catch (e) {
      message.error('保存失败');
    }
  };

  const deleteLevel = async (id) => {
    try {
      await api.delete(`/manage/user-level-config/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const openCreatePrivilege = (levelNum) => {
    setPrivilegeLevelNum(levelNum);
    setEditingPrivilege(null);
    privilegeForm.resetFields();
    privilegeForm.setFieldsValue({
      levelNum,
      status: 1,
      sortOrder: 0,
      valueType: 'string',
    });
    setPrivilegeModalOpen(true);
  };

  const openEditPrivilege = (privilege) => {
    setPrivilegeLevelNum(privilege.levelNum);
    setEditingPrivilege(privilege);
    privilegeForm.setFieldsValue(privilege);
    setPrivilegeModalOpen(true);
  };

  const submitPrivilege = async (values) => {
    try {
      if (editingPrivilege?.id) {
        await api.put('/manage/user-level-config/privilege/update', { ...values, id: editingPrivilege.id });
        message.success('权益更新成功');
      } else {
        await api.post('/manage/user-level-config/privilege/create', values);
        message.success('权益创建成功');
      }
      setPrivilegeModalOpen(false);
      fetchData();
    } catch (e) {
      message.error('保存失败');
    }
  };

  const deletePrivilege = async (id) => {
    try {
      await api.delete(`/manage/user-level-config/privilege/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const privilegeColumns = [
    { title: '权益编码', dataIndex: 'privilegeCode', key: 'privilegeCode' },
    { title: '名称', dataIndex: 'privilegeName', key: 'privilegeName' },
    { title: '英文名', dataIndex: 'privilegeNameEn', key: 'privilegeNameEn' },
    { title: '值', dataIndex: 'privilegeValue', key: 'privilegeValue' },
    { title: '类型', dataIndex: 'valueType', key: 'valueType', width: 90 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (s) => (s === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>),
    },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 70 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditPrivilege(record)} />
          <Popconfirm title="确认删除？" onConfirm={() => deletePrivilege(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="mb-3">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateLevel}>
          新增等级
        </Button>
      </div>

      {levels.map((item) => {
        const level = item.level || {};
        const privileges = item.privileges || [];
        return (
          <Card
            key={level.id || level.levelNum}
            style={{ marginBottom: 16 }}
            title={
              <Space>
                <Tag color={level.badgeColor || 'blue'}>Lv.{level.levelNum}</Tag>
                <span>{level.name}</span>
                <span style={{ color: '#999', fontSize: 12 }}>最低经验 {level.minExp}</span>
                {level.status === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>}
              </Space>
            }
            extra={
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEditLevel(level)}>
                  编辑等级
                </Button>
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => openCreatePrivilege(level.levelNum)}>
                  添加权益
                </Button>
                <Popconfirm title="删除等级及其权益？" onConfirm={() => deleteLevel(level.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            }
          >
            {level.description && <p style={{ marginBottom: 12, color: '#666' }}>{level.description}</p>}
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              columns={privilegeColumns}
              dataSource={privileges}
              locale={{ emptyText: '暂无权益，点击「添加权益」' }}
            />
          </Card>
        );
      })}

      <Modal
        open={levelModalOpen}
        title={editingLevel ? '编辑等级' : '新增等级'}
        onCancel={() => setLevelModalOpen(false)}
        onOk={() => levelForm.submit()}
        width={560}
        destroyOnClose
      >
        <Form form={levelForm} layout="vertical" onFinish={submitLevel}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="levelNum" label="等级数字" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} disabled={!!editingLevel} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minExp" label="最低累计经验" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="name" label="等级名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nameEn" label="英文名称">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="badgeColor" label="徽章颜色">
                <Input placeholder="#3b82f6" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="icon" label="图标">
                <Input placeholder="trophy" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={[{ value: 1, label: '启用' }, { value: 0, label: '禁用' }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={privilegeModalOpen}
        title={editingPrivilege ? '编辑权益' : '新增权益'}
        onCancel={() => setPrivilegeModalOpen(false)}
        onOk={() => privilegeForm.submit()}
        width={560}
        destroyOnClose
      >
        <Form form={privilegeForm} layout="vertical" onFinish={submitPrivilege}>
          <Form.Item name="levelNum" label="等级" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item name="privilegeCode" label="权益编码" rules={[{ required: true }]}>
            <Input placeholder="DAILY_FREE_IMAGE" disabled={!!editingPrivilege} />
          </Form.Item>
          <Form.Item name="privilegeName" label="权益名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="privilegeNameEn" label="英文名称">
            <Input />
          </Form.Item>
          <Form.Item name="privilegeValue" label="权益值">
            <Input placeholder="数量、百分比或 true/false" />
          </Form.Item>
          <Form.Item name="valueType" label="值类型">
            <Select
              options={[
                { value: 'string', label: 'string' },
                { value: 'number', label: 'number' },
                { value: 'boolean', label: 'boolean' },
                { value: 'json', label: 'json' },
              ]}
            />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select options={[{ value: 1, label: '启用' }, { value: 0, label: '禁用' }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Spin>
  );
};

export default UserLevelConfig;
