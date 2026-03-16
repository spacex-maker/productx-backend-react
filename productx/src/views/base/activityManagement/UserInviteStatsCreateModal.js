import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const UserInviteStatsCreateModal = ({ isVisible, onCancel, onFinish, form }) => {
  return (
    <Modal
      title={
        <div>
          <PlusOutlined style={{ marginRight: '4px' }} />
          新增用户邀请统计
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="用户UID"
          name="uid"
          rules={[{ required: true, message: '请输入用户UID' }]}
        >
          <Input placeholder="请输入用户UID" type="number" />
        </Form.Item>

        <Form.Item label="总邀请注册人数" name="totalInvitedCount" initialValue={0}>
          <InputNumber min={0} placeholder="请输入总邀请注册人数" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="有效邀请人数" name="validInvitedCount" initialValue={0}>
          <InputNumber min={0} placeholder="请输入有效邀请人数" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="累计获得积分/算力" name="totalRewardPoints" initialValue={0}>
          <InputNumber min={0} placeholder="请输入累计获得积分" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="邀请等级" name="currentLevel" initialValue={1}>
          <InputNumber min={1} max={6} placeholder="请输入邀请等级 (1-6)" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInviteStatsCreateModal;

