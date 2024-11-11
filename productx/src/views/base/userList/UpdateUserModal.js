import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Divider, Typography } from 'antd';

const { Title } = Typography;

const UpdateUserModal = ({
                           isVisible,
                           onCancel,
                           onOk,
                           form,
                           handleUpdateUser,
                           selectedUser
                         }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedUser) {
      form.setFieldsValue({
        id: selectedUser.id,
        description: selectedUser.description,
        email: selectedUser.email,
        status: selectedUser.status,
        nickname: selectedUser.nickname,
        phoneNumber: selectedUser.phoneNumber,
        fullName: selectedUser.fullName,
        address: selectedUser.address,
        creditScore: selectedUser.creditScore,
        city: selectedUser.city,
        state: selectedUser.state,
        postalCode: selectedUser.postalCode,
        country: selectedUser.country,
        isActive: selectedUser.isActive,
      });
    }
  }, [isVisible, selectedUser, form]);

  return (
    <Modal
      title="编辑用户信息"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={500} // 设置模态框宽度为500px
    >
      <Form
        form={form}
        onFinish={handleUpdateUser}
        layout="vertical"
        style={{ gap: '8px' }} // 使用 gap 控制输入框之间的间距
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入用户昵称' }]}
              style={{ marginBottom: '12px' }} // 缩小下边距
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="全名" name="fullName" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入全名" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="电子邮件" name="email" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入电子邮件" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话号码" name="phoneNumber" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="用户介绍" name="description" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入用户介绍" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="信誉分" name="creditScore" style={{ marginBottom: '12px' }}>
              <Input type="number" placeholder="请输入信誉分" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="状态" name="status" valuePropName="checked" style={{ marginBottom: '12px' }}>
          <Checkbox>激活</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>地址信息</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="国家"
              name="country"
              rules={[{ required: true, message: '请输入国家' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入国家" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="州/省"
              name="state"
              rules={[{ required: true, message: '请输入州/省' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入州/省" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="城市"
              name="city"
              rules={[{ required: true, message: '请输入城市' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入城市" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="邮政编码"
              name="postalCode"
              rules={[{ required: true, message: '请输入邮政编码' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入邮政编码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="详细地址"
          name="address"
          rules={[{ required: true, message: '请输入详细地址' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入详细地址" />
        </Form.Item>

        <Form.Item label="激活状态" name="isActive" style={{ marginBottom: '0px' }}>
          <Input disabled placeholder="激活状态" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
