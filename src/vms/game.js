/*
  Game viewmodel

  This is a context provider/consumer pattern.
  The provider takes a gameId, and provides a viewmodel the game's properties and methods.
  The viewmodel context can be consumed with a single hook.
 */

import React from 'react';
import { find, get, map, mapValues, sum } from 'lodash';

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

  // calculated values
  const game = { ...gameResponse.data };
  game.question = get(game.questions, game.round);
  game.everyoneReady = true;
  const readyIndex = getReadyIndex(game);
  const users = mapValues(usersResponse.data, (user) => {
    const ready = get(user.readies, readyIndex) || false;
    if (!ready) game.everyoneReady = false;
    const scores = getUserScores(user.id, usersResponse.data);
    return {
      ...user,
      answer: get(user.answers, game.round),
      ready,
      score: sum(scores),
      scores,
      vote: get(user.votes, game.round),
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
      questions: [
        'What is a moose\'s favorite pizza topping?',
        'What that Russian cartoon about competitive eating called?',
        'How many bananas can fit inside an estranged father?',
        'Who invented the copper toothbrush?',
        'What comes next after "Macaroni"?',
        "Who is famous for defeating the French Bulldog Association?",
        "Where is Chipishka from?",
        "What is the capital of Pepperoni?",
        "Where can you find chopsticks at 5pm?",
        "Why does sleep never come?",
      ],
    }));
  };
  const vote = (forUserId, userId = myGameUser.id) => {
    const votes = getFilledArrayWithIndexValue(myGameUser.votes, game.round, forUserId);
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
    game,
    loaded,
    myGameUser,
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
