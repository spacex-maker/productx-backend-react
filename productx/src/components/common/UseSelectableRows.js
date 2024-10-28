import { useState } from 'react';

export const UseSelectableRows = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = (event, data) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        setSelectedRows(checked ? data.map((item) => item.id) : []);
    };

    const handleSelectRow = (id, data) => {
        const newSelectedRows = selectedRows.includes(id)
            ? selectedRows.filter((rowId) => rowId !== id)
            : [...selectedRows, id];

        setSelectedRows(newSelectedRows);
        if (data){
            setSelectAll(newSelectedRows.length === data.length);
        }
    };

    const resetSelection = () => {
        setSelectedRows([]);
        setSelectAll(false);
    };

    return {
        selectedRows,
        selectAll,
        handleSelectAll,
        handleSelectRow,
        resetSelection, // 返回一个重置选择状态的方法
    };
};
