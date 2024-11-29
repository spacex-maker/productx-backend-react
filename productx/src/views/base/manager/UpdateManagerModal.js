import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Space } from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
import styled from 'styled-components';
import api from 'src/axiosInstance';
import { 
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined
} from '@ant-design/icons';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item-label > label {
      font-size: 10px;
      color: #666666;
      height: 20px;
    }

    .ant-input,
    .ant-select-selection-item,
    .ant-select-item-option-content,
    .ant-select-dropdown .ant-select-item,
    .ant-input-password input {
      font-size: 10px !important;
      color: #000000 !important;
    }

    .ant-input::placeholder,
    .ant-select-selection-placeholder {
      color: #999999 !important;
      font-size: 10px !important;
    }

    .ant-form-item {
      margin-bottom: 8px;
    }

    .ant-select-multiple .ant-select-selection-overflow {
      max-height: 52px;
      overflow-y: auto;
      padding: 2px 0;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #d9d9d9;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-track {
        background-color: #f0f0f0;
        border-radius: 2px;
      }
    }

    .ant-select-multiple .ant-select-selection-item {
      height: 16px;
      line-height: 14px;
      margin-top: 1px;
      margin-bottom: 1px;
      padding: 0 4px;
      
      .ant-select-selection-item-content {
        font-size: 10px;
      }
      
      .ant-select-selection-item-remove {
        font-size: 10px;
        margin-left: 2px;
      }
    }
  }
`

const UpdateManagerModal = ({
                              isVisible,
                              onCancel,
                              onOk,
                              form,
                              handleUpdateManager,
                              selectedManager
                            }) => {
  useEffect(() => {
    if (isVisible && selectedManager) {
      fetchManagerData(selectedManager.id);
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

  return (
    <StyledModal
      title={<Space><UserOutlined />修改管理员用户</Space>}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
    >
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
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
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
          />
        </Form.Item>

        <Form.Item name="status" initialValue={true} hidden>
          <Input />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default UpdateManagerModal;
