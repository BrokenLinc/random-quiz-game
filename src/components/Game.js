import { map, times } from 'lodash';
import React from 'react';
import {
  Avatar, Box, Divider, Flex, Heading, Input, Stack, Text,
} from '@chakra-ui/core';
import { useCopyToClipboard } from 'react-use';

import { PHASES_PER_ROUND, ROUNDS_PER_GAME } from '../utils/constants';
import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import friendlyJoin from '../utils/friendlyJoin';
import Button from './Button';
import Suspender from './Suspender';
import { MotionBox } from './Motion';

// TODO: WaitingForPlayers component
const getWaitingMessageForUsers = (users) => {
  const names = map(users, (user) => user.name);
  return `Waiting for ${friendlyJoin(names)}...`
};

const InvitationButton = (props) => {
  const { game } = useGameVM();
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  if (state.error) icon = 'exclamation-triangle';
  else if (state.value) icon = 'check';


  return (
    <Button
      rightIcon={icon}
      onClick={() => copyToClipboard(game.id)}
      {...props}
    >
      Copy invitation code
    </Button>
  );
};

const Question = () => {
  const vm = useGameVM();
  const { actions, game, myGameUser } = vm;
  const [myAnswer, setMyAnswer] = React.useState('');

  const onOkayClick = () => {
    actions.answer(myAnswer);
    actions.ready();
  };

  if (game.everyoneReady) return (
    <Button onClick={actions.next} size="lg">Vote now!</Button>
  );

  return (
    <React.Fragment>
      <Heading mb={4}>Q: {game.question}</Heading>
      <Divider borderColor="gray.800" borderWidth={3} opacity={1} mb={4} />
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
  const { actions, game, users } = vm;

  const setVote = (userId) => {
    actions.vote(userId);
    actions.ready();
  };

  if (game.everyoneReady) return (
    <Button onClick={actions.next} size="lg">See the results!</Button>
  );

  // TODO: randomize display based on static seed

  return (
    <React.Fragment>
      <Heading mb={4}>What's the best answer?</Heading>
      <Text fontWeight="bold" mb={4}>Q: "{game.question}"</Text>
      <Stack mb={4}>
        {map(users, (user) => {
          return (
            <Button key={user.id} onClick={() => setVote(user.id)}>{user.answer}</Button>
          );
        })}
      </Stack>
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
    <Button onClick={actions.next} size="lg">
      {game.isLastRound ? 'Start a new game!' : 'Start the next round!'}
    </Button>
  );

  return (
    <React.Fragment>
      <Heading mb={4}>Scoreboard</Heading>
      <Divider borderColor="gray.800" borderWidth={3} opacity={1} mb={4} />
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
        <Button onClick={onOkayClick} size="lg">Ready!</Button>
      )}
    </React.Fragment>
  );
};

const BackgroundSplashes = () => {
  const { loaded, error, game } = useGameVM();

  const colors = ['pink.400', 'blue.400', 'purple.400', 'yellow.400'];

  if (!loaded || error) return null;

  return times(ROUNDS_PER_GAME, (n) => {
    const bg = colors[n % colors.length];
    let size = 0;
    if (n === game.round + 1 && game.phase === PHASES_PER_ROUND - 1 && game.everyoneReady) size = 300; // big dot
    if (n <= game.round) size = '150vmax'; // full screen

    return (
      <MotionBox key={n} layoutId={`background-${n}`} position="absolute" borderRadius="50%" bg={bg} width={size} height={size} />
    );
  });
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
    <React.Fragment>
      <BackgroundSplashes />
      <Box p={4} position="relative" maxWidth={550} width="100%">
        <Suspender {...vm}>
          {() => {
            if (!myGameUser) return (
              <Button onClick={onJoinClick}>Join game</Button>
            );

            if (!game.hasStarted) return (
              <React.Fragment>
                <Heading mb={4}>Send your friends the link!</Heading>
                <Stack mb={8} spacing={2}>
                  {map(users, (user) => (
                    <Flex key={user.id} align="center">
                      <Avatar src={user.photoURL} mr={2} />
                      <Text fontWeight="bold">{user.name}</Text>
                    </Flex>
                  ))}
                </Stack>
                <Stack isInline spacing={2}>
                  <InvitationButton />
                  <Button rightIcon="play" onClick={actions.start}>Start game</Button>
                </Stack>
              </React.Fragment>
            );

            if (myGameUser.ready && !game.everyoneReady) return (
              <Heading mb={4}>{getWaitingMessageForUsers(game.unreadyUsers)}</Heading>
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
    </React.Fragment>
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
