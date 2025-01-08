import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 *
 * @param {*} ModalComponent
 * @param {*} props
 * @param {*} domNode
 * @returns {[
 * {open(form: any): Promise<any>;
 * close: () => void;},
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
      open(form) {
        setVisible(true);
        return new Promise((res) => {
          handle.current.onOk = async () => {
            if (form) {
              try {
                const values = await form.validateFields();
                res([true, values]);
              } catch (errorInfo) {
                console.log('Failed:', errorInfo);
              }
            } else {
              res([true, null]);
            }
            setVisible(false);
          };
          handle.current.onCancel = () => {
            res([false, null]);
            setVisible(false);
          };
        });
      },
      close: () => {
        setVisible(false);
      },
    };
  }, []);
  return [modal, placeHolder];
};
