import React from 'react';
import { Input, Modal, Form, Switch, Alert, Select } from 'antd';
import api from 'src/axiosInstance';
import { UserOutlined, TranslationOutlined, FileTextOutlined, CheckCircleOutlined, PlusOutlined, MenuOutlined, ApiOutlined, ControlOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddPermissionModal = ({ isVisible, onCancel, onFinish, parentId }) => {
  const [form] = Form.useForm();

  const handleAddPermissionOk = async () => {
    try {
      const values = await form.validateFields();

      const requestData = {
        permissionName: values.permissionName,
        permissionNameEn: values.permissionNameEn,
        parentId: parentId,
        description: values.description,
        type: values.type || 1,
        status: values.status || true,
      };

      await api.post('/manage/admin-permissions/create', requestData);
      form.resetFields();
      onFinish(parentId);
      onCancel();
    } catch (error) {
      console.error('Error adding permission:', error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 1:
        return '#1890ff';  // 蓝色 - 菜单
      case 2:
        return '#52c41a';  // 绿色 - 接口
      case 3:
        return '#722ed1';  // 紫色 - 按钮
      default:
        return '#bfbfbf';
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '12px', fontWeight: 500 }}>
          <PlusOutlined style={{ marginRight: '4px' }} />
          新增权限
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddPermissionOk}
      okText="提交"
      cancelText="取消"
      centered
      width={480}
      styles={{ padding: '12px 24px' }}
    >
      <Alert
        message="接口权限的新增一般由技术人员配置"
        type="warning"
        showIcon
        style={{ marginBottom: '12px', fontSize: '10px' }}
      />

      <Form 
        form={form} 
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="small"
      >
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>权限名称</span>}
          name="permissionName"
          rules={[{ required: true, message: '请输入权限名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="权限名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>权限英文名</span>}
          name="permissionNameEn"
          rules={[{ required: true, message: '请输入权限英文名' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="权限英文名"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>描述</span>}
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="描述"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>类型</span>}
          name="type"
          rules={[{ required: true, message: '请选择权限类型' }]}
          style={{ marginBottom: '8px' }}
          initialValue={1}
        >
          <Select
            style={{ fontSize: '10px' }}
            placeholder="请选择权限类型"
          >
            <Option value={1}>
              <MenuOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
              <span style={{ color: '#1890ff' }}>菜单</span>
            </Option>
            <Option value={2}>
              <ApiOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
              <span style={{ color: '#52c41a' }}>接口</span>
            </Option>
            <Option value={3}>
              <ControlOutlined style={{ marginRight: '4px', color: '#722ed1' }} />
              <span style={{ color: '#722ed1' }}>按钮</span>
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>是否生效</span>}
          name="status"
          valuePropName="checked"
          style={{ marginBottom: '8px' }}
        >
          <Switch 
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren="×"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-modal-header {
          padding: 12px 24px !important;
          border-bottom: 1px solid #f0f0f0;
        }

        .ant-modal-footer {
          padding: 8px 16px !important;
          border-top: 1px solid #f0f0f0;
        }

        .ant-modal-footer .ant-btn {
          font-size: 10px !important;
          height: 24px !important;
          padding: 0 12px !important;
        }

        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 24px !important;
        }

        .ant-form-item-explain-error {
          font-size: 10px !important;
        }

        .ant-input {
          font-size: 10px !important;
          padding: 4px 8px !important;
          color: rgba(0, 0, 0, 0.88) !important;
        }

        .ant-input-textarea textarea {
          font-size: 10px !important;
          padding: 4px 8px !important;
          color: rgba(0, 0, 0, 0.88) !important;
        }

        .ant-switch {
          min-width: 40px !important;
          height: 16px !important;
          line-height: 16px !important;
        }

        .ant-switch-inner {
          font-size: 10px !important;
        }

        .ant-form-item {
          margin-bottom: 8px !important;
        }

        .ant-input::placeholder {
          font-size: 10px !important;
          color: rgba(0, 0, 0, 0.25) !important;
        }

        .ant-form-item-required {
          font-size: 10px !important;
        }

        .ant-modal-close {
          height: 40px !important;
          width: 40px !important;
          line-height: 40px !important;
        }

        .ant-modal-close-x {
          font-size: 10px !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }

        .ant-select {
          font-size: 10px !important;
        }

        .ant-select-selector {
          height: 24px !important;
          padding: 0 8px !important;
        }

        .ant-select-selection-item {
          line-height: 22px !important;
          font-size: 10px !important;
          display: flex !important;
          align-items: center !important;
        }

        .ant-select-selection-item .anticon {
          margin-right: 4px !important;
        }

        .ant-select-item {
          min-height: 24px !important;
          line-height: 24px !important;
          font-size: 10px !important;
          padding: 2px 8px !important;
        }

        .ant-select-item-option-content {
          font-size: 10px !important;
          display: flex !important;
          align-items: center !important;
        }

        .ant-select-item-option-selected .anticon,
        .ant-select-item-option-selected span {
          color: inherit !important;
        }

        // 添加悬停效果
        .ant-select-item-option:hover .anticon,
        .ant-select-item-option:hover span {
          color: inherit !important;
        }
      `}</style>
    </Modal>
  );
};

export default AddPermissionModal;
