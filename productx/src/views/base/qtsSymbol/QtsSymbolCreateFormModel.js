import React from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { Option } = Select;

const QtsSymbolCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增交易对"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="交易所"
          name="exchangeName"
          rules={[{ required: true, message: '请输入交易所名称' }]}
        >
          <Input placeholder="请输入交易所名称" />
        </Form.Item>

        <Form.Item
          label="交易对"
          name="symbol"
          rules={[{ required: true, message: '请输入交易对' }]}
        >
          <Input placeholder="请输入交易对" />
        </Form.Item>

        <Form.Item
          label="基础币种"
          name="baseAsset"
          rules={[{ required: true, message: '请输入基础币种' }]}
        >
          <Input placeholder="请输入基础币种" />
        </Form.Item>

        <Form.Item
          label="计价币种"
          name="quoteAsset"
          rules={[{ required: true, message: '请输入计价币种' }]}
        >
          <Input placeholder="请输入计价币种" />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value={1}>交易中</Option>
            <Option value={2}>暂停交易</Option>
            <Option value={3}>已下架</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="最小数量"
          name="minQty"
          rules={[{ required: true, message: '请输入最小数量' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入最小数量" />
        </Form.Item>

        <Form.Item
          label="最大数量"
          name="maxQty"
          rules={[{ required: true, message: '请输入最大数量' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入最大数量" />
        </Form.Item>

        <Form.Item
          label="最小手数"
          name="minLotSize"
          rules={[{ required: true, message: '请输入最小手数' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入最小手数" />
        </Form.Item>

        <Form.Item
          label="最大手数"
          name="maxLotSize"
          rules={[{ required: true, message: '请输入最大手数' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入最大手数" />
        </Form.Item>

        <Form.Item
          label="步长"
          name="stepSize"
          rules={[{ required: true, message: '请输入步长' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入步长" />
        </Form.Item>

        <Form.Item
          label="价格步长"
          name="tickSize"
          rules={[{ required: true, message: '请输入价格步长' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入价格步长" />
        </Form.Item>

        <Form.Item
          label="数量精度"
          name="qtyPrecision"
          rules={[{ required: true, message: '请输入数量精度' }]}
        >
          <Input type="number" placeholder="请输入数量精度" />
        </Form.Item>

        <Form.Item
          label="价格精度"
          name="pricePrecision"
          rules={[{ required: true, message: '请输入价格精度' }]}
        >
          <Input type="number" placeholder="请输入价格精度" />
        </Form.Item>

        <Form.Item
          label="最小名义价值"
          name="minNotional"
          rules={[{ required: true, message: '请输入最小名义价值' }]}
        >
          <Input type="number" step="0.00000001" placeholder="请输入最小名义价值" />
        </Form.Item>

        <Form.Item
          label="同步频率"
          name="syncFrequency"
          initialValue="daily"
          rules={[{ required: true, message: '请选择同步频率' }]}
        >
          <Select placeholder="请选择同步频率">
            <Option value="daily">每天</Option>
            <Option value="1h">每小时</Option>
            <Option value="4h">每4小时</Option>
            <Option value="12h">每12小时</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="同步开关"
          name="syncEnabled"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QtsSymbolCreateFormModel; 