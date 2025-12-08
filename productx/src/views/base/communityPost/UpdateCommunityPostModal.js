import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Row, Col, Avatar } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';
import MediaListUpload from 'src/components/common/MediaListUpload';
import api from 'src/axiosInstance';

const { Option } = Select;
const { TextArea } = Input;

const UpdateCommunityPostModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdatePost,
  selectedPost,
  t,
  statusOptions,
  mediaTypeOptions,
}) => {
  const [coverUrl, setCoverUrl] = useState('');
  const [channelList, setChannelList] = useState([]);
  const [challengeList, setChallengeList] = useState([]);

  // 将媒体URL转换为JSON字符串
  const convertMediaUrlsToJson = (mediaUrls) => {
    if (!mediaUrls) return '[]';
    try {
      if (typeof mediaUrls === 'string') {
        // 如果已经是JSON格式，直接返回
        if (mediaUrls.trim().startsWith('[')) {
          return mediaUrls;
        }
        // 如果是多行文本，转换为数组
        const lines = mediaUrls.split('\n').filter(line => line.trim());
        return JSON.stringify(lines);
      }
      if (Array.isArray(mediaUrls)) {
        return JSON.stringify(mediaUrls);
      }
      return '[]';
    } catch (e) {
      return '[]';
    }
  };

  useEffect(() => {
    if (selectedPost && isVisible) {
      const coverUrlValue = selectedPost.coverUrl || '';
      const mediaUrlsValue = convertMediaUrlsToJson(selectedPost.mediaUrls);
      const generationParamsValue = selectedPost.generationParams
        ? (typeof selectedPost.generationParams === 'string'
            ? selectedPost.generationParams
            : JSON.stringify(selectedPost.generationParams))
        : '';

      setCoverUrl(coverUrlValue);
      
      form.setFieldsValue({
        id: selectedPost.id,
        userId: selectedPost.userId,
        title: selectedPost.title || '',
        mediaType: selectedPost.mediaType || 'IMAGE',
        mediaUrls: mediaUrlsValue,
        coverUrl: coverUrlValue,
        prompt: selectedPost.prompt || '',
        negativePrompt: selectedPost.negativePrompt || '',
        modelKey: selectedPost.modelKey || '',
        generationParams: generationParamsValue,
        status: selectedPost.status !== undefined ? selectedPost.status : 1,
        isFeatured: selectedPost.isFeatured || false,
        channelId: selectedPost.channelId,
        isChallengeEntry: selectedPost.isChallengeEntry || false,
        challengeId: selectedPost.challengeId,
        challengeScore: selectedPost.challengeScore || 0,
      });
    } else {
      setCoverUrl('');
    }
  }, [selectedPost, isVisible, form]);

  const handleMediaUrlsChange = (jsonString) => {
    form.setFieldsValue({ mediaUrls: jsonString });
  };

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

  return (
    <Modal
      title={t('editPost') || t('edit') || '编辑帖子'}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm') || '确认'}
      cancelText={t('cancel') || '取消'}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdatePost}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('user') || '用户'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              src={selectedPost?.avatar} 
              size={40}
              style={{ flexShrink: 0 }}
            >
              {selectedPost?.username ? selectedPost.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {selectedPost?.username || '-'}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {t('id') || 'ID'}: {selectedPost?.userId || '-'}
              </span>
            </div>
          </div>
        </Form.Item>

        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('titleDisabled') || t('title') || '标题'}
              name="title"
            >
              <Input placeholder={t('enterTitleOptional') || '请输入标题（可选）'} maxLength={100} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('mediaTypeDisabled') || t('mediaType') || '媒体类型'}
              name="mediaType"
              rules={[{ required: true, message: t('selectMediaType') || '请选择媒体类型' }]}
            >
              <Select placeholder={t('selectMediaType') || '请选择媒体类型'} disabled>
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
                        ({t('id') || 'ID'}: {channel.id})
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
                        ({t('id') || 'ID'}: {challenge.id})
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

UpdateCommunityPostModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdatePost: PropTypes.func.isRequired,
  selectedPost: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  mediaTypeOptions: PropTypes.array.isRequired,
};

export default UpdateCommunityPostModal;

