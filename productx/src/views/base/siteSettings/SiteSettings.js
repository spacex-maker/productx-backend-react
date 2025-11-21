import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select, Tabs, Switch } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SiteSettingsTable from './SiteSettingsTable';
import UpdateSiteSettingsModal from './UpdateSiteSettingsModal';
import SiteSettingsCreateFormModal from './SiteSettingsCreateFormModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const SiteSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('kv');

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    configKey: '',
    lang: undefined,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedSetting, setSelectedSetting] = useState(null);

  // 界面化配置状态
  const [creationTypeSettings, setCreationTypeSettings] = useState({
    textToImage: { enabled: false, id: null },
    textToVideo: { enabled: false, id: null },
    imageToImage: { enabled: false, id: null },
    imageToVideo: { enabled: false, id: null },
  });
  const [isLoadingVisualConfig, setIsLoadingVisualConfig] = useState(false);

  const statusOptions = [
    { value: 1, label: t('active') },
    { value: 0, label: t('inactive') }
  ];

  const langOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'ru', label: 'Русский' },
    { value: 'ar', label: 'العربية' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  // 加载界面化配置
  useEffect(() => {
    if (activeTab === 'visual') {
      fetchVisualConfig();
    }
  }, [activeTab]);

  const fetchVisualConfig = async () => {
    setIsLoadingVisualConfig(true);
    try {
      const configKeys = ['textToImage', 'textToVideo', 'imageToImage', 'imageToVideo'];
      const settings = {
        textToImage: { enabled: false, id: null },
        textToVideo: { enabled: false, id: null },
        imageToImage: { enabled: false, id: null },
        imageToVideo: { enabled: false, id: null },
      };

      for (const key of configKeys) {
        try {
          const response = await api.get('/manage/site-settings/list', {
            params: { configKey: key, currentPage: 1, size: 1 },
          });
          
          if (response && response.data && response.data.length > 0) {
            const setting = response.data[0];
            let configValue = { enabled: false };
            try {
              configValue = JSON.parse(setting.configValue);
            } catch (e) {
              // 如果解析失败，使用默认值
            }
            settings[key] = {
              enabled: configValue.enabled || false,
              id: setting.id,
            };
          } else {
            settings[key] = { enabled: false, id: null };
          }
        } catch (error) {
          console.error(`Failed to fetch ${key} config:`, error);
          settings[key] = { enabled: false, id: null };
        }
      }

      setCreationTypeSettings(settings);
    } catch (error) {
      console.error('Failed to fetch visual config', error);
    } finally {
      setIsLoadingVisualConfig(false);
    }
  };

  const handleToggleCreationType = async (type, checked) => {
    const configKey = type;
    const configValue = JSON.stringify({ enabled: checked });
    const currentSetting = creationTypeSettings[type];

    try {
      if (currentSetting.id) {
        // 更新现有配置
        await api.post('/manage/site-settings/update', {
          id: currentSetting.id,
          configKey,
          configValue,
          lang: 'zh',
          status: 1,
        });
      } else {
        // 创建新配置
        await api.post('/manage/site-settings/create', {
          configKey,
          configValue,
          description: t(`creationTypeSettings.${type}`) || type,
          lang: 'zh',
          status: 1,
        });
      }

      // 更新本地状态
      setCreationTypeSettings((prev) => ({
        ...prev,
        [type]: { ...prev[type], enabled: checked },
      }));

      message.success(t('saveSuccess') || '保存成功');
      
      // 重新加载配置以获取ID
      await fetchVisualConfig();
    } catch (error) {
      console.error(`Failed to save ${type} config:`, error);
      message.error(t('saveFailed') || '保存失败');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );
      const response = await api.get('/manage/site-settings/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || response);
        setTotalNum(response['totalNum'] || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleCreateSetting = async (values) => {
    try {
      await api.post('/manage/site-settings/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateSetting = async (values) => {
    try {
      await api.post('/manage/site-settings/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows();

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginTop: 0, marginBottom: 0 }}
        items={[
          {
            key: 'kv',
            label: t('kvConfig') || 'KV配置',
            children: (
              <>
                <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
                  <div className="card-body">
                    <Row gutter={16}>
                      <Col>
                        <Input
                          value={searchParams.configKey}
                          onChange={(e) => handleSearchChange('configKey', e.target.value)}
                          placeholder={t('configKey') || 'Config Key'}
                          allowClear
                          style={{ width: 200 }}
                        />
                      </Col>
                      <Col>
                        <Select
                          value={searchParams.lang}
                          onChange={(value) => handleSearchChange('lang', value)}
                          placeholder={t('language') || 'Language'}
                          allowClear
                          style={{ width: 150 }}
                        >
                          {langOptions.map((lang) => (
                            <Option key={lang.value} value={lang.value}>
                              {lang.label}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col>
                        <Select
                          value={searchParams.status}
                          onChange={(value) => handleSearchChange('status', value)}
                          placeholder={t('status')}
                          allowClear
                          style={{ width: 150 }}
                          options={statusOptions}
                        />
                      </Col>
                      <Col>
                        <Space>
                          <Button type="primary" onClick={fetchData} disabled={isLoading}>
                            {isLoading ? <Spin /> : t('search')}
                          </Button>
                          <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                            {t('add') || 'Add'}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => HandleBatchDelete({
                              url: '/manage/site-settings/delete-batch',
                              selectedRows,
                              fetchData,
                              resetSelection,
                            })}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchDelete')}
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="table-responsive">
                  <Spin spinning={isLoading}>
                    <SiteSettingsTable
                      data={data}
                      selectAll={selectAll}
                      selectedRows={selectedRows}
                      handleSelectAll={handleSelectAll}
                      handleSelectRow={handleSelectRow}
                      handleEditClick={handleEditClick}
                      t={t}
                    />
                  </Spin>
                </div>

                <Pagination
                  totalPages={totalPages}
                  current={currentPage}
                  onPageChange={setCurrent}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
              </>
            ),
          },
          {
            key: 'visual',
            label: t('visualConfig') || '界面化配置',
            children: (
              <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
                <div className="card-body">
                  <Spin spinning={isLoadingVisualConfig}>
                    <div style={{ padding: '20px 0' }}>
                      <h5 style={{ 
                        marginBottom: '24px', 
                        fontWeight: 600,
                        color: 'var(--cui-body-color)'
                      }}>
                        {t('creationTypeSettings') || '创作类型设置'}
                      </h5>
                      <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} md={12} lg={12}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid var(--cui-border-color)',
                            borderRadius: '4px',
                            background: 'var(--cui-body-bg)'
                          }}>
                            <div>
                              <div style={{ 
                                fontWeight: 500, 
                                marginBottom: '4px',
                                color: 'var(--cui-body-color)'
                              }}>
                                {t('textToImage') || '文生图'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--cui-body-color-secondary)'
                              }}>
                                {creationTypeSettings.textToImage.enabled 
                                  ? t('enabled') || '已启用' 
                                  : t('disabled') || '已禁用'}
                              </div>
                            </div>
                            <Switch
                              checked={creationTypeSettings.textToImage.enabled}
                              onChange={(checked) => handleToggleCreationType('textToImage', checked)}
                            />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid var(--cui-border-color)',
                            borderRadius: '4px',
                            background: 'var(--cui-body-bg)'
                          }}>
                            <div>
                              <div style={{ 
                                fontWeight: 500, 
                                marginBottom: '4px',
                                color: 'var(--cui-body-color)'
                              }}>
                                {t('textToVideo') || '文生视频'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--cui-body-color-secondary)'
                              }}>
                                {creationTypeSettings.textToVideo.enabled 
                                  ? t('enabled') || '已启用' 
                                  : t('disabled') || '已禁用'}
                              </div>
                            </div>
                            <Switch
                              checked={creationTypeSettings.textToVideo.enabled}
                              onChange={(checked) => handleToggleCreationType('textToVideo', checked)}
                            />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid var(--cui-border-color)',
                            borderRadius: '4px',
                            background: 'var(--cui-body-bg)'
                          }}>
                            <div>
                              <div style={{ 
                                fontWeight: 500, 
                                marginBottom: '4px',
                                color: 'var(--cui-body-color)'
                              }}>
                                {t('imageToImage') || '图生图'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--cui-body-color-secondary)'
                              }}>
                                {creationTypeSettings.imageToImage.enabled 
                                  ? t('enabled') || '已启用' 
                                  : t('disabled') || '已禁用'}
                              </div>
                            </div>
                            <Switch
                              checked={creationTypeSettings.imageToImage.enabled}
                              onChange={(checked) => handleToggleCreationType('imageToImage', checked)}
                            />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid var(--cui-border-color)',
                            borderRadius: '4px',
                            background: 'var(--cui-body-bg)'
                          }}>
                            <div>
                              <div style={{ 
                                fontWeight: 500, 
                                marginBottom: '4px',
                                color: 'var(--cui-body-color)'
                              }}>
                                {t('imageToVideo') || '图生视频'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--cui-body-color-secondary)'
                              }}>
                                {creationTypeSettings.imageToVideo.enabled 
                                  ? t('enabled') || '已启用' 
                                  : t('disabled') || '已禁用'}
                              </div>
                            </div>
                            <Switch
                              checked={creationTypeSettings.imageToVideo.enabled}
                              onChange={(checked) => handleToggleCreationType('imageToVideo', checked)}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </div>
              </div>
            ),
          },
        ]}
      />

      <SiteSettingsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateSetting}
        form={createForm}
        t={t}
        statusOptions={statusOptions}
        langOptions={langOptions}
      />

      <UpdateSiteSettingsModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateSetting={handleUpdateSetting}
        selectedSetting={selectedSetting}
        t={t}
        statusOptions={statusOptions}
        langOptions={langOptions}
      />
    </div>
  );
};

export default SiteSettings;

