import React from 'react';
import { Input, Modal, Form, Switch, Tooltip } from 'antd';
import { UserOutlined, TranslationOutlined, FileTextOutlined, CheckCircleOutlined, PlusOutlined, MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined, LockOutlined, UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';

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
    </Modal>
  );
};

export default AddPermissionModal;
