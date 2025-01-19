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
  
  // 检查是否在 XAI 页面
  const isXAIPage = location.pathname === '/data/ai';

  const handleMouseDown = (e) => {
    console.log('MouseDown target:', e.target);
    console.log('Has card-header:', !!e.target.closest('.card-header'));
    console.log('Has c-card-header:', !!e.target.closest('.c-card-header'));
    
    // 检查是否点击了 CoreUI 的 CCardHeader
    if (!e.target.closest('.card-header') && !e.target.closest('.c-card-header')) {
      console.log('Not clicking on header');
      return;
    }
    
    console.log('Starting drag...');
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    initialPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    console.log('Initial position:', initialPosition.current);

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

  // 如果是浮窗模式，使用 Portal 渲染
  if (isVisible) {
    return createPortal(
      <div 
        ref={dragRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'move' : 'default',
          zIndex: 1050,
          userSelect: 'none',
          width: '400px',
          transform: 'translate3d(0,0,0)',
        }}
        onMouseDown={handleMouseDown}
      >
        <XAIChat 
          isFloating={true} 
          onClose={() => dispatch(toggleFloating(false))}
          onToggleFloating={handleToggleFloating}
        />
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