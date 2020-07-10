import React from 'react';
import {
  Avatar,
  Box,
  Text,
  useDisclosure,
} from '@chakra-ui/core';
import { map } from 'lodash';
import { useCopyToClipboard } from 'react-use';

import SimpleModal from '../lib/components/SimpleModal';
import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import Button from './Button';
import IconButton from './IconButton';
import Suspender from './Suspender';

const Players = (props) => {
  const { incrementUserScore, usersInTurnOrder } = useGameVM();

  return (
    <Box {...props}>
      {map(usersInTurnOrder, (user, i) => {
        const firstName = user.displayName.split(' ')[0];
        return (
          <Box>
            <Avatar src={user.photoURL} />
            <Text>{firstName}</Text>
            <Text>{user.score || 0}</Text>
            <Button onClick={() => incrementUserScore(user.id, 10)}>+10 points</Button>
          </Box>
        );
      })}
    </Box>
  );
};

const InvitationButton = (props) => {
  const { game } = useGameVM();
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  let variantColor = 'green';
  if (state.error) {
    icon = 'exclamation-triangle';
    variantColor = 'orange';
  }
  else if (state.value) icon = 'check';

  return (
    <Button
      rightIcon={icon}
      variant="outline"
      variantColor={variantColor}
      onClick={() => copyToClipboard(game.id)}
      {...props}
    >
      Copy invitation code
    </Button>
  );
};

const StartGameButton = () => {
  const { restart } = useGameVM();

  return (
    <Button
      onClick={restart}
      rightIcon="arrow-right"
      size="lg"
      variantColor="green"
    >
      Start game
    </Button>
  );
};

const AddPlayerButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton onClick={onOpen} {...props} />
      <SimpleModal
        title="Invite more players"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Text marginBottom={4}>
          Send the invitation code to your friends.
          They can use it in the "Join game" option on the main menu.
        </Text>
        <InvitationButton autoFocus />
      </SimpleModal>
    </>
  );
};

const GameView = () => {
  const vm = useGameVM();
  const { hasStarted } = vm;

  return (
    <Suspender {...vm}>
      {() => (
        <Box>
          <Players />
          <AddPlayerButton icon="user-plus" />
          {hasStarted ? (
            <div>Game interface goes here</div>
          ) : (
            <StartGameButton />
          )}
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
