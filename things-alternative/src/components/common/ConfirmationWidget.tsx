import React from "react";
import styled from "@emotion/styled";

interface ConfirmationWidgetProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;

const Modal = styled.div<{ isVisible: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  transform: ${props => props.isVisible ? 'scale(1)' : 'scale(0.95)'};
  transition: transform 0.2s ease;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Message = styled.p`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  ${props => props.variant === 'primary' ? `
    background: #007AFF;
    color: white;
    border-color: #007AFF;
    
    &:hover {
      background: #0056CC;
      border-color: #0056CC;
    }
  ` : `
    background: white;
    color: #666;
    border-color: #E0E0E0;
    
    &:hover {
      background: #F5F5F5;
      border-color: #C0C0C0;
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
  }
`;

const ConfirmationWidget: React.FC<ConfirmationWidgetProps> = ({
  isVisible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onCancel]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Overlay isVisible={isVisible} onClick={handleOverlayClick}>
      <Modal isVisible={isVisible}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ButtonContainer>
      </Modal>
    </Overlay>
  );
};

export default ConfirmationWidget;
