import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const AddRegionModal = ({ visible, onCancel, onOk, form, handleTypeChange }) => {
  const { t } = useTranslation();

  // 添加自动填写国家代码的处理函数
  const handleCodeChange = (e) => {
    const regionCode = e.target.value;
    if (regionCode && regionCode.length >= 2) {
      const countryCode = regionCode.substring(0, 2);
      form.setFieldValue('countryCode', countryCode);
    }
  };

  // 在模态框显示时重置特定字段，但保留行政区划编码和国家代码
  useEffect(() => {
    if (visible) {
      // 获取当前的行政区划编码和国家代码
      const currentCode = form.getFieldValue('code');
      const currentCountryCode = form.getFieldValue('countryCode');
      
      // 重置表单，然后重新设置要保留的字段
      form.resetFields();
      
      // 恢复行政区划编码和国家代码
      form.setFieldsValue({
        code: currentCode,
        countryCode: currentCountryCode
      });
    }
  }, [visible, form]);

  return (
    <Modal
      title={t('addRegion')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('regionCode')}
              name="code"
              rules={[{ required: true, message: t('pleaseInputCode') }]}
              tooltip={t('regionCodeTip')}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('countryCode')}
              name="countryCode"
              rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
              tooltip={t('countryCodeTip')}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('localName')}
              name="localName"
              tooltip={t('localNameTip')}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('name')}
              name="name"
              rules={[{ required: true, message: t('pleaseInputName') }]}
              tooltip={t('nameTip')}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('shortName')}
              name="shortName"
              tooltip={t('shortNameTip')}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('type')}
              name="type"
              tooltip={t('typeTip')}
            >
              <Input
                onChange={handleTypeChange}
                list="typeHistory"
                allowClear
              />
              <datalist id="typeHistory">
                {/* 历史类型选项将通过 props 传入 */}
              </datalist>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('capital')}
              name="capital"
              tooltip={t('capitalTip')}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('population')}
              name="population"
              tooltip={t('populationTip')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('areaKm2')}
              name="areaKm2"
              tooltip={t('areaKm2Tip')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('region')}
              name="region"
              tooltip={t('regionTip')}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddRegionModal;
