import React from 'react';
import { map } from 'lodash';
import {
  Box,
  Flex,
  Image,
  Stack,
  useDisclosure,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { format as formatDate } from 'date-fns';

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
          onClick={() => history.push(game.id)}
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
  const { hostGame, user } = useAuthorizedVM();
  const history = useHistory();

  // TODO: centralize host/join logic
  const handleClick = async () => {
    const game = await hostGame({
      name: formatDate(new Date(), 'MMM d, h:mmaaaaa'),
    }, {
      name: user.displayName.split(' ')[0],
      photoURL: user.photoURL,
    });
    history.push(game.id);
  };

  return (
    <Button {...props} onClick={handleClick}>New game</Button>
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
        <Image alt="How Many Times" src="logo.svg" mb={4} width={220} />
        <NewGameButton />
        <LoadGameButton />
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
