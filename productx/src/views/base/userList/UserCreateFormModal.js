import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
const UserCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t('createUser')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText={t('cancel')}
      okText={t('save')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('username')}
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('password')}
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t('nickname')}
          name="nickname"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateFormModal;
