import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { ColorPicker } from 'antd';
import IconSelectModal from '../sysMenu/IconSelectModal';
import CIcon from '@coreui/icons-react';
import * as icons from '@coreui/icons';
import * as AntdIcons from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// 添加所有 solid 图标到库中
library.add(fas);

const UpdateSaIndustryModel = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
  industries
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [isIconSelectVisible, setIsIconSelectVisible] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const getColorString = (color) => {
    if (!color) return '#000000';
    if (typeof color === 'string') return color;
    if (color.toHexString) return color.toHexString();
    return color.metaColor || color.toRgbString?.() || '#000000';
  };

  const renderIcon = (iconName) => {
    if (!iconName) return null;

    if (iconName.startsWith('cil')) {
      return <CIcon icon={icons[iconName]} style={{ width: '20px', height: '20px' }} />;
    }

    if (iconName.endsWith('Outlined')) {
      const AntIcon = AntdIcons[iconName];
      return <AntIcon style={{ fontSize: '20px' }} />;
    }

    if (iconName.startsWith('fa')) {
      return <FontAwesomeIcon icon={fas[iconName]} style={{ fontSize: '16px' }} />;
    }

    return null;
  };

  const handleIconSelect = (selectedIcon) => {
    form.setFieldsValue({ icon: selectedIcon });
    setIsIconSelectVisible(false);
  };

  return (
    <>
      <Modal
        title={t('editTitle')}
        open={visible}
        width={800}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        onOk={() => {
          form.validateFields()
            .then((values) => {
              const formattedValues = {
                ...values,
                id: initialValues?.id,
                status: values.status === undefined ? initialValues?.status : values.status,
                iconColor: typeof values.iconColor === 'string' ? values.iconColor : values.iconColor?.toHexString() || '#000000'
              };
              onOk(formattedValues);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        confirmLoading={confirmLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...initialValues,
            status: initialValues?.status,
            iconColor: initialValues?.iconColor || '#000000'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={t('code')}
                rules={[{ required: true, message: t('pleaseInputCode') }]}
              >
                <Input placeholder={t('pleaseInputCode')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('name')}
                rules={[{ required: true, message: t('pleaseInputName') }]}
              >
                <Input placeholder={t('pleaseInputName')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={t('description')}
            rules={[{ required: true, message: t('pleaseInputDescription') }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder={t('pleaseInputDescription')}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label={t('parentId')}
              >
                <Select
                  placeholder={t('pleaseSelectParent')}
                  allowClear
                >
                  {industries?.map(industry => (
                    <Select.Option key={industry.id} value={industry.id}>
                      {industry.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label={t('sortOrder')}
              >
                <InputNumber 
                  min={0}
                  style={{ width: '100%' }}
                  placeholder={t('pleaseInputSortOrder')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="icon"
                label={t('icon')}
                rules={[{ required: true, message: t('pleaseInputIcon') }]}
              >
                <Input.Group compact>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Form.Item
                      name="icon"
                      noStyle
                    >
                      <Input 
                        readOnly
                        style={{ width: 'calc(100% - 80px)' }}
                        prefix={
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => (
                              <span style={{ color: getColorString(getFieldValue('iconColor')) }}>
                                {renderIcon(getFieldValue('icon'))}
                              </span>
                            )}
                          </Form.Item>
                        }
                      />
                    </Form.Item>
                    <Button 
                      style={{ width: '80px' }}
                      onClick={() => setIsIconSelectVisible(true)}
                    >
                      {t('select')}
                    </Button>
                  </div>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="iconColor"
                label={t('iconColor')}
              >
                <ColorPicker
                  showText
                  format="hex"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label={t('status')}
            valuePropName="checked"
          >
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-switch-slider"></span>
            </label>
          </Form.Item>
        </Form>
      </Modal>

      <IconSelectModal
        visible={isIconSelectVisible}
        onCancel={() => setIsIconSelectVisible(false)}
        onSelect={handleIconSelect}
      />
    </>
  );
};

export default UpdateSaIndustryModel;
