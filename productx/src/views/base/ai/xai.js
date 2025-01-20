import React, {useState, useRef, useEffect} from 'react';
import {Upload, message, Select, Dropdown} from 'antd';
import {RobotOutlined, SettingOutlined, ExpandOutlined, CompressOutlined} from '@ant-design/icons';
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
  cilDevices,
  cilChevronLeft,
  cilList
} from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { updateFloatingPosition } from '../../../store/aiChat';

const API_URL = 'https://api.x.ai/v1/chat/completions';

// 更新模型选项配置
const MODEL_OPTIONS = [
  {
    value: 'gpt-4-turbo-preview',
    label: 'GPT-4 Turbo',
    icon: cilSpeedometer,
    supportsImage: false
  },
  {
    value: 'gpt-4-vision-preview',
    label: 'GPT-4 Vision',
    icon: cilImage,
    supportsImage: true
  },
  {
    value: 'gpt-4',
    label: 'GPT-4',
    icon: cilDevices,
    supportsImage: false
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    icon: cilCommentSquare,
    supportsImage: false
  },
  {
    value: 'gpt-3.5-turbo-16k',
    label: 'GPT-3.5 16K',
    icon: cilCommentSquare,
    supportsImage: false
  }
];

const XAIChat = ({ isFloating = false, onClose, onToggleFloating }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentModel, setCurrentModel] = useState('gpt-3.5-turbo');
  const messagesEndRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    remainingQuota: null,
    balance: null
  });
  const [apiKey, setApiKey] = useState(null);
  const dispatch = useDispatch();
  const initialPosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const [showSessions, setShowSessions] = useState(!isFloating);

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
      message.error(t('getKeyFailed'));
    }
  };

  // 组件加载时获取密钥
  useEffect(() => {
    fetchApiKey();
  }, []);

  // 获取历史会话列表
  const fetchSessions = async () => {
    try {
      const response = await api.get('/manage/chat/sessions');
      // 解构出正确的数据层级
      const sessions = response.data || [];
      if (sessions && sessions.length > 0) {
        setSessions(sessions);
        const latestSession = sessions[0];
        await fetchSessionMessages(latestSession.id);
      }
    } catch (error) {
      console.error('获取会话列表失败:', error);
      message.error(t('getSessionsFailed'));
    }
  };

  // 获取指定会话的消息历史
  const fetchSessionMessages = async (sessionId) => {
    try {
      const messages = await api.get(`/manage/chat/history/${sessionId}`);
      if (messages && Array.isArray(messages)) {
        const formattedMessages = messages.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'ai',
          content: msg.content,
          timestamp: new Date(msg.createTime).toLocaleTimeString()
        }));
        setMessages(formattedMessages);
        setSessionId(sessionId);
      }
    } catch (error) {
      console.error('获取消息历史失败:', error);
      message.error(t('getHistoryFailed'));
    }
  };

  // 组件加载时获取历史会话
  useEffect(() => {
    fetchSessions();
  }, []);

  // 发送消息
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
      const payload = {
        content: inputValue,
        model: currentModel
      };

      if (sessionId) {
        payload.sessionId = sessionId;
      }

      const data = await api.post('/manage/chat/send', payload);
      
      const aiMessage = {
        type: 'ai',
        content: data.content,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // 如果是新会话，保存会话ID
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

    } catch (error) {
      console.error('发送消息失败:', error);
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

  // 更新切换浮窗的处理函数
  const handleToggleMode = () => {
    if (isFloating) {
      onClose?.();
    } else {
      onToggleFloating?.();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const newX = e.clientX - initialPosition.current.x;
    const newY = e.clientY - initialPosition.current.y;
    dispatch(updateFloatingPosition({ x: newX, y: newY }));
  };

  // 修改会话切换处理函数
  const handleSessionChange = async (sessionId) => {
    setLoadingSession(true);
    try {
      await fetchSessionMessages(sessionId);
    } finally {
      setLoadingSession(false);
    }
  };

  // 添加新建会话的处理函数
  const handleNewSession = () => {
    setSessionId(null);
    setMessages([]);
  };

  // 添加切换会话列表显示的处理函数
  const toggleSessionList = () => {
    setShowSessions(prev => !prev);
  };

  // 在浮窗模式改变时更新显示状态
  useEffect(() => {
    setShowSessions(!isFloating);
  }, [isFloating]);

  // 添加格式化时间的函数
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  // 如果没有密钥，显示加载状态
  if (!apiKey) {
    return (
      <StyledCard $isFloating={isFloating}>
        <LoadingWrapper>
          <CSpinner color="primary"/>
        </LoadingWrapper>
      </StyledCard>
    );
  }

  return (
    <StyledCard $isFloating={isFloating}>
      <StyledCardHeader>
        {isFloating && (
          <SessionToggleButton
            color="light"
            variant="ghost"
            onClick={toggleSessionList}
            title={showSessions ? t('hideSessions') : t('showSessions')}
          >
            <CIcon icon={showSessions ? cilChevronLeft : cilList} size="sm"/>
          </SessionToggleButton>
        )}
        <CIcon icon={cilDevices} size="lg" className="me-2"/>
        <span>{t('aiAssistant')}</span>
        <CBadge color="success" shape="rounded-pill" className="ms-2">
          {t('online')}
        </CBadge>
        <HeaderRightGroup>
          {accountInfo.remainingQuota !== null && (
            <QuotaInfo>
              <QuotaBadge color="info" shape="rounded-pill">
                {t('remaining')}: {accountInfo.remainingQuota}
              </QuotaBadge>
            </QuotaInfo>
          )}
          <FloatingButton
            color="light"
            variant="ghost"
            onClick={handleToggleMode}
            title={isFloating ? t('exitFloating') : t('switchFloating')}
          >
            {isFloating ? <CompressOutlined /> : <ExpandOutlined />}
          </FloatingButton>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'console',
                  label: (
                    <DropdownItem onClick={handleConsoleClick}>
                      <CIcon icon={cilDevices} size="sm"/>
                      <span>{t('enterConsole')}</span>
                    </DropdownItem>
                  ),
                }
              ]
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <ConsoleButton
              color="light"
              variant="ghost"
              title={t('settings')}
            >
              <CIcon icon={cilDevices} size="sm"/>
            </ConsoleButton>
          </Dropdown>
        </HeaderRightGroup>
      </StyledCardHeader>

      <StyledCardBody>
        <SessionListWrapper $show={showSessions}>
          <SessionListHeader>
            <NewSessionButton
              color="primary"
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
            >
              {t('newChat')}
            </NewSessionButton>
          </SessionListHeader>
          <SessionList>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                $active={session.id === sessionId}
                onClick={() => handleSessionChange(session.id)}
                disabled={loadingSession}
              >
                <SessionTitle>
                  {session.title || t('untitledChat')}
                </SessionTitle>
                <SessionTime>
                  {formatTime(session.createTime)}
                </SessionTime>
              </SessionItem>
            ))}
          </SessionList>
        </SessionListWrapper>

        <ChatContentWrapper $fullWidth={!showSessions}>
          {loadingSession ? (
            <LoadingWrapper>
              <CSpinner color="primary" />
              <LoadingText>{t('loadingMessages')}</LoadingText>
            </LoadingWrapper>
          ) : messages.length === 0 ? (
            <EmptyState>
              <CIcon icon={cilCommentSquare} size="3xl" className="text-muted mb-3"/>
              <div className="text-muted">{t('startNewChat')}</div>
            </EmptyState>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} type={msg.type}>
                {msg.type === 'ai' && (
                  <CAvatar size="sm" color="info" className="me-2">
                    <CIcon icon={cilCommentSquare} size="sm"/>
                  </CAvatar>
                )}
                <MessageContentWrapper type={msg.type}>
                  <StyledMessageContent type={msg.type}>
                    {msg.content}
                  </StyledMessageContent>
                  <TimeStamp>{msg.timestamp}</TimeStamp>
                </MessageContentWrapper>
                {msg.type === 'user' && (
                  <CAvatar size="sm" color="primary" className="ms-2">
                    <CIcon icon={cilUser} size="sm"/>
                  </CAvatar>
                )}
              </MessageBubble>
            ))
          )}
          <div ref={messagesEndRef}/>
          {loading && (
            <LoadingWrapper>
              <CSpinner size="sm"/>
            </LoadingWrapper>
          )}
        </ChatContentWrapper>
      </StyledCardBody>

      <StyledCardFooter>
        <FooterLeftGroup>
          <StyledSelect
            value={currentModel}
            onChange={handleModelChange}
          >
            {MODEL_OPTIONS.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <ModelOptionContent>
                  <CIcon icon={option.icon} size="sm"/>
                  <span>{option.label}</span>
                  {option.supportsImage && (
                    <ModelFeatureBadge>{t('image')}</ModelFeatureBadge>
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
              title={t('image')}
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
          placeholder={t('typeMessage')}
          disabled={loading}
          rows={1}
        />
        <SendButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          title={t('sendMessage')}
        >
          <CIcon icon={cilArrowRight} size="lg"/>
        </SendButton>
      </StyledCardFooter>
    </StyledCard>
  );
};

// 更新卡片样式
const StyledCard = styled(CCard)`
  position: ${props => props.$isFloating ? 'fixed' : 'fixed'};
  top: ${props => props.$isFloating ? '20px' : '64px'};
  left: ${props => props.$isFloating ? 'auto' : '256px'};
  right: ${props => props.$isFloating ? '20px' : '0'};
  bottom: ${props => props.$isFloating ? 'auto' : '50px'};
  width: ${props => props.$isFloating ? '400px' : 'auto'};
  height: ${props => props.$isFloating ? '600px' : 'calc(100vh - 114px)'};
  margin: 0;
  border-radius: ${props => props.$isFloating ? '8px' : '0'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${props => props.$isFloating ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  z-index: ${props => props.$isFloating ? '1050' : 'auto'};

  @media (max-width: 768px) {
    left: ${props => props.$isFloating ? '20px' : '0'};
    width: ${props => props.$isFloating ? 'calc(100% - 40px)' : '100%'};
  }
`;

const StyledCardHeader = styled(CCardHeader)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  flex-shrink: 0;
  background: var(--cui-card-cap-bg);
  border-bottom: 1px solid var(--cui-border-color);
`;

const StyledCardBody = styled(CCardBody)`
  flex: 1;
  display: flex;
  padding: 0;
  background: var(--cui-body-bg);
  overflow: hidden;
  position: relative;

  /* 自定义滚动条样式 */
  & > div {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--cui-border-color);
      border-radius: 3px;
    }
  }
`;

const StyledCardFooter = styled(CCardFooter)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  flex-shrink: 0;
  background: var(--cui-card-cap-bg);
  border-top: 1px solid var(--cui-border-color);
`;

const MessageBubble = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'};
  gap: 0.5rem;
`;

const MessageContentWrapper = styled.div`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledMessageContent = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.type === 'user' ? 'var(--cui-primary)' : 'var(--cui-card-bg)'};
  color: ${props => props.type === 'user' ? '#fff' : 'var(--cui-body-color)'};
  white-space: pre-wrap;
  word-break: break-word;

  pre {
    background-color: ${props => props.type === 'user' ? 'rgba(255, 255, 255, 0.1)' : '#f6f8fa'};
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.45;
    margin: 8px 0;
  }

  code {
    background-color: ${props => props.type === 'user' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(175, 184, 193, 0.2)'};
    border-radius: 4px;
    padding: 0.2em 0.4em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 85%;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
  }
`;

const StyledTextarea = styled(CFormTextarea)`
  flex: 1;
  resize: none;
`;

const HeaderRightGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
`;

const LoadingText = styled.div`
  color: var(--cui-text-muted);
  font-size: 0.875rem;
`;

const MessageImage = styled.img`
  max-width: 100%;
  border-radius: 0.5rem;
`;

const TimeStamp = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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

const StyledSelect = styled(Select)`
  .ant-select-selector {
    background: var(--cui-input-bg) !important;
    border: var(--cui-border-width) solid var(--cui-border-color) !important;
    border-radius: var(--cui-border-radius) !important;
    height: var(--cui-input-height) !important;
    padding: var(--cui-input-padding-y) var(--cui-input-padding-x) !important;
  }

  .ant-select-selection-item {
    line-height: var(--cui-input-line-height) !important;
    color: var(--cui-body-color) !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ant-select-dropdown {
    background: var(--cui-card-bg) !important;
    border: 1px solid var(--cui-border-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .ant-select-item {
    color: var(--cui-body-color) !important;
    background: transparent !important;
  }

  .ant-select-item-option-selected {
    background: var(--cui-input-bg) !important;
  }

  .ant-select-item-option-active {
    background: var(--cui-input-bg) !important;
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

const ConsoleButton = styled(CButton)`
  padding: 4px 8px;
  font-size: 12px;
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

// Add new styled component for empty state
const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--cui-text-muted);
`;

const FloatingButton = styled(CButton)`
  padding: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: var(--cui-btn-bg);
  color: var(--cui-body-color);
  border: 1px solid var(--cui-border-color);

  &:hover {
    transform: translateY(-1px);
    background: var(--cui-btn-hover-bg);
    color: var(--cui-btn-hover-color);
    border-color: var(--cui-btn-hover-border-color);
  }

  &:active {
    transform: translateY(0);
    background: var(--cui-btn-active-bg);
    color: var(--cui-btn-active-color);
    border-color: var(--cui-btn-active-border-color);
  }
`;

// Add new styled component for session list
const SessionListWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  border-right: 1px solid var(--cui-border-color);
  background: var(--cui-card-cap-bg);
  transition: transform 0.3s ease;
  transform: translateX(${props => props.$show ? '0' : '-100%'});
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
`;

const SessionItem = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.$active ? 'var(--cui-primary)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'var(--cui-body-color)'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => !props.disabled && (props.$active ? 'var(--cui-primary)' : 'var(--cui-input-bg)')};
  }
`;

const SessionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SessionTime = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
`;

const ChatContentWrapper = styled.div`
  position: absolute;
  left: ${props => props.$fullWidth ? '0' : '200px'};
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px;
  transition: all 0.3s ease;
  background: var(--cui-body-bg);
`;

// Add new styled component for session list header
const SessionListHeader = styled.div`
  padding: 8px;
  border-bottom: 1px solid var(--cui-border-color);
  display: flex;
  justify-content: center;
`;

// Add new styled component for new session button
const NewSessionButton = styled(CButton)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  
  &:hover {
    background: var(--cui-primary);
    color: white;
  }
`;

const SessionToggleButton = styled(CButton)`
  padding: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(2px);
  }
`;

export default XAIChat;
