import React, {useState, useRef, useEffect} from 'react';
import {Upload, message, Select, Dropdown} from 'antd';
import {RobotOutlined, SettingOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import api from 'src/axiosInstance';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CSpinner,
  CFormTextarea,
  CBadge,
  CAvatar
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilImage,
  cilArrowRight,
  cilCommentSquare,
  cilSpeedometer,
  cilDevices
} from '@coreui/icons';

const API_URL = 'https://api.x.ai/v1/chat/completions';

// 添加模型选项配置
const MODEL_OPTIONS = [
  {value: 'grok-beta', label: 'Grok Beta', icon: cilSpeedometer, supportsImage: false},
  {value: 'grok-vision-beta', label: 'Grok Vision', icon: cilImage, supportsImage: true},
];

const XAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentModel, setCurrentModel] = useState('grok-beta');
  const [accountInfo, setAccountInfo] = useState({
    remainingQuota: null,
    balance: null
  });
  const [apiKey, setApiKey] = useState(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 更新模型切换处理函数
  const handleModelChange = (value) => {
    setCurrentModel(value);
  };
  // 添加获取密钥的函数
  const fetchApiKey = async () => {
    try {
      const response = await api.get('/manage/xai/key');
      setApiKey(response);
    } catch (error) {
      console.error('获取XAI密钥失败:', error);
      message.error('获取密钥失败，请刷新页面重试');
    }
  };

  // 组件加载时获取密钥
  useEffect(() => {
    fetchApiKey();
  }, []);

  // 优化历史消息处理
  const getMessageHistory = (newMessage = null) => {
    const messageHistory = [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    // 如果有新消息，添加到历史中
    if (newMessage) {
      // 如果新消息是图片消息
      if (Array.isArray(newMessage) && newMessage[0]?.type === "image_url") {
        messageHistory.push({
          role: "user",
          content: newMessage
        });
      } else {
        // 文本消息
        messageHistory.push({
          role: "user",
          content: newMessage
        });
      }
    }

    return messageHistory;
  };

  // 更新发送消息函数
  const handleSend = async () => {
    if (!inputValue.trim() || !apiKey) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: getMessageHistory(inputValue),
          model: currentModel,
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

  // 更新发送图片消息函数
  const sendMessageWithImage = async (base64Image) => {
    if (!apiKey) return;

    setLoading(true);
    try {
      const imageMessage = [
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: "auto"
          }
        }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-api-version': '2024-03-01'
        },
        body: JSON.stringify({
          messages: getMessageHistory(imageMessage),
          model: currentModel,
          max_tokens: 1000,
          stream: false,
          temperature: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      const aiMessage = {
        type: 'ai',
        content: data.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      message.error('图片上传失败：' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setImageUrl(null);
    }
  };

  // 处理控制台打开/关闭
  const handleConsoleToggle = () => {
    // setIsConsoleVisible(!isConsoleVisible);
  };

  // 处理控制台跳转
  const handleConsoleClick = () => {
    window.open('https://console.x.ai/team/2ca12c0e-dfa5-4ccf-9d64-1bff3390222a', '_blank');
  };

  // 定义下拉菜单项
  const dropdownItems = [
    {
      key: 'console',
      label: (
        <DropdownItem onClick={handleConsoleClick}>
          <CIcon icon={cilDevices} size="sm"/>
          <span>进入控制台</span>
        </DropdownItem>
      ),
    }
  ];

  // 如果没有密钥，显示加载状态
  if (!apiKey) {
    return (
      <StyledCard>
        <LoadingWrapper>
          <CSpinner color="primary"/>
        </LoadingWrapper>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <CIcon icon={cilDevices} size="lg" className="me-2"/>
        <span>AI 助手</span>
        <CBadge color="success" shape="rounded-pill" className="ms-2">在线</CBadge>
        <HeaderRightGroup>
          {accountInfo.remainingQuota !== null && (
            <QuotaInfo>
              <QuotaBadge color="info" shape="rounded-pill">
                剩余: {accountInfo.remainingQuota}
              </QuotaBadge>
            </QuotaInfo>
          )}
          <Dropdown
            menu={{items: dropdownItems}}
            placement="bottomRight"
            trigger={['click']}
            dropdownRender={menu => (
              <DropdownWrapper>
                {menu}
              </DropdownWrapper>
            )}
            overlayStyle={{
              background: 'var(--cui-card-bg)'
            }}
          >
            <ConsoleButton
              color="light"
              variant="ghost"
              title="设置"
            >
              <SettingOutlined/>
            </ConsoleButton>
          </Dropdown>
        </HeaderRightGroup>
      </StyledCardHeader>

      <StyledCardBody>
        {messages.map((msg, index) => (
          <MessageBubble key={index} type={msg.type}>
            {msg.type !== 'user' && (
              <CAvatar
                size="xs"
                color={msg.type === 'user' ? 'primary' : 'info'}
                className={msg.type === 'user' ? 'ms-1' : 'me-1'}
              >
                <CIcon icon={msg.type === 'user' ? cilUser : cilCommentSquare} size="xs"/>
              </CAvatar>
            )}
            <MessageContentWrapper type={msg.type}>
              {msg.image && (
                <MessageImage src={msg.image} alt="uploaded"/>
              )}
              <MessageContent
                content={msg.content}
                type={msg.type}
              />
              <TimeStamp>{msg.timestamp}</TimeStamp>
            </MessageContentWrapper>
            {msg.type === 'user' && (
              <CAvatar
                size="xs"
                color="primary"
                className="ms-1"
              >
                <CIcon icon={cilUser} size="xs"/>
              </CAvatar>
            )}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef}/>
        {loading && (
          <LoadingWrapper>
            <CSpinner size="sm" variant="grow"/>
          </LoadingWrapper>
        )}
      </StyledCardBody>

      <StyledCardFooter>
        <FooterLeftGroup>
          <StyledSelect
            value={currentModel}
            onChange={handleModelChange}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{
              background: 'var(--cui-card-bg)',
              border: '1px solid var(--cui-border-color)',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              minWidth: '180px'
            }}
          >
            {MODEL_OPTIONS.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <ModelOptionContent>
                  <CIcon icon={option.icon} size="sm"/>
                  <span>{option.label}</span>
                  {option.supportsImage && (
                    <ModelFeatureBadge>图片</ModelFeatureBadge>
                  )}
                </ModelOptionContent>
              </Select.Option>
            ))}
          </StyledSelect>
          {MODEL_OPTIONS.find(model => model.value === currentModel)?.supportsImage && (
            <StyledButton
              color="light"
              variant="ghost"
              disabled={loading}
              title="上传图片"
            >
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false;
                }}
              >
                <CIcon icon={cilImage} size="lg"/>
              </Upload>
            </StyledButton>
          )}
        </FooterLeftGroup>
        <StyledTextarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          disabled={loading}
          rows={1}
        />
        <SendButton
          color="primary"
          onClick={handleSend}
          disabled={loading || (!inputValue.trim() && !imageUrl)}
          title="发送消息"
        >
          <CIcon icon={cilArrowRight} size="lg"/>
        </SendButton>
      </StyledCardFooter>
    </StyledCard>
  );
};

// 更新卡片样式
const StyledCard = styled(CCard)`
  height: calc(100vh - 100px);
  margin: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: none;
  background: var(--cui-card-bg);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledCardHeader = styled(CCardHeader)`
  padding: 12px 16px;
  background: var(--cui-card-cap-bg);
  border-bottom: 1px solid var(--cui-border-color);
  display: flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--cui-body-color);
  position: sticky;
  top: 12px;
  z-index: 1;
  flex-shrink: 0;
`;

const StyledCardBody = styled(CCardBody)`
  padding: 12px 16px;
  padding-top: 0;
  overflow-y: auto;
  background: var(--cui-body-bg);
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--cui-border-color);
    border-radius: 3px;
  }
`;

const StyledCardFooter = styled(CCardFooter)`
  padding: 12px 16px;
  background: var(--cui-card-cap-bg);
  border-top: 1px solid var(--cui-border-color);
  display: flex;
  gap: 8px;
  align-items: flex-end;
  position: sticky;
  bottom: 0;
  z-index: 1;
  flex-shrink: 0;
`;

// 更新输入框样式
const StyledTextarea = styled(CFormTextarea)`
  resize: none;
  border-radius: 8px;
  background: var(--cui-input-bg);
  color: var(--cui-input-color);
  border-color: var(--cui-input-border-color);
  font-size: 10px;
  padding: 8px 12px;
  flex: 1; // 允许输入框占据剩余空间

  &:focus {
    box-shadow: 0 0 0 2px var(--cui-primary-rgb);
    border-color: var(--cui-primary);
  }

  &::placeholder {
    color: var(--cui-input-placeholder-color);
    font-size: 10px;
  }
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 8px;
  margin: 4px 0;
  justify-content: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'};
`;

const MessageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  gap: 6px;
  align-items: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'};
`;

// 添加代码块和 Markdown 相关的样式组件
const CodeBlock = styled.pre`
  background: var(--cui-dark);
  border-radius: 6px;
  padding: 8px;
  margin: 4px 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  line-height: 1.4;
  overflow-x: auto;
  color: #e9ecef;
  width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--cui-border-color);
    border-radius: 2px;
  }
`;

const LanguageTag = styled.div`
  color: #6c757d;
  font-size: 10px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 4px;
  display: inline-block;
`;

const MarkdownContent = styled.div`
  h3 {
    font-size: 12px;
    font-weight: 600;
    margin: 12px 0 8px 0;
    color: ${props => props.type === 'user' ? '#fff' : 'var(--cui-body-color)'};
  }

  p {
    margin: 4px 0;
  }

  ul {
    margin: 4px 0;
    padding-left: 16px;

    li {
      margin: 2px 0;
    }
  }
`;

// 更新 MessageContent 组件的渲染逻辑
const MessageContent = ({content, type}) => {
  // 分割内容为代码块和非代码块部分
  const parts = content.split(/(```[\s\S]*?```)/);

  return (
    <StyledMessageContent type={type}>
      <MarkdownContent type={type}>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // 提取代码和语言
            const [firstLine, ...codeLines] = part.slice(3, -3).split('\n');
            const language = firstLine.trim();
            const code = codeLines.join('\n');

            return (
              <div key={index}>
                {language && <LanguageTag>{language}</LanguageTag>}
                <CodeBlock>
                  {code}
                </CodeBlock>
              </div>
            );
          }

          // 处理普通文本中的 Markdown 语法
          const formattedText = part
            .split('\n')
            .map((line, i) => {
              if (line.startsWith('### ')) {
                return <h3 key={i}>{line.slice(4)}</h3>;
              }
              if (line.startsWith('- ')) {
                return <ul key={i}>
                  <li>{line.slice(2)}</li>
                </ul>;
              }
              if (line.trim() === '') {
                return <br key={i}/>;
              }
              return <p key={i}>{line}</p>;
            });

          return <div key={index}>{formattedText}</div>;
        })}
      </MarkdownContent>
    </StyledMessageContent>
  );
};

// 更新消息内容的基础样式
const StyledMessageContent = styled.div`
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.type === 'user' ? 'var(--cui-primary)' : 'var(--cui-card-bg)'};
  color: ${props => props.type === 'user' ? '#fff' : 'var(--cui-body-color)'};
  font-size: 10px;
  line-height: 1.4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  white-space: pre-wrap;
  word-break: break-word;

  ${props => props.type !== 'user' && `
    border: 1px solid var(--cui-border-color);
  `}
`;

const MessageImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 12px;
  margin-bottom: 8px;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--cui-border-color);
`;

const TimeStamp = styled.span`
  font-size: 10px;
  color: var(--cui-text-muted);
  margin-top: 2px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const StyledButton = styled(CButton)`
  padding: 6px;
  border-radius: 8px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--cui-primary-rgb), 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const SendButton = styled(StyledButton)`
  background: var(--cui-primary);
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background: var(--cui-primary-hover);
  }

  &:active:not(:disabled) {
    background: var(--cui-primary-active);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(2px);
  }
`;

const ModelToggleButton = styled(StyledButton)`
  position: relative;
  padding: 6px 12px;
  width: auto;
  gap: 4px;
  background: var(--cui-card-cap-bg);
  border: 1px solid var(--cui-border-color);
  color: var(--cui-body-color);

  &:hover:not(:disabled) {
    background: var(--cui-input-bg);
  }
`;

const ModelBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: var(--cui-body-color);
  background: var(--cui-input-bg);
  padding: 5px 10px;
  border-radius: 4px;
`;

const FooterLeftGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledSelect = styled(Select)`
  width: 180px;

  .ant-select-selector {
    background: var(--cui-input-bg) !important;
    border: 1px solid var(--cui-border-color) !important;
    border-radius: 8px !important;
    height: 32px !important;
    padding: 0 8px !important;

    .ant-select-selection-item {
      font-size: 10px;
      line-height: 30px !important;
      color: var(--cui-body-color);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const DropdownWrapper = styled.div`
  background: var(--cui-card-bg);
  border-radius: 8px;
  border: 1px solid var(--cui-border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 4px;
  min-width: 120px;

  .ant-dropdown-menu {
    background: var(--cui-card-bg);
    border: none;
    box-shadow: none;
    padding: 0;
  }
`;

const ModelOptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  font-size: 10px;
  color: inherit;
  min-width: 160px;

  .ant-select-item-option-selected & {
    color: var(--cui-primary);
  }
`;

const ModelFeatureBadge = styled(CBadge)`
  font-size: 10px;
  padding: 5px 10px;
  background: ${props => props.selected ? 'var(--cui-primary)' : 'var(--cui-secondary)'};
  color: white;
  border-radius: 4px;
  margin-left: auto;
  flex-shrink: 0;
`;

const QuotaInfo = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: center;
`;

const QuotaBadge = styled(CBadge)`
  font-size: 10px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const HeaderRightGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: center;
`;

const ConsoleButton = styled(CButton)`
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cui-card-cap-bg);
  color: var(--cui-body-color);
  border: 1px solid var(--cui-border-color);

  &:hover {
    background: var(--cui-input-bg);
    color: var(--cui-primary);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 10px;
  color: var(--cui-body-color);
  cursor: pointer;
  border-radius: 4px;
  background: var(--cui-card-bg);

  &:hover {
    background: var(--cui-input-bg);
    color: var(--cui-primary);
  }

  svg {
    width: 14px;
    height: 14px;
    color: var(--cui-body-color);
  }

  &:hover svg {
    color: var(--cui-primary);
  }
`;

export default XAIChat;
