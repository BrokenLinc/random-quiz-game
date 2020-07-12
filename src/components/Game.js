import React from 'react';
import {
  Box,
} from '@chakra-ui/core';

import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import Suspender from './Suspender';

const GameView = () => {
  const vm = useGameVM();
  return (
    <Suspender {...vm}>
      {() => (
        <Box>
          Coming soon...
        </Box>
      )}
    </Suspender>
  );
};

const Game = (props) => (
  <AuthorizedVMProvider>
    <GameVMProvider gameId={props.match.params.gameId}>
      <GameView />
    </GameVMProvider>
  </AuthorizedVMProvider>
);

export default Game;
