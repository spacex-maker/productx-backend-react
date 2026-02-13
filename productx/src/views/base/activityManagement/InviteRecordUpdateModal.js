import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const InviteRecordUpdateModal = ({ isVisible, onCancel, onOk, form, handleUpdate, selectedRecord }) => {
  const onFinish = (values) => {
    handleUpdate(values);
  };

  return (
    <Modal
      title={
        <div>
          <EditOutlined style={{ marginRight: '4px' }} />
          修改邀请记录
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="邀请人UID" name="inviterUid">
          <Input placeholder="请输入邀请人UID" type="number" />
        </Form.Item>

        <Form.Item label="被邀请人UID" name="inviteeUid">
          <Input placeholder="请输入被邀请人UID" type="number" />
        </Form.Item>

        <Form.Item label="邀请码" name="inviteCode">
          <Input placeholder="请输入邀请码" />
        </Form.Item>

        <Form.Item label="来源渠道" name="channel">
          <Select placeholder="请选择来源渠道">
            <Select.Option value="link">链接</Select.Option>
            <Select.Option value="poster">海报</Select.Option>
            <Select.Option value="share_api">分享API</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态">
            <Select.Option value={0}>已点击/待注册</Select.Option>
            <Select.Option value={1}>已注册</Select.Option>
            <Select.Option value={2}>已达标</Select.Option>
            <Select.Option value={9}>风控冻结</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="奖励状态" name="rewardIssued">
          <Select placeholder="请选择奖励状态">
            <Select.Option value={0}>未发放</Select.Option>
            <Select.Option value={1}>已发放</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="注册IP" name="clientIp">
          <Input placeholder="请输入注册IP" />
        </Form.Item>

        <Form.Item label="设备指纹" name="deviceFingerprint">
          <Input placeholder="请输入设备指纹" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InviteRecordUpdateModal;

