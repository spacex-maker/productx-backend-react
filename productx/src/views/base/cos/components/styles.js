import styled from 'styled-components';
import { CCard } from '@coreui/react';

// 从 Cos.js 移动所有样式定义
export const StyledCard = styled(CCard)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const SearchWrapper = styled(CCard)`
  margin-bottom: 20px;

  .card-body {
    padding: 12px;
  }

  .input-group {
    width: 100%;
  }

  .btn-group {
    .btn {
      padding: 4px 12px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 4px;
      }
    }
  }

  @media (max-width: 768px) {
    .btn-group {
      width: 100%;

      .btn {
        flex: 1;
        justify-content: center;
      }
    }
  }
`;

export const TableWrapper = styled(CCard)`
  .ant-table-wrapper {
    background: white;
    border-radius: 4px;
  }
`;

export const GlobalStyle = styled.div`
  .table {
    margin-bottom: 0;

    th,
    td {
      padding: 8px 12px;
      vertical-align: middle;
    }
  }

  .btn {
    &.btn-sm {
      padding: 2px 6px;
    }
  }

  .badge {
    font-size: 10px !important;
    font-weight: normal !important;
    padding: 4px 8px !important;
  }

  .ant-space {
    gap: 4px !important;
  }

  .card-body {
    padding: 12px;
  }

  .custom-mask {
    font-size: 12px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .ant-image-preview-root {
    .ant-image-preview-wrap {
      .ant-image-preview-img {
        max-width: 90vw;
        max-height: 90vh;
      }
    }
  }
`;

export const DetailModalWrapper = styled.div`
  font-size: 12px;

  .modal-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--cui-body-color);
  }

  .section-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--cui-body-color);
    margin-bottom: 12px;
  }

  .detail-card {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 16px;
    margin-bottom: 16px;
  }

  .info-table {
    width: 100%;
    border-radius: var(--cui-border-radius);
    overflow: hidden;

    td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--cui-border-color);

      &:first-child {
        width: 100px;
        color: var(--cui-body-color);
        background: var(--cui-tertiary-bg);
      }

      &:last-child {
        background: var(--cui-card-bg);
      }
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  .badge {
    font-size: 11px;
    padding: 4px 8px;
    font-weight: normal;
    background: var(--cui-primary);

    &.badge-info {
      background: var(--cui-info);
    }

    &.badge-success {
      background: var(--cui-success);
    }
  }

  .copy-button {
    font-size: 11px;
    padding: 4px 8px;
    color: var(--cui-primary);
    background: var(--cui-btn-ghost-bg);
    border-color: var(--cui-primary);

    &:hover {
      color: var(--cui-white);
      background: var(--cui-primary);
    }

    .icon {
      font-size: 11px;
      margin-right: 4px;
    }
  }

  .link-section {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 12px;

    .link-text {
      font-size: 11px;
      color: var(--cui-body-color);
      word-break: break-all;
    }

    .hint-text {
      font-size: 11px;
      color: var(--cui-text-muted);
      margin-top: 8px;
    }
  }

  .modal-footer {
    background: var(--cui-tertiary-bg);
    border-top: 1px solid var(--cui-border-color);

    .btn {
      font-size: 12px;
      padding: 4px 12px;

      &.btn-primary {
        background: var(--cui-primary);
        border-color: var(--cui-primary);

        &:hover {
          background: var(--cui-primary-hover);
          border-color: var(--cui-primary-hover);
        }
      }

      &.btn-secondary {
        background: var(--cui-secondary);
        border-color: var(--cui-secondary);

        &:hover {
          background: var(--cui-secondary-hover);
          border-color: var(--cui-secondary-hover);
        }
      }
    }
  }

  [data-theme='dark'] & {
    .detail-card {
      background: var(--cui-dark);
    }

    .info-table {
      td:first-child {
        background: var(--cui-dark);
      }

      td:last-child {
        background: var(--cui-dark-bg);
      }
    }

    .link-section {
      background: var(--cui-dark);
    }
  }
`;

export const ProgressModalWrapper = styled.div`
  font-size: 12px;

  .modal-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--cui-body-color);
  }

  .progress-card {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 12px;
    margin-bottom: 12px;
  }

  .progress-bar {
    background-color: var(--cui-primary);
    height: 8px;
    border-radius: var(--cui-border-radius);

    &.success {
      background-color: var(--cui-success);
    }

    &.error {
      background-color: var(--cui-danger);
    }
  }

  .text-speed {
    color: var(--cui-primary);
  }

  .text-muted {
    color: var(--cui-text-muted) !important;
  }

  .text-error {
    color: var(--cui-danger);
  }

  .modal-footer {
    background: var(--cui-tertiary-bg);
    border-top: 1px solid var(--cui-border-color);
  }

  [data-theme='dark'] & {
    .progress-card {
      background: var(--cui-dark);
    }
  }
`; 