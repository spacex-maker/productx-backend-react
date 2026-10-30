import React from 'react';
import { Button, Image, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const REF_IMAGE_SIZE = 100;

const refImageStyle = {
  objectFit: 'cover',
  borderRadius: 8,
  border: '1px solid #f0f0f0',
};

const SaEcommerceOfficialModelTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

  const poseLabel = (key) => {
    if (!key) return '-';
    const map = {
      standing: t('ecomModelPoseStanding'),
      walking: t('ecomModelPoseWalking'),
      three_quarter: t('ecomModelPoseThreeQuarter'),
      sit: t('ecomModelPoseSit'),
    };
    return map[key] || key;
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="ecom_model_select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="ecom_model_select_all"></label>
            </div>
          </th>
          <th>{t('ecomModelComposedImage')}</th>
          <th>{t('ecomModelFaceImage')}</th>
          <th>{t('ecomModelBodyImage')}</th>
          <th>{t('ecomModelCode')}</th>
          <th>{t('ecomModelName')}</th>
          <th>{t('ecomModelGender')}</th>
          <th>{t('ecomModelBodyType')}</th>
          <th>{t('ecomModelPose')}</th>
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
                  id={`ecom_model_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label className="custom-control-label" htmlFor={`ecom_model_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td style={{ minWidth: REF_IMAGE_SIZE + 16, verticalAlign: 'middle' }}>
              {item.composedImageUrl ? (
                <Image
                  src={item.composedImageUrl}
                  width={REF_IMAGE_SIZE}
                  height={REF_IMAGE_SIZE * 1.4}
                  style={refImageStyle}
                  preview={{ mask: t('preview') || '预览' }}
                />
              ) : '-'}
            </td>
            <td style={{ minWidth: REF_IMAGE_SIZE + 16, verticalAlign: 'middle' }}>
              {item.faceImageUrl ? (
                <Image
                  src={item.faceImageUrl}
                  width={REF_IMAGE_SIZE}
                  height={REF_IMAGE_SIZE}
                  style={refImageStyle}
                  preview={{ mask: t('preview') || '预览' }}
                />
              ) : '-'}
            </td>
            <td style={{ minWidth: REF_IMAGE_SIZE + 16, verticalAlign: 'middle' }}>
              {item.bodyImageUrl ? (
                <Image
                  src={item.bodyImageUrl}
                  width={REF_IMAGE_SIZE}
                  height={REF_IMAGE_SIZE * 1.4}
                  style={refImageStyle}
                  preview={{ mask: t('preview') || '预览' }}
                />
              ) : '-'}
            </td>
            <td>{item.modelCode}</td>
            <td>
              <div>{item.modelName}</div>
              {item.modelNameEn && <div style={{ color: '#999', fontSize: 12 }}>{item.modelNameEn}</div>}
            </td>
            <td>{item.gender === 'male' ? t('ecomModelGenderMale') : t('ecomModelGenderFemale')}</td>
            <td>{item.bodyType || '-'}</td>
            <td>{poseLabel(item.poseKey)}</td>
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

export default SaEcommerceOfficialModelTable;
