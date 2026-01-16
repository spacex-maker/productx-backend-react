import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSysAiPostStockModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateStock,
  selectedStock,
  agentList,
  t,
  statusOptions,
}) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (selectedStock && isVisible) {
      const imageUrlValue = selectedStock.imageUrl || '';
      const categoryTagsValue = selectedStock.categoryTags
        ? (typeof selectedStock.categoryTags === 'string'
            ? selectedStock.categoryTags
            : JSON.stringify(selectedStock.categoryTags))
        : '[]';

      setImageUrl(imageUrlValue);
      
      form.setFieldsValue({
        id: selectedStock.id,
        imageUrl: imageUrlValue,
        prompt: selectedStock.prompt || '',
        negativePrompt: selectedStock.negativePrompt || '',
        width: selectedStock.width || 1024,
        height: selectedStock.height || 1024,
        categoryTags: categoryTagsValue,
        assignedAgentId: selectedStock.assignedAgentId,
        status: selectedStock.status !== undefined ? selectedStock.status : 0,
      });
    } else {
      setImageUrl('');
      form.resetFields();
    }
  }, [selectedStock, isVisible, form]);

  const handleFinish = (values) => {
    // 处理JSON字段
    if (values.categoryTags) {
      try {
        values.categoryTags = typeof values.categoryTags === 'string'
          ? values.categoryTags
          : JSON.stringify(values.categoryTags);
      } catch (e) {
        values.categoryTags = JSON.stringify([]);
      }
    }
    handleUpdateStock(values);
  };

  return (
    <Modal
      title={t('editPostStock') || t('edit') || '编辑发帖素材'}
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
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('imageUrl') || '图片地址'}
          name="imageUrl"
          rules={[{ required: true, message: t('enterImageUrl') || '请输入图片地址' }]}
        >
          <ImageUpload
            imageUrl={imageUrl}
            onImageChange={(url) => {
              setImageUrl(url);
              form.setFieldsValue({ imageUrl: url });
            }}
            type="background"
            tipText={t('uploadImageTip') || '请上传图片'}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('width') || '宽度'}
              name="width"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterWidth') || '请输入宽度'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('height') || '高度'}
              name="height"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterHeight') || '请输入高度'} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('prompt') || '提示词'}
          name="prompt"
        >
          <TextArea 
            rows={3}
            placeholder={t('enterPrompt') || '请输入生成该图使用的提示词'}
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
              label={t('assignedAgent') || '指定AI'}
              name="assignedAgentId"
            >
              <Select 
                placeholder={t('selectAgentOptional') || '请选择指定AI（可选，NULL代表任何AI都能领用）'} 
                allowClear
                showSearch
                optionFilterProp="label"
              >
                {agentList.map((agent) => (
                  <Option key={agent.id} value={agent.id} label={agent.internalName}>
                    {agent.internalName} (ID: {agent.id})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
        </Row>

        <Form.Item
          label={t('categoryTags') || '分类/风格标签 (JSON数组)'}
          name="categoryTags"
        >
          <TextArea 
            rows={2}
            placeholder={t('enterCategoryTags') || '请输入JSON数组，如: ["cyberpunk", "landscape"]'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSysAiPostStockModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateStock: PropTypes.func.isRequired,
  selectedStock: PropTypes.object,
  agentList: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateSysAiPostStockModal;

