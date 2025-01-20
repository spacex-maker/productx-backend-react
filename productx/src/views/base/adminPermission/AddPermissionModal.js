import React, { useState, useEffect } from 'react';
import { Input, Modal, Form, Switch, Tooltip, Select, Tag } from 'antd';
import {
  UserOutlined,
  TranslationOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MenuOutlined,
  ApiOutlined,
  ControlOutlined,
  AppstoreOutlined,
  LockOutlined,
  UnlockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const AddPermissionModal = ({ isVisible, onCancel, onFinish, form }) => {
  const [menuPermissions, setMenuPermissions] = useState([]);
  const [selectedType, setSelectedType] = useState(1);
  const [loading, setLoading] = useState(false);

  // 获取菜单类型的权限列表
  const fetchMenuPermissions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/manage/admin-permissions/list', {
        params: {
          currentPage: 1,
          pageSize: 500, // 获取所有菜单权限
          type: 1, // 1表示菜单权限类型
        },
      });

      if (response) {
        setMenuPermissions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch menu permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchMenuPermissions();
    }
  }, [isVisible]);

  // 监听权限类型变化
  const handleTypeChange = (value) => {
    setSelectedType(value);
    // 如果切换到非菜单或按钮类型，清空父级权限选择
    if (value !== 1 && value !== 3) {
      form.setFieldValue('parentId', undefined);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <PlusOutlined className="modal-title-icon" />
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
        <Form.Item
          label={
            <span>
              权限类型
              <Tooltip title="选择权限的类型，不同类型的权限用于不同的场景">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="type"
          rules={[{ required: true, message: '请选择权限类型' }]}
          className="form-item"
          initialValue={1}
        >
          <Select>
            <Option value={1}>
              <div className="option-item menu">
                <MenuOutlined className="option-icon" />
                <span>菜单权限</span>
              </div>
            </Option>
            <Option value={2}>
              <div className="option-item api">
                <ApiOutlined className="option-icon" />
                <span>接口权限</span>
              </div>
            </Option>
            <Option value={3}>
              <div className="option-item button">
                <ControlOutlined className="option-icon" />
                <span>按钮权限</span>
              </div>
            </Option>
            <Option value={4}>
              <div className="option-item business">
                <AppstoreOutlined className="option-icon" />
                <span>业务权限</span>
              </div>
            </Option>
          </Select>
        </Form.Item>

        {/* 父级权限 - 仅在选择菜单或按钮权限时显示 */}
        {(selectedType === 1 || selectedType === 3) && (
          <Form.Item
            label={
              <span className="label-text">
                父级权限
                <Tooltip title={selectedType === 1 ? '选择上级菜单权限' : '选择所属的菜单权限'}>
                  <InfoCircleOutlined className="info-icon" />
                </Tooltip>
              </span>
            }
            name="parentId"
            rules={[
              {
                required: selectedType === 3,
                message: selectedType === 3 ? '按钮权限必须选择所属的菜单权限' : '',
              },
            ]}
            className="form-item"
          >
            <Select
              className="small-text"
              placeholder={selectedType === 1 ? '可选择上级菜单' : '请选择所属的菜单权限'}
              allowClear={selectedType === 1}
              optionFilterProp="children"
              showSearch
              loading={loading}
            >
              {menuPermissions.map((menu) => (
                <Option key={menu.id} value={menu.id}>
                  <div className={`option-item ${menu.isSystem ? 'system' : ''}`}>
                    <MenuOutlined className="option-icon" />
                    <span>{menu.permissionName}</span>
                    {menu.isSystem && (
                      <Tag color="#1890ff" className="system-tag">
                        系统
                      </Tag>
                    )}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* 权限名称 */}
        <Form.Item
          label={
            <span>
              权限名称
              <Tooltip title="权限的中文名称，用于显示">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="permissionName"
          rules={[{ required: true, message: '请输入权限名称' }]}
          className="form-item"
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入权限名称"
          />
        </Form.Item>

        {/* 英文权限名称 */}
        <Form.Item
          label={
            <span>
              英文权限名称
              <Tooltip title="权限的英文标识，用于程序内部识别">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="permissionNameEn"
          rules={[{ required: true, message: '请输入英文权限名称' }]}
          className="form-item"
        >
          <Input
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入英文权限名称"
          />
        </Form.Item>

        {/* 权限描述 */}
        <Form.Item
          label={
            <span>
              权限描述
              <Tooltip title="详细描述该权限的用途和作用范围">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
          className="form-item"
        >
          <Input.TextArea placeholder="请输入权限描述" rows={3} />
        </Form.Item>

        {/* 启用状态 */}
        <Form.Item
          label={
            <span>
              启用状态
              <Tooltip title="关闭权限状态后，所有拥有此权限的角色将无法使用此权限，为角色配置权限时，也无法查询到此权限">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="status"
          valuePropName="checked"
          initialValue={true}
          className="form-item"
        >
          <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren="×" />
        </Form.Item>

        {/* 系统权限 */}
        <Form.Item
          label={
            <span>
              系统权限
              <Tooltip title="系统权限创建后不可删除，且不能被批量删除">
                <InfoCircleOutlined className="info-icon" />
              </Tooltip>
            </span>
          }
          name="isSystem"
          valuePropName="checked"
          initialValue={false}
          className="form-item"
        >
          <Switch checkedChildren={<LockOutlined />} unCheckedChildren={<UnlockOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPermissionModal;
