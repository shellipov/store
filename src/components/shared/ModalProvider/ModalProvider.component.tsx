import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { Col } from '@shared/Col';
import { useAppTheme } from '@/hooks/useAppTheme';

type ModalContextType = {
    showModal: (content: React.ReactNode) => void;
    hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useAppTheme();
  const onPressModal = useCallback(() => {}, []);
  const showModal = useCallback((content: React.ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  }, [modalContent]) ;

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setModalContent(null);
  }, [modalContent]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <Col flex alignItems={'center'} pa={14} justifyContent={'center'} bg={theme.color.modalBackground}>
            <TouchableWithoutFeedback onPress={onPressModal}>
              <Col
                width bg={theme.color.bgAdditional} minHeight={220} ma={20}
                pa={20} radius={16} borderColor={theme.color.borderColor} borderWidth={1}>
                {modalContent}
              </Col>
            </TouchableWithoutFeedback>
          </Col>
        </TouchableWithoutFeedback>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
