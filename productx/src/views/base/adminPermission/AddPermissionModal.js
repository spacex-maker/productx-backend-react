import React from 'react';
import { Input, Modal, Form, Switch, Tooltip, Select } from 'antd';
import { UserOutlined, TranslationOutlined, FileTextOutlined, CheckCircleOutlined, PlusOutlined, MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined, LockOutlined, UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddPermissionModal = ({ isVisible, onCancel, onFinish, form }) => {
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
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
    >
      <Form 
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="small"
      >
        {/* 权限类型 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              权限类型
              <Tooltip title="选择权限的类型，不同类型的权限用于不同的场景">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="type"
          rules={[{ required: true, message: '请选择权限类型' }]}
          style={{ marginBottom: '8px' }}
          initialValue={1}
        >
          <Select style={{ fontSize: '10px' }}>
            <Option value={1}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                <MenuOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                <span style={{ color: '#1890ff' }}>菜单权限</span>
              </div>
            </Option>
            <Option value={2}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                <ApiOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
                <span style={{ color: '#52c41a' }}>接口权限</span>
              </div>
            </Option>
            <Option value={3}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                <ControlOutlined style={{ marginRight: '4px', color: '#722ed1' }} />
                <span style={{ color: '#722ed1' }}>按钮权限</span>
              </div>
            </Option>
            <Option value={4}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                <AppstoreOutlined style={{ marginRight: '4px', color: '#fa8c16' }} />
                <span style={{ color: '#fa8c16' }}>业务权限</span>
              </div>
            </Option>
          </Select>
        </Form.Item>

        {/* 权限名称 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              权限名称
              <Tooltip title="权限的中文名称，用于显示">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="permissionName"
          rules={[{ required: true, message: '请输入权限名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入权限名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        {/* 英文权限名称 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              英文权限名称
              <Tooltip title="权限的英文标识，用于程序内部识别">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="permissionNameEn"
          rules={[{ required: true, message: '请输入英文权限名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入英文权限名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        {/* 权限描述 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              权限描述
              <Tooltip title="详细描述该权限的用途和作用范围">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea
            placeholder="请输入权限描述"
            rows={3}
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        {/* 启用状态 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              启用状态
              <Tooltip title="关闭权限状态后，所有拥有此权限的角色将无法使用此权限，为角色配置权限时，也无法查询到此权限">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="status"
          valuePropName="checked"
          initialValue={true}
          style={{ marginBottom: '8px' }}
        >
          <Switch
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren="×"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        {/* 系统权限 */}
        <Form.Item
          label={
            <span style={{ fontSize: '10px' }}>
              系统权限
              <Tooltip title="系统权限创建后不可删除，且不能被批量删除">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="isSystem"
          valuePropName="checked"
          initialValue={false}
          style={{ marginBottom: '8px' }}
        >
          <Switch
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
            style={{ fontSize: '10px' }}
          />
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-select-selector {
          height: 24px !important;
          padding: 0 8px !important;
        }

        .ant-select-selection-item {
          line-height: 22px !important;
          font-size: 10px !important;
        }

        .ant-select-item {
          min-height: 24px !important;
          line-height: 24px !important;
          padding: 0 8px !important;
        }

        .ant-select-item-option-content {
          font-size: 10px !important;
        }

        .ant-select-dropdown {
          font-size: 10px !important;
        }
      `}</style>
    </Modal>
  );
};

export default AddPermissionModal;
