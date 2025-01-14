import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Space, Tag } from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
import api from 'src/axiosInstance';
import { 
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined
} from '@ant-design/icons';

const UpdateManagerModal = ({
                              isVisible,
                              onCancel,
                              onOk,
                              form,
                              handleUpdateManager,
                              selectedManager
                            }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isVisible && selectedManager) {
      setLoading(true);
      fetchManagerData(selectedManager.id)
        .then(() => {
          setShowModal(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setShowModal(false);
    }
  }, [isVisible, selectedManager]);

  const fetchManagerData = async (managerId) => {
    try {
      const managerData = await api.get('/manage/manager/get-by-id?id='+managerId);

        form.setFieldsValue({
          id: managerData.id,
          username: managerData.username,
          email: managerData.email,
          phone: managerData.phone,
          password: '', // 密码默认为空
          confirmPassword: '', // 确认密码默认为空
          roleIds: managerData.roles.map(role => role.roleId),
          status: managerData.status
        });
    } catch (error) {
      console.error('Failed to fetch manager data:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        id: values.id,
        password: values.password,
        email: values.email,
        phone: values.phone,
        roleIds: values.roleIds,
        status: values.status
      };
      await handleUpdateManager(formData);
    } catch (error) {
      console.error('Failed to update manager:', error);
    }
  };

  // 更新角色标签颜色映射，使用更柔和的颜色
  const roleColors = [
    { bg: '#e6f7ff', border: '#91d5ff', text: '#1890ff' }, // 蓝色系
    { bg: '#f6ffed', border: '#b7eb8f', text: '#52c41a' }, // 绿色系
    { bg: '#f9f0ff', border: '#d3adf7', text: '#722ed1' }, // 紫色系
    { bg: '#fff7e6', border: '#ffd591', text: '#fa8c16' }, // 橙色系
    { bg: '#e6fffb', border: '#87e8de', text: '#13c2c2' }, // 青色系
    { bg: '#fff0f6', border: '#ffadd2', text: '#eb2f96' }, // 粉色系
    { bg: '#f8f8f8', border: '#d9d9d9', text: '#595959' }, // 灰色系
    { bg: '#fff1f0', border: '#ffa39e', text: '#f5222d' }, // 红色系
    { bg: '#fff2e8', border: '#ffbb96', text: '#fa541c' }, // 橘色系
    { bg: '#fcffe6', border: '#eaff8f', text: '#a0d911' }  // 青柠色系
  ];

  // 自定义角色选择的下拉选项渲染
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    
    // 添加安全检查
    if (!value) {
      return (
        <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
          {label || '未知角色'}
        </Tag>
      );
    }

    const colorIndex = Math.abs(hashCode(value.toString())) % roleColors.length;
    const color = roleColors[colorIndex];

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
          background: color.bg,
          borderColor: color.border,
          color: color.text,
          fontSize: '12px',
          padding: '2px 8px',
          borderRadius: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <TeamOutlined style={{ fontSize: '12px' }} />
        {label || '未知角色'}
      </Tag>
    );
  };

  // 改进哈希函数，添加安全检查
  const hashCode = (str) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash); // 确保返回正数
  };

  return (
    <Modal
      title={<Space><UserOutlined />修改管理员用户</Space>}
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        onCancel();
      }}
      onOk={() => form.submit()}
      width={650}
    >
      {!loading && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label={<Space><UserOutlined />用户名</Space>}
            name="username"
          >
            <Input 
              disabled
              placeholder="用户名"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<Space><LockOutlined />新密码</Space>}
                name="password"
                rules={[{ required: false }]}
              >
                <Input.Password 
                  placeholder="请输入新密码"
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Space><LockOutlined />确认新密码</Space>}
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const password = getFieldValue('password');
                      if (!password || !value) {
                        return Promise.resolve();
                      }
                      if (password === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  placeholder="请再次输入新密码"
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Space><MailOutlined />邮箱</Space>}
            name="email"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input 
              placeholder="请输入邮箱"
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>

          <Form.Item
            label={<Space><PhoneOutlined />手机号</Space>}
            name="phone"
          >
            <Input 
              placeholder="请输入手机号"
              prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>

          <Form.Item
            label={<Space><TeamOutlined />角色</Space>}
            name="roleIds"
          >
            <RoleSelect
              mode="multiple"
              placeholder="请选择角色"
              showSearch
              filterOption={false}
              style={{ width: '100%' }}
              tagRender={tagRender}
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item name="status" initialValue={true} hidden>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateManagerModal;
