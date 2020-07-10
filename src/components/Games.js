import React from 'react';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import {
  Box,
  Flex,
  Input,
  Stack,
  useDisclosure
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

import useAuth from '../lib/useAuth';
import SimpleModal from '../lib/components/SimpleModal';
import { AuthorizedVMProvider, useAuthorizedVM } from '../vms/authorized';
import Button from './Button';

const GamesListing = () => {
  const history = useHistory();
  const { haveGames, myGames } = useAuthorizedVM();

  if (!haveGames) {
    return <p>No games found.</p>;
  }

  return (
    <Stack>
      {map(myGames, (game, i) => (
        <Button
          key={game.id}
          onClick={() => history.push(`game/${game.id}`)}
          variant="outline"
          size="lg"
          variantColor="green"
          autoFocus={i === 0}
        >
          <Stack isInline justifyContent="space-between" width="100%">
            <Box>{game.name}</Box>
            <Box>{game.userIds.length} players</Box>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
};

const NewGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { hostGame, user } = useAuthorizedVM();
  const history = useHistory();

  const onSubmit = async (gameValues) => {
    // TODO: let the user supply a displayName and photoURL
    const game = await hostGame(gameValues, user);
    history.push(`game/${game.id}`);
  };

  return (
    <>
      <Button {...props} onClick={onOpen}>New game</Button>
      <SimpleModal
        title="Name your game"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        footer={<Button type="submit" rightIcon="arrow-right">Start playing</Button>}
      >
        <Input
          name="name"
          placeholder="Untitled Game"
          ref={register({ maxLength: 30, required: 'Required' })}
          autoFocus
        />
      </SimpleModal>
    </>
  );
};

const JoinGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { joinGame, user } = useAuthorizedVM();
  const history = useHistory();

  const onSubmit = async (values) => {
    const { gameId } = values;
    await joinGame(gameId, user);
    history.push(`game/${gameId}`);
  };

  return (
    <>
      <Button {...props} onClick={onOpen}>Join game</Button>
      <SimpleModal
        title="Enter invitation code"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        footer={<Button type="submit" rightIcon="arrow-right">Join game</Button>}
      >
        <Input
          name="gameId"
          placeholder="xxxxxxxxxxxx"
          ref={register({ maxLength: 20, required: 'Required' })}
          autoFocus
        />
      </SimpleModal>
    </>
  );
};

const LoadGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { haveGames } = useAuthorizedVM();

  const disabled = !haveGames;

  return (
    <>
      <Button {...props} onClick={onOpen} disabled={disabled}>Load game</Button>
      <SimpleModal
        title="Saved games"
        isOpen={isOpen}
        onClose={onClose}
      >
        <GamesListing />
      </SimpleModal>
    </>
  );
};

const GamesView = () => {
  const auth = useAuth();

  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Stack width={220}>
        <NewGameButton />
        <LoadGameButton />
        <JoinGameButton />
        <Button
          onClick={auth.signOut}
          alignSelf="center"
          variant="outline"
          size="sm"
          marginTop={4}
          minWidth={128}
          rightIcon="sign-out-alt"
        >
          Log out
        </Button>
      </Stack>
    </Flex>
  );
};

const Games = () => {
  return (
    <AuthorizedVMProvider>
      <GamesView />
    </AuthorizedVMProvider>
  );
};

export default Games;
