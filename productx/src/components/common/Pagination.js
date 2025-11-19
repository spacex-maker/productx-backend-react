import React from 'react';
import PropTypes from 'prop-types';
import { CPagination, CPaginationItem } from '@coreui/react';
import { useTranslation } from 'react-i18next'; // 引入 useTranslation
const Pagination = ({ totalPages, current, onPageChange, pageSize, onPageSizeChange }) => {
  const maxButtons = 5;

  const getPageRange = () => {
    let start = Math.max(1, current - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const handlePageSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    if (!isNaN(size) && size > 0) {
      onPageSizeChange(size);
      // 切换每页显示条数时，重置到第一页
      onPageChange(1);
    }
  };
  const { t } = useTranslation(); // 使用 t() 方法进行翻译
  return (
    <div style={{ float: 'right' }}>
      <CPagination align="end" aria-label="Page navigation example">
        <CPaginationItem
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>

        </CPaginationItem>

        {getPageRange().map((page) => (
          <CPaginationItem
            key={page}
            active={current === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </CPaginationItem>
        ))}

        {/* 下一页 */}
        <CPaginationItem
          disabled={current === totalPages}
          onClick={() => onPageChange(current + 1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </CPaginationItem>
        <select
          className="page-link"
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{marginLeft: '10px'}}
        >
          {[10, 50, 100].map(size => (
            <option key={size} value={size}>{size} 条/页</option>
          ))}
        </select>
        <span className="page-link" style={{ marginLeft: '10px' }}>
          {t('totalPages')}: {totalPages}
        </span>
      </CPagination>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default Pagination;
