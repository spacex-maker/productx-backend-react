import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({totalPages, current, onPageChange, pageSize, onPageSizeChange}) => {
  const maxButtons = 5;

  const getPageRange = () => {
    let start = Math.max(1, current - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({length: end - start + 1}, (_, index) => start + index);
  };

  const handleJumpToPage = (event) => {
    const page = parseInt(event.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    if (!isNaN(size) && size > 0) {
      onPageSizeChange(size);
    }
  };

  return (
    <div style={{float: 'right'}}>
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* 上一页 */}
          <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(current - 1)}
              disabled={current === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
          </li>

          {/* 页码按钮 */}
          {getPageRange().map((page) => (
            <li key={page} className={`page-item ${current === page ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* 下一页 */}
          <li className={`page-item ${current === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(current + 1)}
              disabled={current === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </li>

          {/* 跳转到指定页 */}
          <li className="page-item">
            <input
              type="number"
              className="page-link"
              style={{width: '4rem', textAlign: 'center'}}
              min="1"
              max={totalPages}
              placeholder="跳转"
              onBlur={handleJumpToPage}
            />
          </li>

          {/* 每页条数选择 */}
          <li className="page-item">
            <select
              className="page-link"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {[10, 50, 100].map(size => (
                <option key={size} value={size}>{size} 条/页</option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
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
