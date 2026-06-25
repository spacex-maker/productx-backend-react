import React from 'react';
import { theme } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * 系统用户标识，配色跟随 Ant Design 主题 token（明亮 / 暗黑）
 */
const SystemUserBadge = ({ label, compact = true, style }) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const text = label ?? t('systemUser');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        margin: 0,
        fontSize: compact ? 10 : 12,
        lineHeight: compact ? 14 : 18,
        padding: compact ? '0 4px' : '1px 6px',
        height: compact ? 14 : undefined,
        borderRadius: token.borderRadiusSM,
        background: token.colorPrimaryBg,
        color: token.colorPrimaryText ?? token.colorPrimary,
        border: `1px solid ${token.colorPrimaryBorder}`,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export default SystemUserBadge;
