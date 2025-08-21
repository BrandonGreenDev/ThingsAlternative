import { useState, useCallback } from 'react';

interface ConfirmationState {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isVisible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmation = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    setConfirmation({
      isVisible: true,
      title,
      message,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      onConfirm,
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmation(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    confirmation.onConfirm();
    hideConfirmation();
  }, [confirmation.onConfirm, hideConfirmation]);

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  };
};
