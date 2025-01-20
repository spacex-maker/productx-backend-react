import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFloating, updateFloatingPosition } from '../store/aiChat';
import XAIChat from '../views/base/ai/xai';

const GlobalAIChat = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.aiChat.isFloatingVisible);
  const position = useSelector((state) => state.aiChat.floatingPosition);
  const location = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  
  // 检查是否在 XAI 页面
  const isXAIPage = location.pathname === '/data/ai';

  const handleMouseDown = (e) => {
    // 只检查是否点击了头部区域
    const cardHeader = e.target.closest('.card-header, .c-card-header');
    if (!cardHeader) {
      return;
    }
    
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    initialPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - initialPosition.current.x;
    const newY = e.clientY - initialPosition.current.y;
    
    const maxX = window.innerWidth - dragRef.current.offsetWidth;
    const maxY = window.innerHeight - dragRef.current.offsetHeight;
    
    const boundedX = Math.min(Math.max(0, newX), maxX);
    const boundedY = Math.min(Math.max(0, newY), maxY);
    
    dispatch(updateFloatingPosition({ x: boundedX, y: boundedY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dispatch]);

  // 将控制函数传递给 XAIChat
  const handleToggleFloating = () => {
    dispatch(toggleFloating(true));
  };

  // 处理关闭动画
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      dispatch(toggleFloating(false));
    }, 500); // 延长到 500ms
  };

  // 如果是浮窗模式，使用 Portal 渲染
  if (isVisible) {
    return createPortal(
      <div 
        ref={dragRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: 'default',
          zIndex: 1050,
          width: '400px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          transform: isClosing 
            ? 'translate3d(40px,0,0) rotateY(180deg) scale(0.6)' 
            : 'translate3d(0,0,0) rotateY(0deg) scale(1)',
          opacity: isClosing ? 0 : 1,
          transition: isDragging 
            ? 'none' 
            : 'transform 0.5s ease, opacity 0.5s ease',
          animation: 'fadeIn 0.5s ease',
          transformOrigin: 'center center',
          perspective: '1000px'
        }}
        onMouseDown={handleMouseDown}
      >
        <style>
          {`
            /* 只在头部禁用文本选择 */
            .card-header, .c-card-header {
              user-select: none;
              cursor: move;
            }
          `}
        </style>
        <XAIChat 
          isFloating={true} 
          onClose={handleClose}
          onToggleFloating={handleToggleFloating}
        />
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translate3d(-40px, 0, 0) rotateY(-180deg) scale(0.6);
              }
              to {
                opacity: 1;
                transform: translate3d(0, 0, 0) rotateY(0deg) scale(1);
              }
            }
          `}
        </style>
      </div>,
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