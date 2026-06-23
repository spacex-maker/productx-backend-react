/** 提交前合并生成模型到 modelConfig JSON */
export const mergeGenerationModelIntoConfig = (values) => {
  const next = { ...values };
  let config = {};

  if (next.modelConfig) {
    try {
      config = typeof next.modelConfig === 'string'
        ? JSON.parse(next.modelConfig)
        : next.modelConfig;
    } catch (e) {
      config = {};
    }
  }

  if (next.generationModelCode) {
    config.sdModelCheckpoint = next.generationModelCode;
    // API 模型（Seedream 等）只需 sdModelCheckpoint，勿重复写入 modelCode 以免被当作 LoRA
    if (!config.modelCode || config.modelCode === next.generationModelCode) {
      delete config.modelCode;
    }
  }

  next.modelConfig = JSON.stringify(config);
  return next;
};

/** 从 modelConfig 或独立字段解析 generationModelCode */
export const resolveGenerationModelCode = (operator) => {
  if (operator?.generationModelCode) {
    return operator.generationModelCode;
  }
  if (!operator?.modelConfig) {
    return undefined;
  }
  try {
    const config = typeof operator.modelConfig === 'string'
      ? JSON.parse(operator.modelConfig)
      : operator.modelConfig;
    return config.sdModelCheckpoint || config.modelCode;
  } catch (e) {
    return undefined;
  }
};

export const generationMediaTypeOptions = (t) => [
  { value: 'IMAGE', label: t('generationMediaTypeImage') || '图片 (文生图)' },
  { value: 'VIDEO', label: t('generationMediaTypeVideo') || '视频 (文生视频)' },
];
