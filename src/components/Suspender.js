import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner
} from '@chakra-ui/core';

const Suspender = (props) => {
  const { error, loaded, children } = props;
  if (error) return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Error!</AlertTitle>
      <AlertDescription>Please refresh or go back.</AlertDescription>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );
  if (!loaded) return <Spinner />;
  return children();
};

export default Suspender;
