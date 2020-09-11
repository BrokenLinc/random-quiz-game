/*
  Game viewmodel

  This is a context provider/consumer pattern.
  The provider takes a gameId, and provides a viewmodel the game's properties and methods.
  The viewmodel context can be consumed with a single hook.
 */

import React from 'react';
import { find, first, get, map, mapValues, sortBy, sum } from 'lodash';

import useAuth from '../lib/useAuth';
import api from '../api';
import { ROUNDS_PER_GAME } from '../utils/constants';
import generateQuestions from '../utils/generateQuestions';
import getFilledArrayWithIndexValue from '../utils/getFilledArrayWithIndexValue';
import getGameRound from '../utils/getGameRound';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const gameResponse = api.useGameData(gameId);
  const usersResponse = api.useGameUsersData(gameId);

  // aliases
  const myUser = auth.user;
  const loaded = gameResponse.loaded && usersResponse.loaded;
  const error = gameResponse.error || usersResponse.error;

  // calculated values
  const game = { ...gameResponse.data };
  const questions = game.questions ? JSON.parse(game.questions) : [];
  game.round = getGameRound(usersResponse.data);
  game.isLastRound = (game.round === ROUNDS_PER_GAME - 1);
  game.question = get(questions, game.round);
  game.everyoneAnswered = true;
  game.unansweredUsers = [];
  game.everyoneReady = true;
  game.unreadyUsers = [];
  const users = mapValues(usersResponse.data, (userData) => {
    const answer = get(userData.answers, game.round);
    const ready = get(userData.readies, game.round) || false;
    const scores = map(questions, (question, i) => {
      const answer = get(userData.answers, i);
      return answer ? Math.abs(Math.round(question.answer - answer)) : 0;
    });
    const user = {
      ...userData,
      answer,
      ready,
      scores,
      score: scores[game.round],
      totalScore: sum(scores),
    };
    if (!answer) {
      game.everyoneAnswered = false;
      game.unansweredUsers.push(user);
    }
    if (!ready) {
      game.everyoneReady = false;
      game.unreadyUsers.push(user);
    }
    return user;
  });
  const myGameUser = find(users, { id: myUser.id });
  game.winner = first(sortBy(users, ['score']));
  if (myGameUser && myGameUser === game.winner) {
    myGameUser.isWinner = true;
  }

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
  const ready = (value = true, userId = myGameUser.id) => {
    const readies = getFilledArrayWithIndexValue(myGameUser.readies, game.round, value, false);
    return api.updateGameUser(gameId, userId, {
      readies,
    });
  };
  const start = () => {
    const promises = map(users, (user) => {
      api.updateGameUser(gameId, user.id, {
        answers: [],
        readies: [],
      });
    });
    promises.push(api.updateGame(gameId, {
      hasStarted: true,
      isOver: false,
      questions: JSON.stringify(generateQuestions(10)),
    }));
  };

  const vm = {
    actions: {
      answer,
      end,
      join,
      ready,
      start,
    },
    error,
    game,
    loaded,
    myGameUser,
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
