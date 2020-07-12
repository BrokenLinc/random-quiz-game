import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Switch,
} from '@chakra-ui/core';
import { map } from 'lodash';

import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import Button from './Button';
import Splay from './Splay';
import Suspender from './Suspender';

const GameView = () => {
  const vm = useGameVM();
  const { actions, game, myUser, users } = vm;

  const onJoinClick = () => {
    actions.join({
      name: myUser.displayName.split(' ')[0],
      photoURL: myUser.photoURL,
    });
  };

  return (
    <Suspender {...vm}>
      {() => (
        <Box p={4}>
          <Stack isInline mb={4}>
            <Button onClick={onJoinClick}>Join game</Button>
            <Button onClick={actions.start}>Start game</Button>
            <Button onClick={actions.next}>Next</Button>
            <Button onClick={actions.end}>End game</Button>
          </Stack>
          <Splay type="Game" {...game} />
          {map(users, (user) => (
            <div key={user.id}>
              <Splay type="GameUser" {...user} />
              <Stack ml={4} mb={4}>
                <FormControl>
                  <FormLabel htmlFor={`${user.id}.ready`}>Ready</FormLabel>
                  <Switch id={`${user.id}.ready`} isChecked={user.ready} onChange={() => actions.ready(!user.ready, user.id)} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor={`${user.id}.answer`}>Input answer</FormLabel>
                  <Input id={`${user.id}.answer`} defaultValue={user.answer} onChange={(e) => actions.answer(e.target.value, user.id)} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor={`${user.id}.vote`}>Input vote (userId)</FormLabel>
                  <Input id={`${user.id}.vote`} defaultValue={user.vote} onChange={(e) => actions.vote(e.target.value, user.id)} />
                </FormControl>
              </Stack>
            </div>
          ))}
        </Box>
      )}
    </Suspender>
  );
};

const GameDebugger = (props) => (
  <AuthorizedVMProvider>
    <GameVMProvider gameId={props.match.params.gameId}>
      <GameView />
    </GameVMProvider>
  </AuthorizedVMProvider>
);

export default GameDebugger;
