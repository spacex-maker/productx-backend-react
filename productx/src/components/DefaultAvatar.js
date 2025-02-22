import React from 'react';

const DefaultAvatar = ({ name = '', size = 40 }) => {
  // 生成名字首字母
  const getInitials = (text) => {
    if (!text) return '?';
    const words = text.split(' ');
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2.5,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default DefaultAvatar;
