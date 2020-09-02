import { Box } from '@chakra-ui/core';
import React from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

const WindowConfetti = () => {
  const { width, height } = useWindowSize();
  return (
    <Box position="fixed" top={0} right={0} bottom={0} left={0}>
      <Confetti
        width={width}
        height={height}
      />
    </Box>
  );
};

export default WindowConfetti;
