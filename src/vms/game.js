/*
  Game viewmodel

  This is a context provider/consumer pattern.
  The provider takes a gameId, and provides a viewmodel the game's properties and methods.
  The viewmodel context can be consumed with a single hook.
 */

import React from 'react';
import { find, isEmpty, map, sample } from 'lodash';
import { usePrevious } from 'react-use';

import useAuth from '../lib/useAuth';
import api from '../api';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const myUserId = auth.user?.id;
  const game = api.useGameData(gameId);
  const users = api.useGameUsersData(gameId);
  const myUser = api.useGameUserData(gameId, myUserId);

  // aliases
  const loaded = game.loaded && users.loaded && myUser;
  const error = game.error || users.error || myUser.error;
  const userIds = game.data?.userIds || [];
  const currentTurnUserId = game.data?.currentTurnUserId;

  // calculated values
  const previousTurnUserId = usePrevious(currentTurnUserId);
  const hasStarted = !!currentTurnUserId;
  const isMyTurn = !!currentTurnUserId && currentTurnUserId === myUserId;
  const justBecameMyTurn = isMyTurn && (currentTurnUserId !== previousTurnUserId);
  const usersInTurnOrder = map(game.data?.userIds, (id) => {
    return find(users.data, { id });
  });

  // functions
  const incrementTurn = () => {
    if (isEmpty(userIds)) return false;

    const index = userIds.indexOf(currentTurnUserId);
    const nextIndex = (index + 1 ) % userIds.length;

    return api.updateGame(gameId, {
      currentTurnUserId: userIds[nextIndex],
    });
  };

  const incrementUserScore = (userId, value) => {
    return api.incrementGameUserScore(gameId, userId, value);
  };

  const restart = async () => {
    if (isEmpty(userIds)) return false;

    return api.updateGame(gameId, {
      currentTurnUserId: sample(userIds),
    });
  };

  const vm = {
    loaded,
    error,
    gameId,
    game: game.data,
    users: users.data,
    currentTurnUserId,
    hasStarted,
    isMyTurn,
    justBecameMyTurn,
    usersInTurnOrder,
    incrementTurn,
    incrementUserScore,
    restart,
  };

  // console.log('game vm', vm)

  return vm;
};

// Provider/consumer pattern, to make VM available to all descendants
const GameContext = React.createContext({});
export const useGameVM = () => React.useContext(GameContext);
export const GameVMProvider = (props) => {
  const { gameId, ...restProps } = props;
  const vm = useCreateGameVM({ gameId });
  return (
    <GameContext.Provider {...restProps} value={vm} />
  );
};
