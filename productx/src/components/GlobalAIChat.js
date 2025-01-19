import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFloating } from '../store/aiChat';
import XAIChat from '../views/base/ai/xai';

const GlobalAIChat = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.aiChat.isFloatingVisible);
  const location = useLocation();
  
  // 检查是否在 XAI 页面
  const isXAIPage = location.pathname === '/data/ai';

  // 将控制函数传递给 XAIChat
  const handleToggleFloating = () => {
    dispatch(toggleFloating(true));
  };

  // 如果是浮窗模式，使用 Portal 渲染
  if (isVisible) {
    return createPortal(
      <XAIChat 
        isFloating={true} 
        onClose={() => dispatch(toggleFloating(false))}
        onToggleFloating={handleToggleFloating}
      />,
      document.body
    );
  }

  // 只在 XAI 页面显示主界面
  if (isXAIPage) {
    return <XAIChat 
      isFloating={false}
      onToggleFloating={handleToggleFloating}
    />;
  }

  // 在其他页面不显示任何内容
  return null;
};

export default GlobalAIChat; 