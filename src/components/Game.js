import { map } from 'lodash';
import React from 'react';
import {
  Avatar, Box, Flex, Heading, Input, Radio, RadioGroup, Stack, Text,
} from '@chakra-ui/core';

import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import Button from './Button';
import Suspender from './Suspender';

const Question = () => {
  const vm = useGameVM();
  const { actions, game, myGameUser } = vm;
  const [myAnswer, setMyAnswer] = React.useState('');

  const onOkayClick = () => {
    actions.answer(myAnswer);
    actions.ready();
  };

  if (game.everyoneReady) return (
    <Button onClick={actions.next}>Vote now!</Button>
  );

  if (myGameUser.ready) return (
    <Heading mb={4}>Waiting on {map(game.unreadyUsers, (user) => user.name).join(', ')}...</Heading>
  );

  return (
    <React.Fragment>
      <Heading mb={4}>Q: {game.question}</Heading>
      <Input
        defaultValue={myGameUser.answer}
        isDisabled={myGameUser.ready}
        value={myAnswer}
        onChange={(e) => setMyAnswer(e.target.value)}
        mb={4}
      />
      {!myGameUser.ready && (
        <Button isDisabled={!myAnswer} onClick={onOkayClick}>Okay</Button>
      )}
    </React.Fragment>
  );
};

const Vote = () => {
  const vm = useGameVM();
  const { actions, game, myGameUser, users } = vm;
  const [myVote, setMyVote] = React.useState('');

  const onOkayClick = () => {
    actions.vote(myVote);
    actions.ready();
  };

  if (game.everyoneReady) return (
    <Button onClick={actions.next}>See the results!</Button>
  );

  if (myGameUser.ready) return (
    <Heading mb={4}>Waiting on {map(game.unreadyUsers, (user) => user.name).join(', ')}...</Heading>
  );

  return (
    <React.Fragment>
      <Heading mb={4}>What's the best answer?</Heading>
      <Text fontWeight="bold" mb={4}>Q: "{game.question}"</Text>
      <RadioGroup
        defaultValue={myGameUser.vote}
        isDisabled={myGameUser.ready}
        value={myVote}
        onChange={(e) => setMyVote(e.target.value)}
        mb={4}
      >
        {map(users, (user) => (
          <Radio value={user.id}>{user.answer}</Radio>
        ))}
      </RadioGroup>
      {!myGameUser.ready && (
        <Button isDisabled={!myVote} onClick={onOkayClick}>Okay</Button>
      )}
    </React.Fragment>
  );
};

const Scoreboard = () => {
  const vm = useGameVM();
  const { actions, game, myGameUser, users } = vm;

  const onOkayClick = () => {
    actions.ready();
  };

  // TODO: if it's the last round of the game, show as "total score" with "new game" button.

  if (game.everyoneReady) return (
    <Button onClick={actions.next}>
      {game.isLastRound ? 'Start a new game!' : 'Start the next round!'}
    </Button>
  );

  if (myGameUser.ready) return (
    <Heading mb={4}>Waiting on {map(game.unreadyUsers, (user) => user.name).join(', ')}...</Heading>
  );

  return (
    <React.Fragment>
      <Heading mb={4}>Scoreboard</Heading>
      <Stack mb={4} spacing={2}>
        {map(users, (user) => (
          <Flex key={user.id} align="center">
            <Avatar src={user.photoURL} mr={2} />
            <Text>{user.name}</Text>
            <Text ml={4}>[{user.score} pts]</Text>
          </Flex>
        ))}
      </Stack>
      {!myGameUser.ready && (
        <Button onClick={onOkayClick}>Okay</Button>
      )}
    </React.Fragment>
  );
};

const GameView = () => {
  const vm = useGameVM();
  const { actions, game, myUser, myGameUser, users } = vm;

  // TODO: centralize host/join logic
  const onJoinClick = () => {
    actions.join({
      name: myUser.displayName.split(' ')[0],
      photoURL: myUser.photoURL,
    });
  };

  return (
    <Box p={4}>
      <Suspender {...vm}>
        {() => {
          if (!myGameUser) return (
            <Button onClick={onJoinClick}>Join game</Button>
          );

          if (!game.hasStarted) return (
            <React.Fragment>
              <Heading mb={4}>Send your friends the link!</Heading>
              <Stack mb={4} spacing={2}>
                {map(users, (user) => (
                  <Flex key={user.id} align="center">
                    <Avatar src={user.photoURL} mr={2} />
                    <Text>{user.name}</Text>
                  </Flex>
                ))}
              </Stack>
              <Button onClick={actions.start}>Start game</Button>
            </React.Fragment>
          );

          if (game.phase === 0) return (
            <Question />
          );

          if (game.phase === 1) return (
            <Vote />
          );

          if (game.phase === 2) return (
            <Scoreboard />
          );
        }}
      </Suspender>
    </Box>
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
