import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const ServerInstancesCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'active', label: t('active') },
    { value: 'inactive', label: t('inactive') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'failed', label: t('failed') },
  ];

  const osOptions = [
    { value: 'Linux', label: 'Linux' },
    { value: 'Windows', label: 'Windows' },
    { value: 'MacOS', label: 'MacOS' },
  ];

  const instanceTypeOptions = [
    { value: '标准型SA2', label: t('standardSA2') },
    { value: '标准型S5', label: t('standardS5') },
  ];

  const diskTypeOptions = [
    { value: '通用型SSD云硬盘', label: t('generalSSD') },
    { value: '高性能云硬盘', label: t('highPerformanceDisk') },
  ];

  const billingModeOptions = [
    { value: '按量计费-竞价', label: t('payAsYouGoBidding') },
    { value: '包年包月', label: t('subscription') },
  ];

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      width={800}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
            form.resetFields();
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
          status: 'active',
          os: 'Linux',
          cpuCores: 2,
          memory: 2048,
          diskSpace: 100,
          instanceType: '标准型SA2',
          cpuMemoryBandwidth: '100Mbps',
          diskType: '通用型SSD云硬盘',
          network: 'Default-VPC',
          billingMode: '按量计费-竞价',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="instanceName"
              label={t('instanceName')}
              rules={[{ required: true, message: t('inputInstanceName') }]}
            >
              <Input placeholder={t('inputInstanceName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="host"
              label={t('host')}
              rules={[{ required: true, message: t('inputHost') }]}
            >
              <Input placeholder={t('inputHost')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="status"
              label={t('status')}
              rules={[{ required: true, message: t('selectStatus') }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="os"
              label={t('os')}
              rules={[{ required: true, message: t('selectOS') }]}
            >
              <Select options={osOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="region"
              label={t('region')}
              rules={[{ required: true, message: t('inputRegion') }]}
            >
              <Input placeholder={t('inputRegion')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="cpuCores"
              label={t('cpuCores')}
              rules={[{ required: true, message: t('inputCPUCores') }]}
            >
              <InputNumber min={1} max={64} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="memory"
              label={t('memory')}
              rules={[{ required: true, message: t('inputMemory') }]}
            >
              <InputNumber min={1024} max={262144} step={1024} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="diskSpace"
              label={t('diskSpace')}
              rules={[{ required: true, message: t('inputDiskSpace') }]}
            >
              <InputNumber min={20} max={2048} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="instanceType"
              label={t('instanceType')}
              rules={[{ required: true, message: t('selectInstanceType') }]}
            >
              <Select options={instanceTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cpuMemoryBandwidth"
              label={t('cpuMemoryBandwidth')}
              rules={[{ required: true, message: t('inputCPUMemoryBandwidth') }]}
            >
              <Input placeholder={t('inputCPUMemoryBandwidth')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="diskType"
              label={t('diskType')}
              rules={[{ required: true, message: t('selectDiskType') }]}
            >
              <Select options={diskTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="network"
              label={t('network')}
              rules={[{ required: true, message: t('inputNetwork') }]}
            >
              <Input placeholder={t('inputNetwork')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="publicIp"
              label={t('publicIp')}
              rules={[{ required: true, message: t('inputPublicIp') }]}
            >
              <Input placeholder={t('inputPublicIp')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="privateIp"
              label={t('privateIp')}
              rules={[{ required: true, message: t('inputPrivateIp') }]}
            >
              <Input placeholder={t('inputPrivateIp')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dns"
              label={t('dns')}
              rules={[{ required: true, message: t('inputDns') }]}
            >
              <Input placeholder={t('inputDns')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="billingMode"
              label={t('billingMode')}
              rules={[{ required: true, message: t('selectBillingMode') }]}
            >
              <Select options={billingModeOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="expirationDate"
              label={t('expirationDate')}
              rules={[{ required: true, message: t('inputExpirationDate') }]}
            >
              <Input placeholder={t('inputExpirationDate')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ServerInstancesCreateFormModal;
