/*
  Game viewmodel

  This is a context provider/consumer pattern.
  The provider takes a gameId, and provides a viewmodel the game's properties and methods.
  The viewmodel context can be consumed with a single hook.
 */

import React from 'react';
import { find, get, map, mapValues } from 'lodash';

import useAuth from '../lib/useAuth';
import api from '../api';
import { PHASES_PER_ROUND, ROUNDS_PER_GAME } from '../utils/constants';
import getFilledArrayWithIndexValue from '../utils/getFilledArrayWithIndexValue';
import getReadyIndex from '../utils/getReadyIndex';
import getUserScores from '../utils/getUserScores';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const gameResponse = api.useGameData(gameId);
  const usersResponse = api.useGameUsersData(gameId);

  // aliases
  const myUser = auth.user;
  const loaded = gameResponse.loaded && usersResponse.loaded;
  const error = gameResponse.error || usersResponse.error;
  const game = gameResponse.data;

  // calculated values
  const readyIndex = getReadyIndex(game);
  let everyoneReady = true;
  const users = mapValues(usersResponse.data, (user) => {
    const ready = get(user.readies, readyIndex) || false;
    if (!ready) everyoneReady = false;
    return {
      ...user,
      answer: get(user.answers, game?.round),
      ready,
      scores: getUserScores(user.id, usersResponse.data),
      vote: get(user.votes, game?.round),
    };
  });
  const myGameUser = find(users, { id: myUser.id });

  // functions
  const answer = (text, userId = myGameUser.id) => {
    const answers = getFilledArrayWithIndexValue(myGameUser.answers, game.round, text);
    return api.updateGameUser(gameId, userId, {
      answers,
    });
  };
  const end = () => {
    return api.updateGame(gameId, {
      isOver: true,
    })
  };
  const join = (userValues) => {
    return api.addGameUser(gameId, myUser.id, userValues);
  };
  const next = () => {
    if (game.phase === PHASES_PER_ROUND - 1) {
      if (game.round === ROUNDS_PER_GAME - 1) {
        return end();
      }
      return nextRound();
    }
    return nextPhase();
  };
  const nextPhase = () => {
    const newPhase = game.phase + 1;
    return api.updateGame(gameId, {
      phase: newPhase,
    });
  };
  const nextRound = () => {
    return api.updateGame(gameId, {
      round: game.round + 1,
      phase: 0,
    });
  }
  const ready = (value = true, userId = myGameUser.id) => {
    const readies = getFilledArrayWithIndexValue(myGameUser.readies, readyIndex, value, false);
    return api.updateGameUser(gameId, userId, {
      readies,
    });
  };
  const start = () => {
    const promises = map(users, (user) => {
      api.updateGameUser(gameId, user.id, {
        answers: [],
        readies: [],
        votes: [],
      });
    });
    promises.push(api.updateGame(gameId, {
      hasStarted: true,
      isOver: false,
      round: 0,
      phase: 0,
    }));
  };
  const vote = (forUserId, userId = myGameUser.id) => {
    const votes = getFilledArrayWithIndexValue(myUser.votes, game.round, forUserId);
    return api.updateGameUser(gameId, userId, {
      votes,
    });
  };

  const vm = {
    actions: {
      answer,
      end,
      join,
      next,
      nextPhase,
      nextRound,
      ready,
      start,
      vote,
    },
    error,
    everyoneReady,
    game,
    loaded,
    myUser,
    users,
  };

  // console.log('game vm', vm);

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
