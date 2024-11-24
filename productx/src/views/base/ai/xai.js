import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, message, Upload } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const XAI_API_KEY = 'xai-ZYpnHbjynOP2DS9AdPjpJt8wjau0sqmdurS3lYXg9QShxIavhM5iD6iX8tbDtUDy3ia07krvDc9FKOFX'; // 建议从环境变量或配置文件中获取
const API_URL = 'https://api.x.ai/v1/chat/completions';

const XAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息到 XAI
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // 构建消息历史
      const messageHistory = [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        ...messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: "user",
          content: inputValue
        }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XAI_API_KEY}`
        },
        body: JSON.stringify({
          messages: messageHistory,
          model: 'grok-beta',
          stream: false,
          temperature: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        content: data.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      message.error('发送消息失败，请重试');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理图片上传
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    try {
      // 将图片转换为 base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        setImageUrl(reader.result);
        
        // 构建带图片的消息
        const userMessage = {
          type: 'user',
          content: '图片消息',
          image: reader.result,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        await sendMessageWithImage(base64Image);
      };
    } catch (error) {
      message.error('图片上传失败');
      console.error('Error:', error);
    }
  };

  // 发送带图片的消息
  const sendMessageWithImage = async (base64Image) => {
    setLoading(true);
    try {
      const messageHistory = [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        ...messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: "user",
          content: [
            {
              type: "image",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: "text",
              text: "请描述这张图片"
            }
          ]
        }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XAI_API_KEY}`
        },
        body: JSON.stringify({
          messages: messageHistory,
          model: 'grok-beta',
          stream: false,
          temperature: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        content: data.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      message.error('发送消息失败，请重试');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setImageUrl(null);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h2>AI 助手 (Powered by X.AI)</h2>
      </ChatHeader>

      <MessageArea>
        {messages.map((msg, index) => (
          <MessageBubble key={index} type={msg.type}>
            <Avatar type={msg.type}>
              {msg.type === 'user' ? '👤' : '🤖'}
            </Avatar>
            <MessageContentWrapper>
              {msg.image && (
                <MessageImage src={msg.image} alt="uploaded" />
              )}
              <MessageContent type={msg.type}>
                {msg.content}
              </MessageContent>
              <TimeStamp>{msg.timestamp}</TimeStamp>
            </MessageContentWrapper>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <LoadingWrapper>
            <Spin size="small" />
          </LoadingWrapper>
        )}
      </MessageArea>

      <InputArea>
        <StyledInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          disabled={loading}
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <ButtonGroup>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
          >
            <Button
              icon={<PictureOutlined />}
              disabled={loading}
              style={{ height: '40px', width: '40px' }}
            />
          </Upload>
          <SendButton
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={loading || (!inputValue.trim() && !imageUrl)}
          />
        </ButtonGroup>
      </InputArea>
    </ChatContainer>
  );
};

// 新增头像样式
const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: ${props => props.type === 'user' ? '#1890ff' : '#f56a00'};
  color: #fff;
  font-size: 12px;
`;

// 更新消息气泡样式
const MessageBubble = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'};
  margin: 8px 0;
`;

// 样式定义
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  
  h2 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`;

const MessageImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 8px;
  object-fit: contain;
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.type === 'user' ? '#1890ff' : '#fff'};
  color: ${props => props.type === 'user' ? '#fff' : '#333'};
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  word-break: break-word;
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  gap: 8px;
`;

const StyledInput = styled(Input.TextArea)`
  resize: none;
  height: 40px !important;
  
  .ant-input {
    font-size: 14px;
  }
`;

const SendButton = styled(Button)`
  height: 40px;
  width: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export default XAIChat;
