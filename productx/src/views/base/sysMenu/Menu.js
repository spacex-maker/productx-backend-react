import React, { useState, useEffect } from 'react'
import { Button, Form, Input, message, Select, Space, Tag, Switch, Spin, Modal } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, CaretRightOutlined } from '@ant-design/icons'
import * as icons from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from 'src/axiosInstance'
import styled from 'styled-components'

const StyledTreeContainer = styled.div`
  // 隐藏默认的 toggle 图标
  .rst__tree {
    .rst__toggle {
      display: none;
    }
  }

  // 节点内容样式
  .tree-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 4px;
    background: var(--cui-card-bg);
    transition: all 0.3s;

    &:hover {
      background: var(--cui-tertiary-bg);
    }
  }

  // 子菜单缩进样式
  .children {
    margin-left: 40px; // 增加子菜单的左边距
  }

  // 展开/折叠图标
  .expand-icon {
    font-size: 20px;
    color: var(--cui-body-color);
    cursor: pointer;
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    padding: 4px;
    
    &.expanded {
      transform: rotate(90deg);
    }

    &:hover {
      color: var(--cui-primary);
    }
  }

  // 左侧内容区域
  .left-content {
    display: flex;
    align-items: center;
    gap: 12px;

    // 展开/折叠按钮
    .expand-icon {
      font-size: 20px;
      color: var(--cui-body-color);
      cursor: pointer;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      padding: 4px;
      
      &.expanded {
        transform: rotate(90deg);
      }

      &:hover {
        color: var(--cui-primary);
      }
    }

    // 菜单信息
    .node-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .menu-icon {
        width: 16px;
        height: 16px;
        color: var(--cui-body-color);
      }

      .menu-tag {
        margin-left: 8px;
      }
    }
  }

  // 右侧操作区域
  .right-content {
    display: flex;
    align-items: center;
    gap: 16px;

    // 状态开关样式
    .status-switch {
      &.ant-switch {
        background-color: var(--cui-danger);
        
        &.ant-switch-checked {
          background-color: var(--cui-success);
        }
      }
    }

    .node-actions {
      opacity: 0;
      transition: opacity 0.2s;
      
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    }
  }

  &:hover .node-actions {
    opacity: 1;
  }

  // 暗色主题适配
  [data-theme="dark"] & {
    .tree-content {
      background: var(--cui-dark);

      &:hover {
        background: var(--cui-dark-hover);
      }

      .expand-icon:hover {
        color: var(--cui-primary-light);
      }

      .status-switch {
        &.ant-switch {
          background-color: var(--cui-danger-dark);
          
          &.ant-switch-checked {
            background-color: var(--cui-success-dark);
          }
        }
      }
    }
  }
`

const MenuNode = ({ item, onAdd, onEdit, onDelete, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="menu-node">
      <div className="tree-content">
        <div className="left-content">
          {item.children?.length > 0 ? (
            <CaretRightOutlined
              className={`expand-icon ${isOpen ? 'expanded' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          ) : (
            <div style={{ width: 28 }} />
          )}
          <div className="node-info">
            {item.icon && <CIcon icon={icons[item.icon]} className="menu-icon" />}
            <span>{item.name}</span>
            {item.component === 'CNavGroup' && (
              <Tag color="blue" className="menu-tag">目录</Tag>
            )}
            {item.component === 'CNavItem' && (
              <Tag color="green" className="menu-tag">菜单</Tag>
            )}
            {item.component === 'CNavTitle' && (
              <Tag color="orange" className="menu-tag">标题</Tag>
            )}
            <Tag color="purple">{item.path || '无路径'}</Tag>
          </div>
        </div>
        <div className="right-content">
          <Switch
            size="small"
            checked={item.status}
            onChange={(checked) => onStatusChange(item.id, checked)}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            className="status-switch"
          />
          <div className="node-actions">
            <Space className="action-buttons">
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={(e) => onAdd(item)}
              >
                添加
              </Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={(e) => onEdit(item)}
              >
                编辑
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => onDelete(item.id)}
              >
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>
      {isOpen && item.children?.length > 0 && (
        <div className="children">
          {item.children.map(child => (
            <MenuNode
              key={child.id}
              item={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const MenuList = () => {
  const [menuData, setMenuData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [selectedParent, setSelectedParent] = useState(null)
  const [addForm] = Form.useForm()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editForm] = Form.useForm()
  const [currentItem, setCurrentItem] = useState(null)

  // 图标选项
  const iconOptions = [
    'cilSpeedometer', 'cilHeadphones', 'cilList', 'cilFolder', 'cilStorage',
    'cilGlobeAlt', 'cilBuilding', 'cilPeople', 'cilGroup', 'cilShieldAlt',
    'cilLockLocked', 'cilTruck', 'cilCalculator', 'cilMoney', 'cilBank',
    'cilWallet', 'cilDevices', 'cilBasket', 'cilUser', 'cilSettings'
  ]

  // 组件类型选项
  const componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']

  // 获取菜单数据
  const fetchMenuData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/manage/sys-menu/tree')
      if (response) {
        setMenuData(response)
      }
    } catch (error) {
      message.error('获取菜单失败')
    } finally {
      setLoading(false)
    }
  }

  // 在组件挂载时获取数据
  useEffect(() => {
    fetchMenuData()
  }, [])

  // 状态更新函数
  const handleStatusChange = async (id, checked) => {
    try {
      await api.post('/manage/sys-menu/change-status', {
        id,
        status: checked
      })
      message.success('状态更新成功')
      fetchMenuData()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  // 处理添加菜单
  const handleAdd = (parentItem = null) => {
    setSelectedParent(parentItem)
    addForm.resetFields()

    // 如果有父级菜单，设置默认值
    if (parentItem) {
      addForm.setFieldsValue({
        parentId: parentItem.id,
        component: 'CNavItem', // 子菜单默认为菜单项
        status: true
      })
    } else {
      addForm.setFieldsValue({
        parentId: 0,
        component: 'CNavGroup', // 根菜单默认为目录
        status: true
      })
    }

    setIsAddModalVisible(true)
  }

  // 处理表单提交
  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields()
      await api.post('/manage/sys-menu/create-menu', values)
      message.success('添加成功')
      setIsAddModalVisible(false)
      fetchMenuData() // 刷新菜单数据
    } catch (error) {
      message.error('添加失败：' + (error.message || '未知错误'))
    }
  }

  // 处理编辑菜单
  const handleEdit = (item) => {
    setCurrentItem(item)
    editForm.setFieldsValue({
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      path: item.path,
      icon: item.icon,
      component: item.component,
      badgeText: item.badgeText,
      badgeColor: item.badgeColor,
      status: item.status
    })
    setIsEditModalVisible(true)
  }

  // 处理编辑表单提交
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      await api.post('/manage/sys-menu/update-menu', values)
      message.success('修改成功')
      setIsEditModalVisible(false)
      fetchMenuData() // 刷新菜单数据
    } catch (error) {
      message.error('修改失败：' + (error.message || '未知错误'))
    }
  }

  // 处理删除菜单
  const handleDelete = (id) => {
    // 确认删除提示
    Modal.confirm({
      title: '确认删除',
      content: '删除后不可恢复，是否确认删除该菜单？如果存在子菜单将一并删除。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.post('/manage/sys-menu/remove-menu', { id });
          message.success('删除成功');
          fetchMenuData(); // 刷新菜单数据
        } catch (error) {
          message.error('删除失败：' + (error.message || '未知错误'));
        }
      },
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>菜单管理</h5>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd()}
        >
          新建根菜单
        </Button>
      </div>
      <div className="card-body">
        <Spin spinning={loading}>
          <StyledTreeContainer>
            {menuData.map(item => (
              <MenuNode
                key={item.id}
                item={item}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </StyledTreeContainer>
        </Spin>
      </div>

      <Modal
        title={`${selectedParent ? '添加子菜单' : '添加根菜单'}`}
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => setIsAddModalVisible(false)}
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="parentId"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            label="菜单路径"
            name="path"
            rules={[{ required: true, message: '请输入菜单路径' }]}
          >
            <Input placeholder="请输入菜单路径，如：/data/menu" />
          </Form.Item>

          <Form.Item
            label="图标"
            name="icon"
            rules={[{ required: true, message: '请选择图标' }]}
          >
            <Select
              placeholder="请选择图标"
              showSearch
              optionFilterProp="children"
            >
              {iconOptions.map(icon => (
                <Option key={icon} value={icon}>
                  <Space>
                    <CIcon icon={icons[icon]} className="menu-icon" />
                    {icon}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="组件类型"
            name="component"
            rules={[{ required: true, message: '请选择组件类型' }]}
          >
            <Select placeholder="请选择组件类型">
              {componentOptions.map(component => (
                <Option key={component} value={component}>
                  {component === 'CNavGroup' && '目录'}
                  {component === 'CNavItem' && '菜单'}
                  {component === 'CNavTitle' && '标题'}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="徽章文本"
            name="badgeText"
          >
            <Input placeholder="可选，如：NEW" />
          </Form.Item>

          <Form.Item
            label="徽章颜色"
            name="badgeColor"
          >
            <Input placeholder="可选，如：success" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑菜单弹窗 */}
      <Modal
        title="编辑菜单"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="id"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="parentId"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            label="菜单路径"
            name="path"
            rules={[{ required: true, message: '请输入菜单路径' }]}
          >
            <Input placeholder="请输入菜单路，如：/data/menu" />
          </Form.Item>

          <Form.Item
            label="图标"
            name="icon"
            rules={[{ required: true, message: '请选择图标' }]}
          >
            <Select
              placeholder="请选择图标"
              showSearch
              optionFilterProp="children"
            >
              {iconOptions.map(icon => (
                <Option key={icon} value={icon}>
                  <Space>
                    <CIcon icon={icons[icon]} className="menu-icon" />
                    {icon}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="组件类型"
            name="component"
            rules={[{ required: true, message: '请选择组件类型' }]}
          >
            <Select
              placeholder="请选择组件类型"
              disabled={currentItem?.children?.length > 0} // 如果有子菜单则禁用修改
            >
              {componentOptions.map(component => (
                <Option key={component} value={component}>
                  {component === 'CNavGroup' && '目录'}
                  {component === 'CNavItem' && '菜单'}
                  {component === 'CNavTitle' && '标题'}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="徽章文本"
            name="badgeText"
          >
            <Input placeholder="可选，如：NEW" />
          </Form.Item>

          <Form.Item
            label="徽章颜色"
            name="badgeColor"
          >
            <Input placeholder="可选，如：success" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MenuList
