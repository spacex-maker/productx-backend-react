import React from 'react';

const DefaultAvatar = ({ name, size = 40 }) => {
  // 获取名字的第一个字母，如果没有名字则使用 '?'
  const firstLetter = (name || '?').charAt(0).toUpperCase();
  
  // 根据名字生成一个固定的颜色
  const getColorFromName = (name) => {
    // 如果 name 为空，使用默认值
    const nameStr = name || '?';
    const colors = [
      '#1890FF', // 蓝色
      '#52C41A', // 绿色
      '#FAAD14', // 黄色
      '#F5222D', // 红色
      '#722ED1', // 紫色
      '#13C2C2', // 青色
      '#EB2F96', // 粉色
      '#FA8C16', // 橙色
    ];
    
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const backgroundColor = getColorFromName(name);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: `${size * 0.4}px`,
        fontWeight: '500',
        userSelect: 'none'
      }}
    >
      {firstLetter}
    </div>
  );
};

export default DefaultAvatar; 