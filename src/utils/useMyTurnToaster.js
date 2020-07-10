import React from 'react';
import { useToast } from '@chakra-ui/core';

import useMyTurnCallback from './useMyTurnCallback';

const useMyTurnToaster = () => {
  const toast = useToast();

  const onMyTurn = React.useCallback(() => {
    toast({
      title: 'It is your turn!',
      status: 'success',
      position: 'bottom',
    });
  },[toast]);

  useMyTurnCallback(onMyTurn);
};

export default useMyTurnToaster;
