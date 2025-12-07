import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSysDailyChallengeModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateChallenge,
  selectedChallenge,
  t,
  statusOptions,
}) => {
  const [coverUrl, setCoverUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [modelList, setModelList] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 当模态框打开时，获取模型列表
      fetchModelList();
    }
  }, [isVisible]);

  const fetchModelList = async () => {
    setLoadingModels(true);
    try {
      const response = await api.get('/manage/sa-ai-models/list', {
        params: { 
          currentPage: 1, 
          pageSize: 1000, 
          status: true // 只获取启用的模型
        },
      });

      if (response && response.data) {
        setModelList(response.data);
      }
    } catch (error) {
      console.error('获取模型列表失败', error);
      message.error('获取模型列表失败');
    } finally {
      setLoadingModels(false);
    }
  };

  const handleFinish = (values) => {
    console.log('handleFinish 被调用', values);
    // 转换日期时间格式
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
      votingEndTime: values.votingEndTime ? values.votingEndTime.format('YYYY-MM-DD HH:mm:ss') : null,
    };
    console.log('formattedValues', formattedValues);
    handleUpdateChallenge(formattedValues);
  };

  const handleFinishFailed = (errorInfo) => {
    console.error('表单验证失败', errorInfo);
    message.error('请检查表单输入是否正确');
  };

  useEffect(() => {
    if (selectedChallenge && isVisible) {
      const coverUrlValue = selectedChallenge.coverUrl || '';
      const referenceImageUrlValue = selectedChallenge.referenceImageUrl || '';
      
      setCoverUrl(coverUrlValue);
      setReferenceImageUrl(referenceImageUrlValue);
      
      // 安全地解析日期
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed : null;
      };

      form.setFieldsValue({
        id: selectedChallenge.id,
        title: selectedChallenge.title || '',
        description: selectedChallenge.description || '',
        coverUrl: coverUrlValue,
        referenceImageUrl: referenceImageUrlValue,
        requiredTags: selectedChallenge.requiredTags || '',
        requiredModel: selectedChallenge.requiredModel || '',
        status: selectedChallenge.status !== undefined ? selectedChallenge.status : 0,
        startTime: parseDate(selectedChallenge.startTime),
        endTime: parseDate(selectedChallenge.endTime),
        votingEndTime: parseDate(selectedChallenge.votingEndTime),
        rewardsConfig: selectedChallenge.rewardsConfig || '',
      });
    } else {
      setCoverUrl('');
      setReferenceImageUrl('');
    }
  }, [selectedChallenge, isVisible, form]);

  return (
    <Modal
      title={t('edit') || '编辑挑战'}
      open={isVisible}
      onCancel={onCancel}
      onOk={async () => {
        try {
          // 验证表单
          const values = await form.validateFields();
          console.log('表单验证通过，值：', values);
          
          // 直接调用更新函数，让 handleUpdateChallenge 自己处理日期格式化
          console.log('准备调用 handleUpdateChallenge，参数：', values);
          await handleUpdateChallenge(values);
        } catch (error) {
          console.error('表单验证失败或提交失败', error);
          if (error.errorFields) {
            message.error('请检查表单输入是否正确');
          } else {
            // 如果 handleUpdateChallenge 内部已经处理了错误，这里不需要再显示
            console.error('更新失败', error);
          }
        }
      }}
      okText={t('confirm') || '确认'}
      cancelText={t('cancel') || '取消'}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="挑战主题"
          name="title"
          rules={[{ required: true, message: '请输入挑战主题' }]}
        >
          <Input placeholder="请输入挑战主题（如: Cyberpunk Cat）" maxLength={100} />
        </Form.Item>

        <Form.Item
          label="详细规则描述"
          name="description"
        >
          <TextArea 
            rows={4}
            placeholder="请输入详细规则描述"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="活动封面图"
              name="coverUrl"
            >
              <ImageUpload
                imageUrl={coverUrl}
                onImageChange={(url) => {
                  setCoverUrl(url);
                  form.setFieldsValue({ coverUrl: url });
                }}
                type="background"
                tipText="建议上传横向图片，推荐比例：16:9"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="图生图底图（可选）"
              name="referenceImageUrl"
            >
              <ImageUpload
                imageUrl={referenceImageUrl}
                onImageChange={(url) => {
                  setReferenceImageUrl(url);
                  form.setFieldsValue({ referenceImageUrl: url });
                }}
                type="background"
                tipText="图生图的底图（可选）"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="必须包含的Tag (JSON数组)"
          name="requiredTags"
        >
          <TextArea 
            rows={2}
            placeholder='请输入JSON数组格式的Tag，如: ["cyberpunk", "neon"]'
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="指定模型Key"
              name="requiredModel"
            >
              <Select 
                placeholder="请选择模型（可选）" 
                allowClear
                loading={loadingModels}
                showSearch
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  const value = String(option?.value ?? '');
                  return label.toLowerCase().includes(input.toLowerCase()) ||
                         value.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {modelList.map((model) => (
                  <Option key={model.id} value={model.modelCode} label={model.modelName}>
                    {model.modelName} ({model.modelCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              name="status"
            >
              <Select placeholder="请选择状态">
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="开始投稿时间"
              name="startTime"
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="请选择开始投稿时间"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="投稿截止时间"
              name="endTime"
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="请选择投稿截止时间"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="投票/公示截止时间"
              name="votingEndTime"
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="请选择投票/公示截止时间"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="奖励配置 (JSON)"
          name="rewardsConfig"
        >
          <TextArea 
            rows={3}
            placeholder='请输入JSON格式的奖励配置，如: {"1st": 500, "2nd": 300, "participation": 5}'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSysDailyChallengeModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateChallenge: PropTypes.func.isRequired,
  selectedChallenge: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateSysDailyChallengeModal;

