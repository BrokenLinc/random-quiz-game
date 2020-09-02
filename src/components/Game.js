import { map, times } from 'lodash';
import React from 'react';
import {
  Avatar, Box, Divider, Flex, Heading, Image, Input, Stack, Text,
} from '@chakra-ui/core';
import { useCopyToClipboard } from 'react-use';
import { Link } from 'react-router-dom';

import { ROUNDS_PER_GAME } from '../utils/constants';
import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import friendlyJoin from '../utils/friendlyJoin';
import Button from './Button';
import Icon from './Icon';
import Suspender from './Suspender';
import { MotionBox } from './Motion';
import WindowConfetti from './WindowConfetti';

const getWaitingMessageForUsers = (users) => {
  const names = map(users, (user) => user.name);
  return `Waiting for ${friendlyJoin(names)}...`
};

const InvitationButton = (props) => {
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  if (state.error) icon = 'exclamation-triangle';
  else if (state.value) icon = 'check';

  return (
    <Button
      rightIcon={icon}
      onClick={() => copyToClipboard(window.location.href)}
      {...props}
    >
      Copy link
    </Button>
  );
};

const Question = () => {
  const vm = useGameVM();
  const { actions, game, myGameUser } = vm;
  const [myAnswer, setMyAnswer] = React.useState('');

  const handleOkayClick = () => {
    actions.answer(myAnswer);
  };

  const handleInputChange = (e) => {
    setMyAnswer(parseInt(e.target.value) || '');
  };

  return (
    <React.Fragment>
      <Heading size="xs" mb={2}>{game.question.category}</Heading>
      <Heading size="lg" mb={4}>{game.question.text}{!!game.question.note && '*'}</Heading>
      <Divider borderColor="gray.800" borderWidth={3} opacity={1} mb={4} />
      <Input
        defaultValue={myGameUser.answer}
        isDisabled={myGameUser.ready}
        value={myAnswer}
        onChange={handleInputChange}
        mb={4}
      />
      {!myGameUser.ready && (
        <Button isDisabled={!myAnswer} onClick={handleOkayClick}>Okay</Button>
      )}
      {!!game.question.note && (
        <Text fontSize="10px" opacity={0.8} mt={4}>*{game.question.note}</Text>
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

  if (game.everyoneReady) {
    if (game.isLastRound) {
      return (
        <React.Fragment>
          {myGameUser.isWinner ? (
            <>
              <WindowConfetti />
              <Heading size="xl" mb={4} textAlign="center">You win!</Heading>
            </>
          ) : (
            <Heading size="xl" mb={4} textAlign="center">{game.winner.name} wins!</Heading>
          )}
          <Button onClick={actions.start} size="lg" mx="auto" display="block">
            New game
          </Button>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Heading size="lg" mb={4} textAlign="center">Everyone's ready!</Heading>
        <Button onClick={actions.nextRound} size="lg" mx="auto" display="block">
          Start round {game.round + 2}!
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Heading size="xs" mb={2}>{game.question.text}</Heading>
      <Heading size="xl" mb={2}>{game.question.answer} times</Heading>
      <Heading size="xs" mb={4}>{game.question.answerNote}</Heading>
      <Divider borderColor="gray.800" borderWidth={3} opacity={1} mb={2} />
      <Stack mb={4}>
        <Flex align="center" justify="flex-end">
          <Text width="60px" fontSize="12px" textAlign="center">Answer</Text>
          <Text width="60px" fontSize="12px" textAlign="center">Score</Text>
          <Text width="60px" fontSize="12px" textAlign="center" fontWeight="bold">Total</Text>
        </Flex>
        {map(users, (user) => (
          <Flex key={user.id} align="center" borderTop="1px dashed black" pt={2}>
            <Stack isInline mr="auto">
              <Avatar size="xs" src={user.photoURL} mr={2} />
              <Text>{user.name}</Text>
            </Stack>
            <Text width="60px" textAlign="center">{user.answer || <Icon icon="comment-dots"/>}</Text>
            <Text width="60px" textAlign="center">+{user.score}</Text>
            <Text width="60px" textAlign="center" fontWeight="bold">{user.totalScore}</Text>
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
  const { loaded, error, game, myGameUser } = useGameVM();

  const colors = ['pink.300', 'blue.300', 'purple.300', 'yellow.300'];

  if (!loaded || error) return null;

  return times(ROUNDS_PER_GAME, (n) => {
    const bg = colors[n % colors.length];
    let size = 0;
    if (n === game.round + 1 && myGameUser.ready) size = 300; // big dot
    if (n <= game.round) size = '150vmax'; // full screen

    return (
      <MotionBox key={n} layoutId={`background-${n}`} position="fixed" borderRadius="50%" bg={bg} width={size} height={size} />
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
      <Box p={4} position="relative" maxWidth={375} width="100%">
        <Suspender {...vm}>
          {() => {
            if (!myGameUser) return (
              <Box textAlign="center">
                <Heading mb={4}>You've been invited!</Heading>
                <Button onClick={onJoinClick}>Join game</Button>
              </Box>
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
              <Heading size="lg" textAlign="center" width={260} mx="auto" mb={0}>{getWaitingMessageForUsers(game.unreadyUsers)}</Heading>
            );

            if (myGameUser.answer) return (
              <Scoreboard />
            );

            return (
              <Question />
            );
          }}
        </Suspender>
      </Box>
      <Link to="/">
        <Image layoutId="logo" alt="How Many Times" src="logo.svg" width={60} position="fixed" top="16px" left="16px" />
      </Link>
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
