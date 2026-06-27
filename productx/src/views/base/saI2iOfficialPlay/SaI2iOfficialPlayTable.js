import React from 'react';
import { Button, Image, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const REF_IMAGE_SIZE = 120;

const refImageStyle = {
  objectFit: 'cover',
  borderRadius: 8,
  border: '1px solid #f0f0f0',
};

const SaI2iOfficialPlayTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="i2i_play_select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="i2i_play_select_all"></label>
            </div>
          </th>
          <th>{t('i2iPlayRefBefore')}</th>
          <th>{t('i2iPlayRefAfter')}</th>
          <th>{t('i2iPlayCode')}</th>
          <th>{t('i2iPlayName')}</th>
          <th>{t('i2iPlayCategory')}</th>
          <th>{t('i2iPlayLikes')}</th>
          <th>{t('i2iPlayGenerations')}</th>
          <th>{t('sortOrder')}</th>
          <th>{t('status')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`i2i_play_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label className="custom-control-label" htmlFor={`i2i_play_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td style={{ minWidth: REF_IMAGE_SIZE + 16, verticalAlign: 'middle' }}>
              {item.referenceBeforeImage ? (
                <Image
                  src={item.referenceBeforeImage}
                  width={REF_IMAGE_SIZE}
                  height={REF_IMAGE_SIZE}
                  style={refImageStyle}
                  preview={{ mask: t('preview') || '预览' }}
                />
              ) : '-'}
            </td>
            <td style={{ minWidth: REF_IMAGE_SIZE + 16, verticalAlign: 'middle' }}>
              {item.referenceAfterImage ? (
                <Image
                  src={item.referenceAfterImage}
                  width={REF_IMAGE_SIZE}
                  height={REF_IMAGE_SIZE}
                  style={refImageStyle}
                  preview={{ mask: t('preview') || '预览' }}
                />
              ) : '-'}
            </td>
            <td>{item.playCode}</td>
            <td>
              <div>{item.coverEmoji ? `${item.coverEmoji} ` : ''}{item.playName}</div>
              {item.playNameEn && <div style={{ color: '#999', fontSize: 12 }}>{item.playNameEn}</div>}
            </td>
            <td>{item.category || '-'}</td>
            <td>{item.likesCount ?? 0}</td>
            <td>{item.generationCount ?? 0}</td>
            <td>{item.sortOrder ?? 0}</td>
            <td>
              <Switch
                checked={item.status === 1}
                onChange={(checked) => handleEnableStatusChange(item.id, checked)}
                checkedChildren={t('active')}
                unCheckedChildren={t('inactive')}
              />
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaI2iOfficialPlayTable;
