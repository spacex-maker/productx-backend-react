import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ totalPages, current, onPageChange }) => {
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index} className={`page-item ${current === index + 1 ? 'active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
