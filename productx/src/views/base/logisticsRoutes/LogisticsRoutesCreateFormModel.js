import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Space, Card, Row, Col, Divider } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const LogisticsRoutesCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  countries = []
}) => {
  const renderCountryOption = (country) => (
    <Option key={country.id} value={country.code}>
      <Space>
        <img
          src={country.flagImageUrl}
          alt={country.name}
          style={{
            width: 20,
            height: 15,
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
      </Space>
    </Option>
  );

  const renderTransportFields = (type, typeName) => (
    <Col span={8}>
      <Card title={`${typeName}服务`} size="small">
        <Space direction="vertical" size={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{`支持${typeName}`}</span>
            <Form.Item name={`${type}Freight`} valuePropName="checked" initialValue={false} noStyle>
              <Switch />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>跟踪服务</span>
            <Form.Item name={`${type}TrackingService`} valuePropName="checked" initialValue={false} noStyle>
              <Switch />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>保险服务</span>
            <Form.Item name={`${type}Insurance`} valuePropName="checked" initialValue={false} noStyle>
              <Switch />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8, flexShrink: 0 }}>预计时效：</span>
            <Space.Compact style={{ flex: 1 }}>
              <Form.Item name={[`${type}TransitTime`, 'value']} noStyle initialValue={3}>
                <InputNumber 
                  min={1} 
                  max={365}
                  style={{ width: '100%' }}
                  placeholder="请输入"
                />
              </Form.Item>
              <Form.Item name={[`${type}TransitTime`, 'unit']} noStyle initialValue="天">
                <Select style={{ width: 70 }}>
                  <Option value="天">天</Option>
                  <Option value="周">周</Option>
                  <Option value="月">月</Option>
                </Select>
              </Form.Item>
            </Space.Compact>
          </div>
        </Space>
      </Card>
    </Col>
  );

  return (
    <Modal
      title="新增物流路线"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={1000}
    >
      <Form form={form} onFinish={onFinish} layout="horizontal">
        <Card size="small">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="起始国家"
                name="originCountry"
                rules={[{ required: true, message: '请选择起始国家' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择起始国家"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.props.children[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {countries.map(renderCountryOption)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="目的国家"
                name="destinationCountry"
                rules={[{ required: true, message: '请选择目的国家' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择目的国家"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.props.children[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {countries.map(renderCountryOption)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">运输服务</Divider>
        <Row gutter={16}>
          {renderTransportFields('air', '空运')}
          {renderTransportFields('sea', '海运')}
          {renderTransportFields('land', '陆运')}
        </Row>

        <Divider orientation="left">其他信息</Divider>
        <Card size="small">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="环保选项" name="ecoFriendly" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="运营天数" name="operationalDays">
            <Input placeholder="请输入运营天数，例如：周一至周五" />
          </Form.Item>
          <Form.Item label="合同条款" name="contractTerms">
            <TextArea rows={4} placeholder="请输入合同条款" />
          </Form.Item>
          <Form.Item label="附加信息" name="additionalInfo">
            <TextArea rows={4} placeholder="请输入附加信息" />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default LogisticsRoutesCreateFormModel; 