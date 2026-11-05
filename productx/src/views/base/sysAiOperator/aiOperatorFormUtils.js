/** 本机 ComfyUI FLUX.3 Klein（与 sa_ai_models.model_code 一致） */
export const DEFAULT_GENERATION_MODEL_CODE = 'FLUX.3-Klein';

export const isFluxKleinModelCode = (code) => {
  if (!code) return false;
  const c = String(code).toLowerCase();
  return c === 'flux.3-klein' || (c.includes('flux') && c.includes('klein'));
};

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
    // API / Comfy 基座只需 sdModelCheckpoint，勿重复写入 modelCode 以免被当作 LoRA
    if (!config.modelCode || config.modelCode === next.generationModelCode) {
      delete config.modelCode;
    }
    // 切到 FLUX 时清掉 Seedream 专用字段
    if (isFluxKleinModelCode(next.generationModelCode)) {
      delete config.size;
      delete config.seedreamWatermark;
      if (!config.width) config.width = 1024;
      if (!config.height) config.height = 1024;
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
