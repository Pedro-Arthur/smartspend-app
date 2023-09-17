import React, { createContext, useMemo } from 'react';
import { useToast } from 'native-base';
import { AccessibilityInfo } from 'react-native';
import ToastAlert from '../components/ToastAlert';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  const showToast = (options) => {
    toast.show({
      render: ({ id }) => <ToastAlert id={id} toast={toast} {...options} />,
    });
    AccessibilityInfo.announceForAccessibility(`${options.title} ${options.description}`);
  };

  const toastValue = useMemo(() => ({ showToast }), [showToast]);

  return <ToastContext.Provider value={toastValue}>{children}</ToastContext.Provider>;
};
