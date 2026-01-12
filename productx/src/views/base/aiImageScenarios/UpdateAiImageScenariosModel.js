import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Divider } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const UpdateAiImageScenariosModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateScenario,
  selectedScenario,
  categories,
  t
}) => {
  useEffect(() => {
    if (isVisible && selectedScenario) {
      form.setFieldsValue({
        id: selectedScenario.id,
        sceneKey: selectedScenario.sceneKey,
        sceneName: selectedScenario.sceneName,
        description: selectedScenario.description,
        iconUrl: selectedScenario.iconUrl,
        coverImageUrl: selectedScenario.coverImageUrl,
        sortOrder: selectedScenario.sortOrder,
        categoryId: selectedScenario.categoryId,
        promptTemplate: selectedScenario.promptTemplate,
        negativePrompt: selectedScenario.negativePrompt,
        loraConfig: selectedScenario.loraConfig,
        defaultModelId: selectedScenario.defaultModelId,
        width: selectedScenario.width,
        height: selectedScenario.height,
        cfgScale: selectedScenario.cfgScale,
        steps: selectedScenario.steps,
        formConfig: selectedScenario.formConfig,
        isActive: selectedScenario.isActive,
        isVip: selectedScenario.isVip,
      });
    }
  }, [isVisible, selectedScenario, form]);

  return (
    <Modal
      title={t('编辑场景配置')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={900}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateScenario}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Divider orientation="left">{t('基本信息')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('场景标识')}
              name="sceneKey"
              rules={[{ required: true, message: t('请输入场景标识') }]}
              tooltip={t('用于代码引用的唯一标识，建议不要修改')}
            >
              <Input placeholder="BILLBOARD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('场景名称')}
              name="sceneName"
              rules={[{ required: true, message: t('请输入场景名称') }]}
            >
              <Input placeholder={t('户外高清广告牌')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('场景描述')}
          name="description"
        >
          <TextArea rows={2} placeholder={t('场景描述，用于前端卡片展示')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('场景分类')}
              name="categoryId"
              rules={[{ required: true, message: t('请选择场景分类') }]}
            >
              <Select placeholder={t('请选择场景分类')}>
                {categories.map(cat => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('排序权重')}
              name="sortOrder"
              tooltip={t('值越大越靠前')}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('场景图标URL')}
              name="iconUrl"
            >
              <Input placeholder="https://example.com/icon.png" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('封面预览图URL')}
              name="coverImageUrl"
            >
              <Input placeholder="https://example.com/cover.jpg" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">{t('提示词配置')}</Divider>
        <Form.Item
          label={t('提示词模板')}
          name="promptTemplate"
          tooltip={t('支持占位符，如: A billboard of ${subject}, ${style}')}
        >
          <TextArea rows={3} placeholder="A billboard of ${subject}, ${style}" />
        </Form.Item>

        <Form.Item
          label={t('负向提示词')}
          name="negativePrompt"
        >
          <TextArea rows={2} placeholder="low quality, blurry" />
        </Form.Item>

        <Divider orientation="left">{t('生成参数')}</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('默认底模ID')}
              name="defaultModelId"
            >
              <Input placeholder="sd_xl_base_1.0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('默认宽度')}
              name="width"
            >
              <InputNumber min={64} max={4096} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('默认高度')}
              name="height"
            >
              <InputNumber min={64} max={4096} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('提示词相关性')}
              name="cfgScale"
              tooltip="CFG Scale"
            >
              <InputNumber min={1} max={20} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('采样步数')}
              name="steps"
            >
              <InputNumber min={1} max={150} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">{t('高级配置')}</Divider>
        <Form.Item
          label={t('LoRA配置')}
          name="loraConfig"
          tooltip={t('JSON格式，如: [{"model":"lora_v1","weight":0.8}]')}
        >
          <TextArea rows={3} placeholder='[{"model":"lora_v1","weight":0.8}]' />
        </Form.Item>

        <Form.Item
          label={t('表单配置')}
          name="formConfig"
          tooltip={t('前端动态表单定义(JSON)')}
        >
          <TextArea rows={3} placeholder='[{"field":"subject","label":"主题","type":"text"}]' />
        </Form.Item>

        <Divider orientation="left">{t('状态设置')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('启用状态')}
              name="isActive"
              valuePropName="checked"
            >
              <Switch checkedChildren={t('启用')} unCheckedChildren={t('禁用')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('VIP专属')}
              name="isVip"
              valuePropName="checked"
            >
              <Switch checkedChildren={t('是')} unCheckedChildren={t('否')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateAiImageScenariosModel;
