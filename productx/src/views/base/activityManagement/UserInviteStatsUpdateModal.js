import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const UserInviteStatsUpdateModal = ({ isVisible, onCancel, onOk, form, handleUpdate, selectedStats }) => {
  const onFinish = (values) => {
    handleUpdate(values);
  };

  return (
    <Modal
      title={
        <div>
          <EditOutlined style={{ marginRight: '4px' }} />
          修改用户邀请统计
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="用户UID" name="uid">
          <Input placeholder="请输入用户UID" type="number" />
        </Form.Item>

        <Form.Item label="总邀请注册人数" name="totalInvitedCount">
          <InputNumber min={0} placeholder="请输入总邀请注册人数" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="有效邀请人数" name="validInvitedCount">
          <InputNumber min={0} placeholder="请输入有效邀请人数" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="累计获得积分/算力" name="totalRewardPoints">
          <InputNumber min={0} placeholder="请输入累计获得积分" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="邀请等级" name="currentLevel">
          <InputNumber min={1} max={6} placeholder="请输入邀请等级 (1-6)" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInviteStatsUpdateModal;

