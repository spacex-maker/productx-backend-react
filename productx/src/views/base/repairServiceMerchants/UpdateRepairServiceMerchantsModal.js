import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, message, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const UpdateRepairServiceMerchantsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateMerchant,
  selectedMerchant
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedMerchant) {
      form.setFieldsValue(selectedMerchant);
    }
  }, [isVisible, selectedMerchant, form]);

  return (
    <Modal
      title={t('updateMerchant')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={360}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form
        form={form}
        onFinish={handleUpdateMerchant}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={16}>
            <Form.Item
              label={t('merchantName')}
              name="merchantName"
              rules={[{ required: true, message: t('pleaseInputMerchantName') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('logo')}
              name="merchantLogo"
            >
              {selectedMerchant?.merchantLogo ? (
                <div className="logo-preview">
                  <img 
                    src={selectedMerchant.merchantLogo} 
                    alt="logo"
                  />
                </div>
              ) : (
                <div className="logo-empty">暂无</div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('contactPerson')}
              name="contactPerson"
              rules={[{ required: true, message: t('pleaseInputContactPerson') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('contactPhone')}
              name="contactPhone"
              rules={[{ required: true, message: t('pleaseInputContactPhone') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('contactEmail')}
              name="contactEmail"
              rules={[
                { required: true, message: t('pleaseInputEmail') },
                { type: 'email', message: t('invalidEmail') }
              ]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('workingHours')}
              name="workingHours"
              rules={[{ required: true }]}
            >
              <Input size="small" placeholder="9:00-18:00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('province')}
              name="province"
              rules={[{ required: true, message: t('pleaseInputProvince') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('city')}
              name="city"
              rules={[{ required: true, message: t('pleaseInputCity') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('address')}
              name="address"
              rules={[{ required: true, message: t('pleaseInputAddress') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('paymentMethods')}
              name="paymentMethods"
              rules={[{ required: true, message: t('pleaseSelectPaymentMethods') }]}
            >
              <Select
                size="small"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelect')}
                options={[
                  { value: '支付宝', label: '支付宝' },
                  { value: '微信', label: '微信' },
                  { value: '现金', label: '现金' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('serviceTypes')}
              name="serviceTypes"
              rules={[{ required: true, message: t('pleaseSelectServiceTypes') }]}
            >
              <Select
                size="small"
                mode="tags"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelect')}
                options={[
                  { value: '手机维修', label: '手机维修' },
                  { value: '电脑维修', label: '电脑维修' },
                  { value: '家电维修', label: '家电维修' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('remark')}
              name="remark"
            >
              <Input.TextArea size="small" rows={1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style jsx>{`
        .ant-form-item {
          margin-bottom: 8px;
        }
        .ant-form-item-label {
          padding-bottom: 4px;
        }
        .ant-input, .ant-select {
          min-height: 28px;
        }
        .logo-preview {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #d9d9d9;
        }
        .logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .logo-empty {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 10px;
        }
      `}</style>
    </Modal>
  );
};

export default UpdateRepairServiceMerchantsModal;
