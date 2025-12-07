import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const CommunityPostCreateModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  statusOptions,
  mediaTypeOptions,
}) => {
  const [coverUrl, setCoverUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setCoverUrl('');
      setMediaUrls([]);
      form.resetFields();
    }
  }, [isVisible, form]);

  const handleMediaUrlsChange = (urls) => {
    setMediaUrls(urls);
    form.setFieldsValue({ mediaUrls: JSON.stringify(urls) });
  };

  return (
    <Modal
      title={t('add') || '添加帖子'}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm') || '确认'}
      cancelText={t('cancel') || '取消'}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          mediaType: 'IMAGE',
          status: 1,
          isFeatured: false,
          isChallengeEntry: false,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          collectCount: 0,
          challengeScore: 0,
        }}
      >
        <Form.Item
          label="用户ID"
          name="userId"
          rules={[{ required: true, message: '请输入用户ID' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入用户ID" />
        </Form.Item>

        <Form.Item
          label="标题"
          name="title"
        >
          <Input placeholder="请输入标题（可选）" maxLength={100} />
        </Form.Item>

        <Form.Item
          label="媒体类型"
          name="mediaType"
          rules={[{ required: true, message: '请选择媒体类型' }]}
        >
          <Select placeholder="请选择媒体类型">
            {mediaTypeOptions.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="媒体地址列表 (JSON数组)"
          name="mediaUrls"
          rules={[
            { required: true, message: '请输入媒体地址列表' },
            {
              validator: (_, value) => {
                if (!value) return Promise.reject(new Error('请输入媒体地址列表'));
                try {
                  const urls = typeof value === 'string' ? JSON.parse(value) : value;
                  if (!Array.isArray(urls) || urls.length === 0) {
                    return Promise.reject(new Error('媒体地址列表必须是非空数组'));
                  }
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(new Error('媒体地址列表必须是有效的JSON数组格式'));
                }
              }
            }
          ]}
        >
          <TextArea 
            rows={4}
            placeholder='请输入JSON数组格式的媒体地址，如: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
          />
        </Form.Item>

        <Form.Item
          label="封面图/缩略图"
          name="coverUrl"
        >
          <ImageUpload
            imageUrl={coverUrl}
            onImageChange={(url) => {
              setCoverUrl(url);
              form.setFieldsValue({ coverUrl: url });
            }}
            type="background"
            tipText="建议上传横向图片，推荐比例：16:9"
          />
        </Form.Item>

        <Form.Item
          label="正向提示词"
          name="prompt"
        >
          <TextArea 
            rows={3}
            placeholder="请输入正向提示词"
          />
        </Form.Item>

        <Form.Item
          label="负向提示词"
          name="negativePrompt"
        >
          <TextArea 
            rows={3}
            placeholder="请输入负向提示词"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="模型Key"
              name="modelKey"
            >
              <Input placeholder="请输入模型Key" maxLength={64} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="生成参数 (JSON)"
              name="generationParams"
            >
              <TextArea 
                rows={2}
                placeholder='请输入JSON格式的生成参数，如: {"seed": 123, "steps": 50, "cfg": 7.5}'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="状态"
              name="status"
            >
              <Select placeholder="请选择状态">
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="是否精选"
              name="isFeatured"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="频道ID"
              name="channelId"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入频道ID（可选）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="是否为活动参赛作品"
              name="isChallengeEntry"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="挑战活动ID"
              name="challengeId"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入挑战活动ID（可选）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="比赛得分"
              name="challengeScore"
            >
              <InputNumber 
                min={0} 
                step={0.01}
                style={{ width: '100%' }} 
                placeholder="请输入比赛得分"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

CommunityPostCreateModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  mediaTypeOptions: PropTypes.array.isRequired,
};

export default CommunityPostCreateModal;

