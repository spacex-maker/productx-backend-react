import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 *
 * @param {*} ModalComponent
 * @param {*} props
 * @param {*} domNode
 * @returns {[
 * {
 *  open(form?: any, onSubmit?:()=>Promise<boolean>): Promise<[boolean, object | null]>;
 *  close: () => void;
 * },
 * React.ReactPortal
 * ]}
 */
export const useModal = (ModalComponent, props, domNode = document.body) => {
  const [visible, setVisible] = useState(props?.visible ?? false);
  const handle = useRef({
    onOk: () => null,
    onCancel: () => null,
  });

  const onOk = async () => {
    await handle.current.onOk();
    if (typeof props.onOk === 'function') {
      props.onOk();
    }
  };

  const onCancel = () => {
    handle.current.onCancel();
    if (typeof props.onCancel === 'function') {
      props.onCancel();
    }
  };

  const mixProps = Object.assign({}, props, {
    open: visible,
    onOk,
    onCancel,
  });

  const placeHolder = createPortal(<ModalComponent {...mixProps} />, domNode);

  const modal = useMemo(() => {
    return {
      open(form, onSubmit) {
        setVisible(true);
        return new Promise((res) => {
          handle.current.onOk = async () => {
            if (!form) {
              res([true, null]);
              setVisible(false);
              return;
            }
            try {
              const values = await form.validateFields();
              if (onSubmit) {
                try {
                  const status = await onSubmit(values);
                  if (status) {
                    res([true, values]);
                    setVisible(false);
                  }
                  // 表单提交失败，不关闭弹窗
                  return;
                } catch (error) {
                  return;
                }
              }
              res([true, values]);
              setVisible(false);
            } catch (errorInfo) {
              console.log('Failed:', errorInfo);
            }
          };
          handle.current.onCancel = () => {
            res([false, null]);
            setVisible(false);
          };
        });
      },
      close: () => {
        handle.current.onCancel();
      },
    };
  }, []);
  return [modal, placeHolder];
};
