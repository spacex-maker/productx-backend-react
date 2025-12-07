import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, ColorPicker, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSysChannelModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateChannel,
  selectedChannel,
  t,
  statusOptions,
  typeOptions,
  layoutModeOptions,
}) => {
  const [iconUrl, setIconUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // JSON 格式验证函数
  const validateJSON = (_, value) => {
    if (!value || value.trim() === '') {
      return Promise.resolve();
    }
    
    try {
      JSON.parse(value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(t('invalidJSONFormat') || 'Invalid JSON format. Please check your input.'));
    }
  };

  useEffect(() => {
    if (selectedChannel && isVisible) {
      const iconUrlValue = selectedChannel.iconUrl || '';
      const coverUrlValue = selectedChannel.coverUrl || '';
      
      setIconUrl(iconUrlValue);
      setCoverUrl(coverUrlValue);
      
      form.setFieldsValue({
        id: selectedChannel.id,
        channelKey: selectedChannel.channelKey,
        name: selectedChannel.name,
        description: selectedChannel.description,
        iconUrl: iconUrlValue,
        coverUrl: coverUrlValue,
        themeColor: selectedChannel.themeColor || '#000000',
        layoutMode: selectedChannel.layoutMode,
        type: selectedChannel.type,
        filterConfig: selectedChannel.filterConfig,
        isVipOnly: selectedChannel.isVipOnly || false,
        allowUserPost: selectedChannel.allowUserPost !== undefined ? selectedChannel.allowUserPost : true,
        sortOrder: selectedChannel.sortOrder || 0,
        isActive: selectedChannel.isActive !== undefined ? selectedChannel.isActive : true,
      });
    } else {
      setIconUrl('');
      setCoverUrl('');
    }
  }, [selectedChannel, isVisible, form]);

  return (
    <Modal
      title={t('edit') || '编辑频道'}
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
        onFinish={handleUpdateChannel}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('channelKey') || '频道标识'}
          name="channelKey"
          rules={[{ required: true, message: t('pleaseInputChannelKey') || '请输入频道标识' }]}
        >
          <Input placeholder={t('pleaseInputChannelKey') || '请输入频道标识'} disabled />
        </Form.Item>

        <Form.Item
          label={t('name') || '显示名称'}
          name="name"
          rules={[{ required: true, message: t('pleaseInputName') || '请输入显示名称' }]}
        >
          <Input placeholder={t('pleaseInputName') || '请输入显示名称'} />
        </Form.Item>

        <Form.Item
          label={t('description') || '频道简介'}
          name="description"
        >
          <TextArea 
            rows={3}
            placeholder={t('pleaseInputDescription') || '请输入频道简介'}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('iconUrl') || '小图标'}
              name="iconUrl"
            >
              <ImageUpload
                imageUrl={iconUrl}
                onImageChange={(url) => {
                  setIconUrl(url);
                  form.setFieldsValue({ iconUrl: url });
                }}
                type="avatar"
                tipText={t('iconUrlTip') || '建议上传正方形图标，推荐尺寸：100x100px'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t('coverUrl') || '封面图/Banner'}
              name="coverUrl"
            >
              <ImageUpload
                imageUrl={coverUrl}
                onImageChange={(url) => {
                  setCoverUrl(url);
                  form.setFieldsValue({ coverUrl: url });
                }}
                type="background"
                tipText={t('coverUrlTip') || '建议上传横向图片，推荐比例：2:1'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('themeColor') || '主题色'}
          name="themeColor"
          getValueFromEvent={(color) => color.toHexString()}
        >
          <ColorPicker showText format="hex" />
        </Form.Item>

        <Form.Item
          label={t('layoutMode') || '布局模式'}
          name="layoutMode"
        >
          <Select placeholder={t('pleaseSelectLayoutMode') || '请选择布局模式'}>
            {layoutModeOptions.map((layout) => (
              <Option key={layout.value} value={layout.value}>
                {layout.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('type') || '类型'}
          name="type"
        >
          <Select placeholder={t('pleaseSelectType') || '请选择类型'}>
            {typeOptions.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('filterConfig') || '聚合规则JSON'}
          name="filterConfig"
          rules={[{ validator: validateJSON }]}
        >
          <TextArea 
            rows={4}
            placeholder={t('pleaseInputFilterConfig') || '请输入聚合规则JSON，如: {"tags":["anime","2d"], "models":["sdxl"]}'}
          />
        </Form.Item>

        <Form.Item
          label={t('isVipOnly') || 'VIP专属频道'}
          name="isVipOnly"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('allowUserPost') || '允许用户发布'}
          name="allowUserPost"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('sortOrder') || '排序权重'}
          name="sortOrder"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('status') || '是否启用'}
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSysChannelModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateChannel: PropTypes.func.isRequired,
  selectedChannel: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  typeOptions: PropTypes.array.isRequired,
  layoutModeOptions: PropTypes.array.isRequired,
};

export default UpdateSysChannelModal;

