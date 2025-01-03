import React from 'react';
import { Input, Modal, Form, Switch, Tooltip, Select } from 'antd';
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

      if (response && response.data) {
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
            <span>
              权限类型
              <Tooltip title="选择权限的类型，不同类型的权限用于不同的场景">
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
              </Tooltip>
            </span>
          }
          name="type"
          rules={[{ required: true, message: '请选择权限类型' }]}
          style={{ marginBottom: '8px' }}
          initialValue={1}
        >
          <Select>
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

        {/* 父级权限 - 仅在选择菜单或按钮权限时显示 */}
        {(selectedType === 1 || selectedType === 3) && (
          <Form.Item
            label={
              <span style={{ fontSize: '10px' }}>
                父级权限
                <Tooltip title={selectedType === 1 ? '选择上级菜单权限' : '选择所属的菜单权限'}>
                  <InfoCircleOutlined
                    style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                  />
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
            style={{ marginBottom: '8px' }}
          >
            <Select
              style={{ fontSize: '10px' }}
              placeholder={selectedType === 1 ? '可选择上级菜单' : '请选择所属的菜单权限'}
              allowClear={selectedType === 1}
              optionFilterProp="children"
              showSearch
              loading={loading}
            >
              {menuPermissions.map((menu) => (
                <Option key={menu.id} value={menu.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '10px',
                      color: menu.isSystem ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    <MenuOutlined style={{ marginRight: '4px' }} />
                    <span>{menu.permissionName}</span>
                    {menu.isSystem && (
                      <Tag
                        color="#1890ff"
                        style={{
                          marginLeft: '4px',
                          fontSize: '10px',
                          padding: '0 4px',
                          lineHeight: '16px',
                        }}
                      >
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
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
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
          />
        </Form.Item>

        {/* 英文权限名称 */}
        <Form.Item
          label={
            <span>
              英文权限名称
              <Tooltip title="权限的英文标识，用于程序内部识别">
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
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
          />
        </Form.Item>

        {/* 权限描述 */}
        <Form.Item
          label={
            <span>
              权限描述
              <Tooltip title="详细描述该权限的用途和作用范围">
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
              </Tooltip>
            </span>
          }
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea placeholder="请输入权限描述" rows={3} />
        </Form.Item>

        {/* 启用状态 */}
        <Form.Item
          label={
            <span>
              启用状态
              <Tooltip title="关闭权限状态后，所有拥有此权限的角色将无法使用此权限，为角色配置权限时，也无法查询到此权限">
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
              </Tooltip>
            </span>
          }
          name="status"
          valuePropName="checked"
          initialValue={true}
          style={{ marginBottom: '8px' }}
        >
          <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren="×" />
        </Form.Item>

        {/* 系统权限 */}
        <Form.Item
          label={
            <span>
              系统权限
              <Tooltip title="系统权限创建后不可删除，且不能被批量删除">
                <InfoCircleOutlined
                  style={{ marginLeft: '4px', color: '#1890ff', fontSize: '10px' }}
                />
              </Tooltip>
            </span>
          }
          name="isSystem"
          valuePropName="checked"
          initialValue={false}
          style={{ marginBottom: '8px' }}
        >
          <Switch checkedChildren={<LockOutlined />} unCheckedChildren={<UnlockOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPermissionModal;
