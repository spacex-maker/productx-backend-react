import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const UpdateAppProductPackagesModal = ({
  visible,
  onCancel,
  onOk,
  form,
  selectedRow,
  confirmLoading,
}) => {
  const { t } = useTranslation();
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    if (visible && selectedRow) {
      const url = selectedRow.iconUrl || '';
      setIconUrl(url);
      form.setFieldsValue({
        name: selectedRow.name,
        nameEn: selectedRow.nameEn,
        description: selectedRow.description,
        descriptionEn: selectedRow.descriptionEn,
        tagText: selectedRow.tagText,
        tagTextEn: selectedRow.tagTextEn,
        iconUrl: url,
        price: selectedRow.price,
        originalPrice: selectedRow.originalPrice,
        currency: selectedRow.currency ?? 'CNY',
        iapProductId: selectedRow.iapProductId,
        stripePriceId: selectedRow.stripePriceId,
        points: selectedRow.points ?? 0,
        giftPoints: selectedRow.giftPoints ?? 0,
        memberLevel: selectedRow.memberLevel ?? 0,
        isRecurring: selectedRow.isRecurring ?? false,
        days: selectedRow.days ?? 0,
        limitNum: selectedRow.limitNum ?? 0,
        targetUser: selectedRow.targetUser ?? 0,
        sort: selectedRow.sort ?? 0,
        status: selectedRow.status ?? 1,
        type: selectedRow.type ?? 1,
        extraConfig: selectedRow.extraConfig,
      });
    }
    if (!visible) {
      form.resetFields();
      setIconUrl('');
    }
  }, [visible, selectedRow, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        id: selectedRow?.id,
        ...values,
        type: values.type ?? 1,
        status: values.status ?? 1,
        sort: values.sort ?? 0,
        points: values.points ?? 0,
        giftPoints: values.giftPoints ?? 0,
        memberLevel: values.memberLevel ?? 0,
        days: values.days ?? 0,
        limitNum: values.limitNum ?? 0,
        targetUser: values.targetUser ?? 0,
        isRecurring: values.isRecurring ?? false,
      };
      onOk(payload);
    }).catch(() => {});
  };

  if (!selectedRow) return null;

  return (
    <Modal
      title={t('edit') || '编辑套餐'}
      open={visible}
      onCancel={() => { form.resetFields(); onCancel(); }}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={760}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="SKU码">
          <Input value={selectedRow.skuCode} disabled />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="套餐名称(中文)" rules={[{ required: true }]}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nameEn" label="Package Name (English)" rules={[{ required: true }]}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="description" label="描述(中文)">
              <Input maxLength={255} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descriptionEn" label="Description (English)">
              <Input maxLength={255} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="tagText" label="角标(中文)">
              <Input maxLength={32} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tagTextEn" label="Badge (English)">
              <Input maxLength={32} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="套餐图标" name="iconUrl">
          <ImageUpload
            imageUrl={iconUrl}
            onImageChange={(url) => {
              setIconUrl(url || '');
              form.setFieldsValue({ iconUrl: url || '' });
            }}
            type="avatar"
            tipText="建议上传正方形图标"
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="type" label="类型" rules={[{ required: true }]}>
              <Select>
                <Option value={1}>充值(Token)</Option>
                <Option value={2}>订阅(Sub)</Option>
                <Option value={3}>活动(Event)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="price" label="售价" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="originalPrice" label="划线原价">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="currency" label="币种">
              <Select>
                <Option value="CNY">CNY</Option>
                <Option value="USD">USD</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="iapProductId" label="IAP Product ID">
              <Input maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="stripePriceId" label="Stripe Price ID">
          <Input maxLength={100} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="points" label="到账Token">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="giftPoints" label="赠送Token">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="memberLevel" label="会员等级">
              <Select>
                <Option value={0}>无</Option>
                <Option value={1}>Silver</Option>
                <Option value={2}>Gold</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="isRecurring" label="自动续费" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="days" label="有效期(天)">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="limitNum" label="单用户限购">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="targetUser" label="可见人群">
              <Select>
                <Option value={0}>全员</Option>
                <Option value={1}>仅新人</Option>
                <Option value={2}>仅老客</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sort" label="排序">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="状态">
              <Select>
                <Option value={0}>下架</Option>
                <Option value={1}>上架</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="extraConfig" label="扩展配置 JSON">
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateAppProductPackagesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  selectedRow: PropTypes.object,
  confirmLoading: PropTypes.bool,
};

export default UpdateAppProductPackagesModal;
