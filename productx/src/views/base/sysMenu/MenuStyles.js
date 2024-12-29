import styled from 'styled-components'

export const StyledTreeContainer = styled.div`
  // 隐藏默认的 toggle 图标
  .rst__tree {
    .rst__toggle {
      display: none;
    }
  }

  // 节点内容样式
  .tree-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 4px;
    background: var(--cui-card-bg);
    transition: all 0.3s;

    &:hover {
      background: var(--cui-tertiary-bg);
    }
  }

  // 子菜单缩进样式
  .children {
    margin-left: 40px;
  }

  // 左侧内容区域
  .left-content {
    display: flex;
    align-items: center;
    gap: 12px;

    // 展开/折叠按钮
    .expand-icon {
      font-size: 20px;
      color: var(--cui-body-color);
      cursor: pointer;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      padding: 4px;
      
      &.expanded {
        transform: rotate(90deg);
      }

      &:hover {
        color: var(--cui-primary);
      }
    }

    // 菜单信息
    .node-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .menu-icon {
        width: 16px;
        height: 16px;
        color: var(--cui-body-color);
      }

      .menu-tag {
        margin-left: 8px;
      }
    }
  }

  // 右侧操作区域
  .right-content {
    display: flex;
    align-items: center;
    gap: 16px;

    // 状态开关样式
    .status-switch {
      &.ant-switch {
        background-color: var(--cui-danger);
        
        &.ant-switch-checked {
          background-color: var(--cui-success);
        }
      }
    }

    .node-actions {
      opacity: 0;
      transition: opacity 0.2s;
      
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    }
  }

  &:hover .node-actions {
    opacity: 1;
  }

  // 暗色主题适配
  [data-theme="dark"] & {
    .tree-content {
      background: var(--cui-dark);

      &:hover {
        background: var(--cui-dark-hover);
      }

      .expand-icon:hover {
        color: var(--cui-primary-light);
      }

      .status-switch {
        &.ant-switch {
          background-color: var(--cui-danger-dark);
          
          &.ant-switch-checked {
            background-color: var(--cui-success-dark);
          }
        }
      }
    }
  }
` 