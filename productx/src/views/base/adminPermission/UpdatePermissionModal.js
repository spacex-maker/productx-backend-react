import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Tooltip } from 'antd';
import { UserOutlined, TranslationOutlined, FileTextOutlined, CheckCircleOutlined, EditOutlined, LockOutlined, UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';

const UpdatePermissionModal = ({
                                 isVisible,
                                 onCancel,
                                 onOk,
                                 form,
                                 handleUpdatePermission,
                                 selectedPermission // 用于传递选中的权限信息
                               }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedPermission) {
      form.setFieldsValue({
        id: selectedPermission.id,
        permissionName: selectedPermission.permissionName,
        permissionNameEn: selectedPermission.permissionNameEn,
        description: selectedPermission.description,
        status: selectedPermission.status,
        isSystem: selectedPermission.isSystem,
      });
    }
  }, [isVisible, selectedPermission, form]);

  return (
    <Modal
      title={
        <div style={{ fontSize: '12px', fontWeight: 500 }}>
          <EditOutlined style={{ marginRight: '4px' }} />
          修改权限信息
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form 
        form={form} 
        onFinish={handleUpdatePermission}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="small"
      >
        {/* 隐藏ID字段 */}
        <Form.Item name="id" hidden>
          <Input />
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
              <Tooltip title="系统权限标识不可修改">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }} />
              </Tooltip>
            </span>
          }
          name="isSystem"
          valuePropName="checked"
          style={{ marginBottom: '8px' }}
        >
          <Switch
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
            style={{ fontSize: '10px' }}
            disabled
          />
        </Form.Item>
      </Form>
      
      {/* 添加样式部分 */}
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
      `}</style>
    </Modal>
  );
};

export default UpdatePermissionModal;
