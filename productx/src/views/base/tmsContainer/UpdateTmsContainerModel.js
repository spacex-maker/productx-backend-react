import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateTmsContainerModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateContainer,
  selectedContainer,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedContainer) {
      form.setFieldsValue(selectedContainer);
    }
  }, [isVisible, selectedContainer, form]);

  return (
    <Modal
      title={t('updateContainer')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateContainer}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('containerType')}
          name="containerType"
          rules={[{ required: true, message: t('pleaseEnterContainerType') }]}
        >
          <Input placeholder={t('pleaseEnterContainerType')} />
        </Form.Item>

        <Form.Item
          label={t('internalLength')}
          name="internalLength"
          rules={[{ required: true, message: t('pleaseEnterInternalLength') }]}
        >
          <InputNumber placeholder={t('pleaseEnterInternalLength')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('internalWidth')}
          name="internalWidth"
          rules={[{ required: true, message: t('pleaseEnterInternalWidth') }]}
        >
          <InputNumber placeholder={t('pleaseEnterInternalWidth')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('internalHeight')}
          name="internalHeight"
          rules={[{ required: true, message: t('pleaseEnterInternalHeight') }]}
        >
          <InputNumber placeholder={t('pleaseEnterInternalHeight')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('externalLength')}
          name="externalLength"
          rules={[{ required: true, message: t('pleaseEnterExternalLength') }]}
        >
          <InputNumber placeholder={t('pleaseEnterExternalLength')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('externalWidth')}
          name="externalWidth"
          rules={[{ required: true, message: t('pleaseEnterExternalWidth') }]}
        >
          <InputNumber placeholder={t('pleaseEnterExternalWidth')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('externalHeight')}
          name="externalHeight"
          rules={[{ required: true, message: t('pleaseEnterExternalHeight') }]}
        >
          <InputNumber placeholder={t('pleaseEnterExternalHeight')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('doorWidth')}
          name="doorWidth"
          rules={[{ required: true, message: t('pleaseEnterDoorWidth') }]}
        >
          <InputNumber placeholder={t('pleaseEnterDoorWidth')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('doorHeight')}
          name="doorHeight"
          rules={[{ required: true, message: t('pleaseEnterDoorHeight') }]}
        >
          <InputNumber placeholder={t('pleaseEnterDoorHeight')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('volume')}
          name="volume"
          rules={[{ required: true, message: t('pleaseEnterVolume') }]}
        >
          <InputNumber placeholder={t('pleaseEnterVolume')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('maxPayload')}
          name="maxPayload"
          rules={[{ required: true, message: t('pleaseEnterMaxPayload') }]}
        >
          <InputNumber placeholder={t('pleaseEnterMaxPayload')} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('tareWeight')}
          name="tareWeight"
          rules={[{ required: true, message: t('pleaseEnterTareWeight') }]}
        >
          <InputNumber placeholder={t('pleaseEnterTareWeight')} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateTmsContainerModal;
