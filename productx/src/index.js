import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'core-js';
import './i18n'; // 引入 i18n 配置
import App from './App';
import store from './store';

const container = document.getElementById('root');
const root = createRoot(container);

// 用于调试
console.log('Initial Redux State:', store.getState());

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
