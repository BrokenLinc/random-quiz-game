import React from 'react';

import { useGameVM } from '../vms/game';

const useMyTurnCallback = (cb) => {
  const { justBecameMyTurn } = useGameVM();

  React.useEffect(() => {
    justBecameMyTurn && cb();
  }, [justBecameMyTurn, cb]);
};

export default useMyTurnCallback;
