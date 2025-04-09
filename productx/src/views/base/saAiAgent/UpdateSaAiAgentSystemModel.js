import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Avatar, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const UpdateSaAiAgentSystemModel = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
  companiesData
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      // 根据当前模型找到对应的公司
      const company = companiesData?.find(c => 
        c.models.some(m => m.modelCode === initialValues.modelType)
      );
      setSelectedCompany(company?.id);
    }
  }, [initialValues, form, companiesData]);

  const handleCompanyChange = (value) => {
    form.setFieldsValue({ modelType: undefined });
    setSelectedCompany(value.value);
  };

  return (
    <Modal
      title={t('editTitle')}
      open={visible}
      width={800}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk({ ...values, id: initialValues?.id });
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
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label={t('agentName')}
              rules={[{ required: true, message: t('pleaseInputAgentName') }]}
            >
              <Input placeholder={t('pleaseInputAgentName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="avatarUrl"
              label={t('avatarUrl')}
            >
              <Input placeholder="images/avatars/example.png" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyId"
              label={t('company')}
              rules={[{ required: true, message: t('pleaseSelectCompany') }]}
            >
              <Select 
                placeholder={t('pleaseSelectCompany')}
                onChange={handleCompanyChange}
                value={selectedCompany}
                labelInValue
                optionLabelProp="label"
              >
                {companiesData?.map((company) => (
                  <Select.Option 
                    key={company.id} 
                    value={company.id}
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar src={company.logoPath} size="small" />
                        <span>{company.companyName}</span>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar src={company.logoPath} size="small" />
                      <span>{company.companyName}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="modelType"
              label={t('modelType')}
              rules={[{ required: true, message: t('pleaseSelectModelType') }]}
            >
              <Select 
                placeholder={t('pleaseSelectModelType')}
                disabled={!selectedCompany}
              >
                {companiesData?.find(c => c.id === selectedCompany)?.models.map(model => (
                  <Select.Option 
                    key={model.id} 
                    value={model.modelCode}
                    title={model.description}
                  >
                    {model.modelName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="roles"
          label={t('roles')}
          rules={[{ required: true, message: t('pleaseInputRoles') }]}
        >
          <Input placeholder={t('pleaseInputRoles')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="mbtiCode"
              label={t('mbtiCode')}
              rules={[{ required: true, message: t('pleaseInputMbtiCode') }]}
            >
              <Select placeholder={t('pleaseSelectMbtiCode')}>
                <Select.Option value="ISTJ">ISTJ</Select.Option>
                <Select.Option value="ISFJ">ISFJ</Select.Option>
                <Select.Option value="INFJ">INFJ</Select.Option>
                <Select.Option value="INTJ">INTJ</Select.Option>
                <Select.Option value="ISTP">ISTP</Select.Option>
                <Select.Option value="ISFP">ISFP</Select.Option>
                <Select.Option value="INFP">INFP</Select.Option>
                <Select.Option value="INTP">INTP</Select.Option>
                <Select.Option value="ESTP">ESTP</Select.Option>
                <Select.Option value="ESFP">ESFP</Select.Option>
                <Select.Option value="ENFP">ENFP</Select.Option>
                <Select.Option value="ENTP">ENTP</Select.Option>
                <Select.Option value="ESTJ">ESTJ</Select.Option>
                <Select.Option value="ESFJ">ESFJ</Select.Option>
                <Select.Option value="ENFJ">ENFJ</Select.Option>
                <Select.Option value="ENTJ">ENTJ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t('status')}
              rules={[{ required: true, message: t('pleaseSelectStatus') }]}
            >
              <Select placeholder={t('pleaseSelectStatus')}>
                <Select.Option value="active">{t('active')}</Select.Option>
                <Select.Option value="inactive">{t('inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="temperature"
              label={t('temperature')}
              rules={[{ required: true, message: t('pleaseInputTemperature') }]}
            >
              <InputNumber
                min={0}
                max={2}
                step={0.1}
                placeholder={t('pleaseInputTemperature')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxTokens"
              label={t('maxTokens')}
              rules={[{ required: true, message: t('pleaseInputMaxTokens') }]}
            >
              <InputNumber
                min={1}
                max={32000}
                placeholder={t('pleaseInputMaxTokens')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="prompt"
          label={t('prompt')}
          rules={[{ required: true, message: t('pleaseInputPrompt') }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={t('pleaseInputPrompt')}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSaAiAgentSystemModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  confirmLoading: PropTypes.bool,
  companiesData: PropTypes.array
};

export default UpdateSaAiAgentSystemModel; 