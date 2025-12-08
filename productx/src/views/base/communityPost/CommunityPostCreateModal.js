import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';
import MediaListUpload from 'src/components/common/MediaListUpload';
import api from 'src/axiosInstance';

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
  const [channelList, setChannelList] = useState([]);
  const [challengeList, setChallengeList] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setCoverUrl('');
      form.resetFields();
    }
  }, [isVisible, form]);

  // 获取频道列表
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await api.get('/manage/sys-channel/list', {
          params: { currentPage: 1, pageSize: 1000, isActive: true },
        });
        if (response && response.data) {
          setChannelList(response.data || []);
        }
      } catch (error) {
        console.error(t('fetchChannelListFailed') || '获取频道列表失败', error);
      }
    };
    if (isVisible) {
      fetchChannels();
    }
  }, [isVisible]);

  // 获取挑战活动列表
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/manage/sys-daily-challenge/list', {
          params: { currentPage: 1, pageSize: 1000 },
        });
        if (response && response.data) {
          setChallengeList(response.data || []);
        }
      } catch (error) {
        console.error(t('fetchChallengeListFailed') || '获取挑战活动列表失败', error);
      }
    };
    if (isVisible) {
      fetchChallenges();
    }
  }, [isVisible]);

  const handleMediaUrlsChange = (jsonString) => {
    form.setFieldsValue({ mediaUrls: jsonString });
  };

  return (
    <Modal
      title={t('addPost') || t('add') || '添加帖子'}
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
          label={t('userId') || '用户ID'}
          name="userId"
          rules={[{ required: true, message: t('enterUserId') || '请输入用户ID' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterUserId') || '请输入用户ID'} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('title') || '标题'}
              name="title"
            >
              <Input placeholder={t('enterTitleOptional') || '请输入标题（可选）'} maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('mediaType') || '媒体类型'}
              name="mediaType"
              rules={[{ required: true, message: t('selectMediaType') || '请选择媒体类型' }]}
            >
              <Select placeholder={t('selectMediaType') || '请选择媒体类型'}>
                {mediaTypeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('mediaUrls') || '媒体地址列表'}
          name="mediaUrls"
          rules={[
            { required: true, message: t('addAtLeastOneMedia') || '请至少添加一个媒体' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error(t('addAtLeastOneMedia') || '请至少添加一个媒体'));
                }
                try {
                  const urls = typeof value === 'string' ? JSON.parse(value) : value;
                  if (!Array.isArray(urls) || urls.length === 0) {
                    return Promise.reject(new Error(t('addAtLeastOneMedia') || '请至少添加一个媒体'));
                  }
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(new Error(t('mediaUrlsFormatError') || '媒体地址列表格式错误'));
                }
              }
            }
          ]}
        >
          <MediaListUpload
            mediaUrls={form.getFieldValue('mediaUrls') || '[]'}
            onChange={handleMediaUrlsChange}
            maxCount={10}
          />
        </Form.Item>

        <Form.Item
          label={t('coverImage') || '封面图/缩略图'}
          name="coverUrl"
        >
          <ImageUpload
            imageUrl={coverUrl}
            onImageChange={(url) => {
              setCoverUrl(url);
              form.setFieldsValue({ coverUrl: url });
            }}
            type="background"
            tipText={t('uploadHorizontalImageTip') || '建议上传横向图片，推荐比例：16:9'}
          />
        </Form.Item>

        <Form.Item
          label={t('prompt') || '正向提示词'}
          name="prompt"
        >
          <TextArea 
            rows={3}
            placeholder={t('enterPrompt') || '请输入正向提示词'}
          />
        </Form.Item>

        <Form.Item
          label={t('negativePrompt') || '负向提示词'}
          name="negativePrompt"
        >
          <TextArea 
            rows={3}
            placeholder={t('enterNegativePrompt') || '请输入负向提示词'}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('modelKey') || '模型Key'}
              name="modelKey"
            >
              <Input placeholder={t('enterModelKey') || '请输入模型Key'} maxLength={64} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('generationParams') || '生成参数 (JSON)'}
              name="generationParams"
            >
              <TextArea 
                rows={2}
                placeholder={t('enterGenerationParams') || '请输入JSON格式的生成参数，如: {"seed": 123, "steps": 50, "cfg": 7.5}'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('status') || '状态'}
              name="status"
            >
              <Select placeholder={t('selectStatus') || '请选择状态'}>
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
              label={t('isFeatured') || '是否精选'}
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
              label={t('channel') || '频道'}
              name="channelId"
            >
              <Select 
                placeholder={t('selectChannelOptional') || '请选择频道（可选）'} 
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {channelList.map((channel) => (
                  <Option key={channel.id} value={channel.id} label={channel.name}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #d9d9d9',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {channel.iconUrl ? (
                          <img 
                            src={channel.iconUrl} 
                            alt={channel.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                            onError={(e) => {
                              if (e.target && e.target instanceof HTMLImageElement) {
                                e.target.style.display = 'none';
                              }
                            }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%' }} />
                        )}
                      </div>
                      <span>{channel.name}</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        (ID: {channel.id})
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('isChallengeEntry') || '是否为活动参赛作品'}
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
              label={t('challenge') || '挑战活动'}
              name="challengeId"
            >
              <Select 
                placeholder={t('selectChallengeOptional') || '请选择挑战活动（可选）'} 
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {challengeList.map((challenge) => (
                  <Option key={challenge.id} value={challenge.id} label={challenge.title}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{challenge.title || '-'}</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        (ID: {challenge.id})
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('challengeScore') || '比赛得分'}
              name="challengeScore"
            >
              <InputNumber 
                min={0} 
                step={0.01}
                style={{ width: '100%' }} 
                placeholder={t('enterChallengeScore') || '请输入比赛得分'}
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

