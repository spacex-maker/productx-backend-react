import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Tabs, Upload, message, Image, Button } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';

const { TabPane } = Tabs;

const ActivityConfigUpdateModal = ({ isVisible, onCancel, onOk, form, handleUpdate, selectedConfig }) => {
  const [displayNameZh, setDisplayNameZh] = useState('');
  const [displayNameEn, setDisplayNameEn] = useState('');
  const [bannerUrlZh, setBannerUrlZh] = useState('');
  const [bannerUrlEn, setBannerUrlEn] = useState('');
  const [btnTextZh, setBtnTextZh] = useState('');
  const [btnTextEn, setBtnTextEn] = useState('');
  const [shareTitleZh, setShareTitleZh] = useState('');
  const [shareTitleEn, setShareTitleEn] = useState('');
  const [themeColor, setThemeColor] = useState('#7B2CBF');
  const [targetAction, setTargetAction] = useState('register');
  const [rewardType, setRewardType] = useState('video_credits');
  const [rewardAmount, setRewardAmount] = useState(30);
  const [uploading, setUploading] = useState({});

  // 解析JSON数据并填充表单
  useEffect(() => {
    if (selectedConfig) {
      // 解析 displayName
      try {
        const displayName = JSON.parse(selectedConfig.displayName || '{}');
        setDisplayNameZh(displayName.zh_CN || '');
        setDisplayNameEn(displayName.en_US || '');
      } catch (e) {
        // 如果不是JSON，直接使用原值
        setDisplayNameZh(selectedConfig.displayName || '');
        setDisplayNameEn('');
      }

      // 解析 ruleConfig
      try {
        const ruleConfig = JSON.parse(selectedConfig.ruleConfig || '{}');
        setTargetAction(ruleConfig.target_action || 'register');
        setRewardType(ruleConfig.reward_type || 'video_credits');
        setRewardAmount(ruleConfig.reward_amount || 30);
      } catch (e) {
        console.error('Failed to parse ruleConfig:', e);
      }

      // 解析 uiConfig
      try {
        const uiConfig = JSON.parse(selectedConfig.uiConfig || '{}');
        if (uiConfig.banner_url) {
          setBannerUrlZh(uiConfig.banner_url.zh_CN || '');
          setBannerUrlEn(uiConfig.banner_url.en_US || '');
        }
        setThemeColor(uiConfig.theme_color || '#7B2CBF');
        if (uiConfig.btn_text) {
          setBtnTextZh(uiConfig.btn_text.zh_CN || '');
          setBtnTextEn(uiConfig.btn_text.en_US || '');
        }
        if (uiConfig.share_title) {
          setShareTitleZh(uiConfig.share_title.zh_CN || '');
          setShareTitleEn(uiConfig.share_title.en_US || '');
        }
      } catch (e) {
        console.error('Failed to parse uiConfig:', e);
      }
    }
  }, [selectedConfig]);

  // 图片上传处理
  const handleImageUpload = async (file, type, lang) => {
    const key = `${type}_${lang}`;
    setUploading({ ...uploading, [key]: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/manage/image/upload', formData);
      
      if (response && typeof response === 'string') {
        if (type === 'banner') {
          if (lang === 'zh') {
            setBannerUrlZh(response);
          } else {
            setBannerUrlEn(response);
          }
        }
        message.success('上传成功');
        return false;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('上传失败');
    } finally {
      setUploading({ ...uploading, [key]: false });
    }
    return false;
  };

  // 组装JSON数据
  const buildJsonData = () => {
    const displayNameJson = JSON.stringify({
      zh_CN: displayNameZh,
      en_US: displayNameEn,
    });

    const ruleConfigJson = JSON.stringify({
      target_action: targetAction,
      reward_type: rewardType,
      reward_amount: rewardAmount,
    });

    const uiConfig = {};
    if (bannerUrlZh || bannerUrlEn) {
      uiConfig.banner_url = {};
      if (bannerUrlZh) uiConfig.banner_url.zh_CN = bannerUrlZh;
      if (bannerUrlEn) uiConfig.banner_url.en_US = bannerUrlEn;
    }
    if (themeColor) {
      uiConfig.theme_color = themeColor;
    }
    if (btnTextZh || btnTextEn) {
      uiConfig.btn_text = {};
      if (btnTextZh) uiConfig.btn_text.zh_CN = btnTextZh;
      if (btnTextEn) uiConfig.btn_text.en_US = btnTextEn;
    }
    if (shareTitleZh || shareTitleEn) {
      uiConfig.share_title = {};
      if (shareTitleZh) uiConfig.share_title.zh_CN = shareTitleZh;
      if (shareTitleEn) uiConfig.share_title.en_US = shareTitleEn;
    }
    const uiConfigJson = JSON.stringify(uiConfig);

    return { displayNameJson, ruleConfigJson, uiConfigJson };
  };

  const onFinish = (values) => {
    const { displayNameJson, ruleConfigJson, uiConfigJson } = buildJsonData();
    
    const submitData = {
      ...values,
      displayName: displayNameJson,
      ruleConfig: ruleConfigJson,
      uiConfig: uiConfigJson,
    };

    // 转换日期格式
    if (values.startTime) {
      submitData.startTime = values.startTime.format('YYYY-MM-DD HH:mm:ss');
    }
    if (values.endTime) {
      submitData.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss');
    }

    handleUpdate(submitData);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onFinish(values);
    });
  };

  return (
    <Modal
      title={
        <div>
          <EditOutlined style={{ marginRight: '4px' }} />
          修改活动配置
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={900}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="活动名称" name="title">
          <Input placeholder="请输入活动名称（内部使用）" />
        </Form.Item>

        <Form.Item label="展示名称（多语言）" required>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="中文展示名称"
                value={displayNameZh}
                onChange={(e) => setDisplayNameZh(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="English Display Name"
                value={displayNameEn}
                onChange={(e) => setDisplayNameEn(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="活动类型" name="activityType">
          <Select placeholder="请选择活动类型">
            <Select.Option value="invite_friend">邀请好友</Select.Option>
            <Select.Option value="recharge">充值</Select.Option>
            <Select.Option value="sign_in">签到</Select.Option>
            <Select.Option value="content_creation">创作激励</Select.Option>
            <Select.Option value="new_user_gift">新人注册礼包</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态">
            <Select.Option value={0}>草稿</Select.Option>
            <Select.Option value={1}>上线中</Select.Option>
            <Select.Option value={2}>已下线</Select.Option>
            <Select.Option value={3}>暂停</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="优先级" name="priority">
          <InputNumber min={0} placeholder="请输入优先级" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="开始时间" name="startTime">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            placeholder="请选择开始时间"
          />
        </Form.Item>

        <Form.Item label="结束时间" name="endTime">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            placeholder="请选择结束时间"
          />
        </Form.Item>

        <Form.Item label="规则配置">
          <Row gutter={16}>
            <Col span={8}>
              <Select
                placeholder="目标行为"
                value={targetAction}
                onChange={setTargetAction}
                style={{ width: '100%' }}
              >
                <Select.Option value="register">注册</Select.Option>
                <Select.Option value="recharge">充值</Select.Option>
                <Select.Option value="generate">生成视频</Select.Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                placeholder="奖励类型"
                value={rewardType}
                onChange={setRewardType}
                style={{ width: '100%' }}
              >
                <Select.Option value="video_credits">视频时长</Select.Option>
                <Select.Option value="points">积分</Select.Option>
                <Select.Option value="credits">算力</Select.Option>
              </Select>
            </Col>
            <Col span={8}>
              <InputNumber
                placeholder="奖励数量"
                value={rewardAmount}
                onChange={setRewardAmount}
                min={0}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="UI配置">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Banner图片" key="1">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>中文Banner</div>
                  {bannerUrlZh ? (
                    <div style={{ marginBottom: 8 }}>
                      <Image src={bannerUrlZh} alt="Banner" style={{ maxWidth: '100%', maxHeight: 200 }} />
                    </div>
                  ) : null}
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => handleImageUpload(file, 'banner', 'zh')}
                  >
                    <Button icon={<UploadOutlined />} loading={uploading.banner_zh}>
                      上传中文Banner
                    </Button>
                  </Upload>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>English Banner</div>
                  {bannerUrlEn ? (
                    <div style={{ marginBottom: 8 }}>
                      <Image src={bannerUrlEn} alt="Banner" style={{ maxWidth: '100%', maxHeight: 200 }} />
                    </div>
                  ) : null}
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => handleImageUpload(file, 'banner', 'en')}
                  >
                    <Button icon={<UploadOutlined />} loading={uploading.banner_en}>
                      Upload English Banner
                    </Button>
                  </Upload>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="主题色和文案" key="2">
              <Form.Item label="主题色">
                <Input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  style={{ width: 100 }}
                />
                <Input
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  style={{ width: 200, marginLeft: 8 }}
                  placeholder="#7B2CBF"
                />
              </Form.Item>
              <Form.Item label="按钮文案">
                <Row gutter={16}>
                  <Col span={12}>
                    <Input
                      placeholder="中文按钮文案"
                      value={btnTextZh}
                      onChange={(e) => setBtnTextZh(e.target.value)}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="English Button Text"
                      value={btnTextEn}
                      onChange={(e) => setBtnTextEn(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="分享标题">
                <Row gutter={16}>
                  <Col span={12}>
                    <Input.TextArea
                      placeholder="中文分享标题"
                      value={shareTitleZh}
                      onChange={(e) => setShareTitleZh(e.target.value)}
                      rows={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Input.TextArea
                      placeholder="English Share Title"
                      value={shareTitleEn}
                      onChange={(e) => setShareTitleEn(e.target.value)}
                      rows={2}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ActivityConfigUpdateModal;
