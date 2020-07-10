import React from 'react';
import { isEmpty } from 'lodash';

import useAuth from '../lib/useAuth';
import api from '../api';

const useCreateAuthorizedVM = () => {
  const auth = useAuth();
  const myUserId = auth.user?.id;
  const myGames = api.useUserGames(myUserId);

  // functions
  // TODO: useCallback
  const hostGame = async (gameValues, userValues) => {
    const game = await api.addGame({
      ...gameValues,
      hostUserId: myUserId,
    });
    await api.addGameUser(game.id, myUserId, userValues);
    return game;
  };

  const joinGame = (gameId, userValues) => {
    if (!myUserId) return false;
    return api.addGameUser(gameId, myUserId, userValues);
  };

  const vm = {
    loaded: auth.loaded && myGames.loaded,
    error: auth.error || myGames.error,
    user: auth.user,
    myGames: myGames.data,
    haveGames: !isEmpty(myGames.data),
    hostGame,
    joinGame,
  };

  // console.log(vm);

  return vm;
};

// Provider/consumer pattern, to make VM available to all descendants
const AuthorizedContext = React.createContext({});
export const useAuthorizedVM = () => React.useContext(AuthorizedContext);
export const AuthorizedVMProvider = (props) => {
  const vm = useCreateAuthorizedVM();
  return (
    <AuthorizedContext.Provider {...props} value={vm} />
  );
};
