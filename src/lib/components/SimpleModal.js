import React from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/core';

const SimpleModal = (props) => {
  const {
    children,
    onSubmit,
    submitButton,
    title,
    footer,
    ...restProps
  } = props;
  return (
    <Modal {...restProps}>
      <ModalOverlay />
      <ModalContent borderRadius={4}>
        <form onSubmit={onSubmit}>
          <ModalHeader>
            <Text fontWeight="bold">{title}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            {footer}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default SimpleModal;
