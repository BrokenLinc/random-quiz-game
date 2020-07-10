/*
  API

  This builds on the data layer.
  It adds functions with a thin amount of "business logic".
 */

import firebase from 'firebase';

import dataLayer from './dataLayer';

const { increment } = firebase.firestore.FieldValue;

export const incrementGameUserScore = (gameId, userId, value) => {
  return dataLayer.updateGameUser(gameId, userId, { score: increment(value) });
};

export default {
  ...dataLayer,

  incrementGameUserScore,
};
